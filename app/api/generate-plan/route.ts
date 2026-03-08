import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { generatePlanRequestSchema } from '@/lib/validation';
import { generateTrainingPlan } from '@/lib/gemini';
import { sendPlanEmail } from '@/lib/email';
import { saveSubmission, checkRateLimit } from '@/lib/firebase/admin';

/**
 * API Response types
 */
interface SuccessResponse {
  ok: true;
}

interface ErrorResponse {
  ok: false;
  code: string;
  message: string;
  errors?: Record<string, string[]>;
}

type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * In-memory rate limiter for additional protection
 * This provides fast, per-IP rate limiting without database calls
 * In production, Firestore-based rate limiting provides the main protection
 */
const ipRateLimits = new Map<string, { count: number; resetAt: number }>();
const IP_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const IP_RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateLimits.get(ip);

  // Clean up old entries periodically
  if (ipRateLimits.size > 1000) {
    for (const [key, value] of ipRateLimits.entries()) {
      if (value.resetAt < now) ipRateLimits.delete(key);
    }
  }

  if (!entry || entry.resetAt < now) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + IP_RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= IP_RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get client IP from headers
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Create error response
 */
function errorResponse(
  code: string,
  message: string,
  status: number,
  errors?: Record<string, string[]>
): NextResponse<ErrorResponse> {
  const body: ErrorResponse = { ok: false, code, message };
  if (errors) body.errors = errors;
  return NextResponse.json(body, { status });
}

/**
 * POST /api/generate-plan
 *
 * Server-side endpoint for training plan generation and delivery.
 * Flow:
 * 1. Rate limit check (IP + email based)
 * 2. Request validation (Zod)
 * 3. Generate plan (Gemini)
 * 4. Send email (Nodemailer/Strato SMTP)
 * 5. Persist submission (Firestore)
 * 6. Return response
 */
export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  const startTime = Date.now();

  try {
    // 1. Basic request size check (prevent huge payloads)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 50000) {
      console.warn('[API] Request too large:', contentLength);
      return errorResponse('PAYLOAD_TOO_LARGE', 'Request payload too large', 413);
    }

    // 2. IP-based rate limiting (fast, in-memory)
    const clientIp = await getClientIp();
    if (!checkIpRateLimit(clientIp)) {
      console.warn('[API] IP rate limited:', clientIp);
      return errorResponse(
        'RATE_LIMITED',
        'Too many requests. Please wait a moment before trying again.',
        429
      );
    }

    // 3. Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse('INVALID_JSON', 'Invalid JSON in request body', 400);
    }

    // 4. Validate input with Zod
    const parseResult = generatePlanRequestSchema.safeParse(body);
    if (!parseResult.success) {
      const flatErrors = parseResult.error.flatten();
      console.warn('[API] Validation failed:', flatErrors.fieldErrors);
      return errorResponse(
        'VALIDATION_ERROR',
        'Invalid submission data. Please check your inputs.',
        400,
        flatErrors.fieldErrors as Record<string, string[]>
      );
    }

    const { questionnaire } = parseResult.data;

    // 5. Email-based rate limiting (Firestore, more thorough)
    const rateLimitResult = await checkRateLimit(questionnaire.email);
    if (!rateLimitResult.allowed) {
      console.warn('[API] Email rate limited:', questionnaire.email);
      return errorResponse(
        'RATE_LIMITED',
        'You have already requested plans recently. Please check your email or try again later.',
        429
      );
    }

    // 6. Generate training plan via Gemini
    console.log('[API] Generating plan for:', questionnaire.email);
    let plan;
    try {
      plan = await generateTrainingPlan(questionnaire);
    } catch (error) {
      console.error('[API] Gemini generation failed:', error);
      // Save failed submission for debugging
      await saveSubmission({
        email: questionnaire.email,
        questionnaire,
        plan: null,
        emailSendStatus: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Plan generation failed',
      });
      return errorResponse(
        'GENERATION_FAILED',
        'We couldn\'t generate your plan right now. Please try again in a moment.',
        502
      );
    }

    // 7. Send plan via Nodemailer (Strato SMTP)
    console.log('[API] Sending email to:', questionnaire.email);
    const emailResult = await sendPlanEmail(questionnaire.email, plan);

    // 8. Save submission to Firestore (don't block on failure)
    const submissionId = await saveSubmission({
      email: questionnaire.email,
      questionnaire,
      plan,
      emailSendStatus: emailResult.success ? 'sent' : 'failed',
      errorMessage: emailResult.error,
    });

    if (!emailResult.success) {
      console.error('[API] Email sending failed:', emailResult.error);
      return errorResponse(
        'EMAIL_FAILED',
        'Your plan was created but we couldn\'t send the email. Please try again.',
        502
      );
    }

    // 9. Success!
    const duration = Date.now() - startTime;
    console.log('[API] Success! Plan sent to', questionnaire.email, 'in', duration, 'ms');

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return errorResponse(
      'INTERNAL_ERROR',
      'An unexpected error occurred. Please try again.',
      500
    );
  }
}

/**
 * Handle non-POST requests
 */
export async function GET(): Promise<NextResponse<ErrorResponse>> {
  return errorResponse('METHOD_NOT_ALLOWED', 'Only POST requests are allowed', 405);
}

export async function PUT(): Promise<NextResponse<ErrorResponse>> {
  return errorResponse('METHOD_NOT_ALLOWED', 'Only POST requests are allowed', 405);
}

export async function DELETE(): Promise<NextResponse<ErrorResponse>> {
  return errorResponse('METHOD_NOT_ALLOWED', 'Only POST requests are allowed', 405);
}

/**
 * Runtime configuration
 */
export const runtime = 'nodejs';
export const maxDuration = 60; // Allow up to 60 seconds for Gemini + Email sending
