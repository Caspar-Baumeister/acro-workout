import 'server-only';

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import type { TrainingPlanOutput } from '@/lib/validation/training-plan';
import type { QuestionnaireInput } from '@/lib/validation/questionnaire';

/**
 * Firebase Admin SDK initialization
 * Server-only - for Firestore writes from Route Handlers
 * 
 * On Firebase App Hosting, credentials are automatically available via
 * Application Default Credentials (ADC). For local development, you can
 * set GOOGLE_APPLICATION_CREDENTIALS or use the Firebase emulator.
 */

let app: App | undefined;
let db: Firestore | undefined;

function getAdminApp(): App {
  if (!app) {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      // On Firebase App Hosting, ADC is automatically configured
      // For local dev, ensure GOOGLE_APPLICATION_CREDENTIALS is set
      // or Firebase emulator is running
      try {
        app = initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
      } catch (error) {
        console.error('[Firebase Admin] Failed to initialize:', error);
        throw error;
      }
    }
  }
  return app;
}

function getDb(): Firestore {
  if (!db) {
    const adminApp = getAdminApp();
    db = getFirestore(adminApp);
  }
  return db;
}

// Collection names
const SUBMISSIONS_COLLECTION = 'submissions';

export interface SubmissionRecord {
  createdAt: Date;
  email: string;
  emailHash?: string;
  questionnaire: QuestionnaireInput;
  plan: TrainingPlanOutput | null;
  emailSendStatus: 'pending' | 'sent' | 'failed';
  errorMessage?: string;
}

/**
 * Save a submission record to Firestore
 * Returns document ID on success, null on failure
 */
export async function saveSubmission(data: {
  email: string;
  questionnaire: QuestionnaireInput;
  plan: TrainingPlanOutput | null;
  emailSendStatus: 'pending' | 'sent' | 'failed';
  errorMessage?: string;
}): Promise<string | null> {
  try {
    const firestore = getDb();
    const record: SubmissionRecord = {
      createdAt: new Date(),
      email: data.email,
      questionnaire: data.questionnaire,
      plan: data.plan,
      emailSendStatus: data.emailSendStatus,
      errorMessage: data.errorMessage,
    };

    const docRef = await firestore.collection(SUBMISSIONS_COLLECTION).add(record);
    console.log('[Firebase Admin] Saved submission:', docRef.id);
    return docRef.id;
  } catch (error) {
    // Log error but don't throw - persistence shouldn't block user flow
    console.error('[Firebase Admin] Failed to save submission:', error);
    return null;
  }
}

/**
 * Update submission with delivery status
 */
export async function updateSubmissionStatus(
  submissionId: string,
  status: 'sent' | 'failed',
  errorMessage?: string
): Promise<void> {
  try {
    const firestore = getDb();
    await firestore.collection(SUBMISSIONS_COLLECTION).doc(submissionId).update({
      emailSendStatus: status,
      ...(errorMessage && { errorMessage }),
      updatedAt: new Date(),
    });
    console.log('[Firebase Admin] Updated submission status:', submissionId, status);
  } catch (error) {
    // Log error but don't throw
    console.error('[Firebase Admin] Failed to update submission:', error);
  }
}

/**
 * Check rate limit by email (simple throttle)
 * Returns true if request should be allowed, false if rate limited
 */
export async function checkRateLimit(
  email: string,
  windowMs: number = 60 * 60 * 1000, // 1 hour default
  maxRequests: number = 3
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const firestore = getDb();
    const windowStart = new Date(Date.now() - windowMs);
    
    const recentSubmissions = await firestore
      .collection(SUBMISSIONS_COLLECTION)
      .where('email', '==', email)
      .where('createdAt', '>=', windowStart)
      .get();

    const count = recentSubmissions.size;
    const allowed = count < maxRequests;
    const remaining = Math.max(0, maxRequests - count);

    return { allowed, remaining };
  } catch (error) {
    // On error, allow the request (fail open for UX)
    console.error('[Firebase Admin] Rate limit check failed:', error);
    return { allowed: true, remaining: 1 };
  }
}
