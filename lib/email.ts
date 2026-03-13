import 'server-only';

import { TRAINING_PLAN_TEMPLATE } from '@/lib/email-templates';
import {
    extractExerciseNamesFromPlan,
    generateExerciseExplanation,
    matchPlanExercisesToLibrary,
} from '@/lib/exercises';
import type { QuestionnaireInput } from '@/lib/validation/questionnaire';
import type { TrainingPlanOutput } from '@/lib/validation/training-plan';
import * as nodemailer from 'nodemailer';

/**
 * Email service module using Nodemailer with Strato SMTP
 * Server-only - never import this from client components
 */

// Environment variables
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || 'AcroWorld <info@acroworld.de>';

// Validate configuration
const isConfigured = !!(SMTP_HOST && EMAIL_USER && EMAIL_PASSWORD);

if (!isConfigured) {
    console.warn('[Email] SMTP not fully configured - email sending will fail');
    console.warn('[Email] Missing:', {
        SMTP_HOST: !SMTP_HOST,
        EMAIL_USER: !EMAIL_USER,
        EMAIL_PASSWORD: !EMAIL_PASSWORD,
    });
}

/**
 * Email template enum
 */
export enum EmailTemplate {
    TrainingPlan = 'training-plan',
}

/**
 * Template variables interface
 */
export interface TrainingPlanVariables {
    RECEIVER_NAME: string;
    PLAN_TITLE: string;
    PLAN_SUMMARY: string;
    PROFILE_INTRO: string;
    EXERCISE_OVERVIEW: string;
    PROGRAM_SPLIT: string;
    DETAILED_SESSIONS: string;
    SAFETY_NOTES: string;
    PROGRESSION_RULES: string;
    COACHING_CTA: string;
}

type TemplateVariables = TrainingPlanVariables;

/**
 * Email sending result
 */
export interface SendEmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * Create nodemailer transporter
 */
function createTransporter() {
    if (!isConfigured) {
        return null;
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true, // SSL for port 465
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD,
        },
    });
}

// Singleton transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
    if (!transporter && isConfigured) {
        transporter = createTransporter();
    }
    return transporter;
}

/**
 * Get pre-compiled email template
 * Templates are embedded at build time for production compatibility
 */
function getTemplate(template: EmailTemplate): string | null {
    switch (template) {
        case EmailTemplate.TrainingPlan:
            return TRAINING_PLAN_TEMPLATE;
        default:
            console.error('[Email] Unknown template:', template);
            return null;
    }
}

/**
 * Interpolate variables in template
 * Replaces %VAR_NAME% with corresponding values
 */
function interpolateVariables(html: string, variables: TemplateVariables): string {
    let result = html;
    for (const [key, value] of Object.entries(variables)) {
        const placeholder = `%${key}%`;
        result = result.split(placeholder).join(value);
    }
    return result;
}

/**
 * Send a raw email
 */
export async function sendEmail(
    to: string,
    subject: string,
    html: string
): Promise<SendEmailResult> {
    const transport = getTransporter();

    if (!transport) {
        return { success: false, error: 'Email service not configured' };
    }

    try {
        console.log('[Email] Sending email to:', to);

        const info = await transport.sendMail({
            from: EMAIL_FROM,
            to,
            subject,
            html,
        });

        console.log('[Email] Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[Email] Failed to send email:', error);
        // Don't leak SMTP error details to client
        return { success: false, error: 'Failed to send email' };
    }
}

/**
 * Send an email using a template
 */
export async function sendEmailTemplate<T extends TemplateVariables>(
    template: EmailTemplate,
    to: string,
    subject: string,
    variables: T
): Promise<SendEmailResult> {
    const html = getTemplate(template);

    if (!html) {
        return { success: false, error: 'Email template not found' };
    }

    const interpolatedHtml = interpolateVariables(html, variables);
    return sendEmail(to, subject, interpolatedHtml);
}

/**
 * Format acro style focus for display (handles both string and array)
 */
function formatStyleFocus(styles: string | string[]): string {
    const styleLabels: Record<string, string> = {
        static: 'Static Poses',
        dynamic: 'Dynamic Moves',
        asymmetric: 'Asymmetric / Monos',
    };

    if (Array.isArray(styles)) {
        return styles.map((s) => styleLabels[s] || s).join(', ');
    }
    return styleLabels[styles] || styles;
}

/**
 * Format role for display
 */
function formatRole(role: string): string {
    const roleLabels: Record<string, string> = {
        base: 'Base',
        flyer: 'Flyer',
        both: 'Both (Base & Flyer)',
    };
    return roleLabels[role] || role;
}

/**
 * Format discipline for display
 */
function formatDiscipline(discipline: string): string {
    const labels: Record<string, string> = {
        'l-base': 'L-Base',
        standing: 'Standing',
        both: 'L-Base & Standing',
    };
    return labels[discipline] || discipline;
}

/**
 * Generate profile intro paragraph
 */
function generateProfileIntro(
    plan: TrainingPlanOutput,
    questionnaire?: QuestionnaireInput
): string {
    const role = formatRole(plan.profile.role);
    const styleFocus = formatStyleFocus(plan.profile.acroStyleFocus);
    const discipline = questionnaire
        ? formatDiscipline(questionnaire.acrobaticsType)
        : plan.profile.acrobaticsType;

    return `
    <p style="font-size: 15px; line-height: 1.7; color: #333; margin-bottom: 20px;">
      This plan is designed for you as a <strong>${role}</strong> training 
      <strong>${discipline}</strong> partner acrobatics with a focus on 
      <strong>${styleFocus}</strong>. 
      Remember: this is <em>supplemental training</em> — it builds the strength, mobility, and resilience 
      you need to support your acro practice, not replace it. Acro reveals your weaknesses; this plan addresses them.
    </p>
    <table style="width: 100%; font-size: 14px; margin-bottom: 24px; background: #f8f9fa; border-radius: 8px; padding: 16px;">
      <tr><td style="padding: 6px 12px 6px 0; color: #666; width: 140px;">Training Days:</td><td style="padding: 6px 0;"><strong>${plan.profile.trainingDays} days/week</strong></td></tr>
      <tr><td style="padding: 6px 12px 6px 0; color: #666;">Level:</td><td style="padding: 6px 0;"><strong>${plan.profile.level}</strong></td></tr>
      <tr><td style="padding: 6px 12px 6px 0; color: #666;">Setup:</td><td style="padding: 6px 0;"><strong>${plan.profile.setup}</strong></td></tr>
      ${plan.profile.limitations ? `<tr><td style="padding: 6px 12px 6px 0; color: #666;">Notes:</td><td style="padding: 6px 0;">${plan.profile.limitations}</td></tr>` : ''}
    </table>
  `;
}

/**
 * Generate exercise overview section with explanations
 */
function generateExerciseOverview(
    plan: TrainingPlanOutput,
    userRole: 'base' | 'flyer' | 'both'
): string {
    const exerciseNames = extractExerciseNamesFromPlan(plan);
    const { found, notFound } = matchPlanExercisesToLibrary(exerciseNames);

    const renderExerciseCard = (data: { name: string; description: string; tags: string; roleNote?: string }) => `
      <div style="background: #fafafa; border-left: 3px solid #e65100; padding: 12px 16px; margin-bottom: 12px; border-radius: 0 6px 6px 0;">
        <div style="margin-bottom: 4px;">
          <strong style="color: #333; font-size: 15px;">${data.name}</strong>
          ${data.roleNote ? `<span style="background: #fff3e0; color: #e65100; font-size: 11px; padding: 2px 8px; border-radius: 10px; margin-left: 8px;">${data.roleNote}</span>` : ''}
        </div>
        <p style="margin: 0 0 6px 0; color: #555; font-size: 14px; line-height: 1.5;">${data.description}</p>
        <span style="color: #888; font-size: 12px;">${data.tags}</span>
      </div>
    `;

    let html = `
    <div style="margin-bottom: 32px;">
      <h3 style="color: #e65100; font-size: 20px; margin-bottom: 16px; border-bottom: 2px solid #ffcc80; padding-bottom: 8px;">
        📚 Exercise Guide
      </h3>
      <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
        Here's why each exercise is in your plan and what to focus on:
      </p>
  `;

    for (const { name, exercise } of found) {
        const data = generateExerciseExplanation(name, exercise, userRole);
        html += renderExerciseCard(data);
    }

    for (const name of notFound) {
        const data = generateExerciseExplanation(name, null, userRole);
        html += renderExerciseCard(data);
    }

    html += '</div>';

    return html;
}

/**
 * Generate compact program split (A/B/C format)
 */
function generateProgramSplit(plan: TrainingPlanOutput): string {
    const sessions = plan.weeklyPlan[0]?.sessions || [];

    if (sessions.length === 0) {
        return '';
    }

    let html = `
    <div style="margin-bottom: 32px;">
      <h3 style="color: #e65100; font-size: 20px; margin-bottom: 16px; border-bottom: 2px solid #ffcc80; padding-bottom: 8px;">
        📋 Quick Reference: Your Weekly Split
      </h3>
      <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
        Screenshot this for quick reference at the gym:
      </p>
  `;

    sessions.forEach((session, index) => {
        const sessionLabel = String.fromCharCode(65 + index); // A, B, C...
        const allExercises = [
            ...session.main.map((e) => e.name),
            ...(session.skill || []).map((e) => e.name),
        ];

        html += `
      <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
        <h4 style="margin: 0 0 8px 0; color: #e65100; font-size: 16px;">
          Session ${sessionLabel}: ${session.name}
        </h4>
        <p style="margin: 0; font-size: 14px; color: #333;">
          ${allExercises.join(' • ')}
        </p>
      </div>
    `;
    });

    html += '</div>';

    return html;
}

/**
 * Generate detailed sessions HTML
 */
function generateDetailedSessions(plan: TrainingPlanOutput): string {
    const exerciseHtml = (ex: {
        name: string;
        sets?: string | null;
        reps?: string | null;
        duration?: string | null;
        notes?: string | null;
    }) => {
        let detail = '';
        if (ex.sets && ex.reps) detail = `<span style="color: #666;">(${ex.sets} × ${ex.reps})</span>`;
        else if (ex.duration) detail = `<span style="color: #666;">(${ex.duration})</span>`;
        else if (ex.reps) detail = `<span style="color: #666;">(${ex.reps})</span>`;
        const notes = ex.notes ? `<br><small style="color: #888;">${ex.notes}</small>` : '';
        return `<li style="margin-bottom: 8px;">${ex.name} ${detail}${notes}</li>`;
    };

    let html = `
    <div style="margin-bottom: 32px;">
      <h3 style="color: #e65100; font-size: 20px; margin-bottom: 16px; border-bottom: 2px solid #ffcc80; padding-bottom: 8px;">
        📅 Detailed Sessions
      </h3>
      <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
        Repeat this weekly schedule. Progress at your own pace using the guidelines below.
      </p>
  `;

    const sessions = plan.weeklyPlan[0]?.sessions || [];

    sessions.forEach((session) => {
        html += `
      <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h4 style="margin: 0 0 8px 0; color: #e65100; font-size: 16px;">${session.name}</h4>
        <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">${session.focus}</p>
        
        ${session.warmup.length > 0
                ? `
          <div style="margin-bottom: 12px;">
            <h5 style="margin: 0 0 4px 0; color: #333; font-size: 14px;">🔥 Warmup</h5>
            <p style="margin: 0; font-size: 14px; color: #666;">${session.warmup.join(', ')}</p>
          </div>
        `
                : ''
            }
        
        ${session.main.length > 0
                ? `
          <div style="margin-bottom: 12px;">
            <h5 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">💪 Main Work</h5>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px;">${session.main.map(exerciseHtml).join('')}</ul>
          </div>
        `
                : ''
            }
        
        ${session.skill && session.skill.length > 0
                ? `
          <div>
            <h5 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">🎯 Skill Work</h5>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px;">${session.skill.map(exerciseHtml).join('')}</ul>
          </div>
        `
                : ''
            }
      </div>
    `;
    });

    html += '</div>';

    return html;
}

/**
 * Generate safety notes HTML
 */
function generateSafetyNotes(plan: TrainingPlanOutput): string {
    if (plan.safetyNotes.length === 0) {
        return '';
    }

    return `
    <div style="background: #fff8e1; border-left: 4px solid #ff9800; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
      <h3 style="margin: 0 0 12px 0; color: #e65100; font-size: 16px;">⚠️ Safety Notes</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
        ${plan.safetyNotes.map((note) => `<li style="margin-bottom: 6px;">${note}</li>`).join('')}
      </ul>
    </div>
  `;
}

/**
 * Generate progression rules HTML
 */
function generateProgressionRules(plan: TrainingPlanOutput): string {
    if (plan.progressionRules.length === 0) {
        return '';
    }

    return `
    <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
      <h3 style="margin: 0 0 12px 0; color: #2e7d32; font-size: 16px;">📈 Progression Guidelines</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
        ${plan.progressionRules.map((rule) => `<li style="margin-bottom: 6px;">${rule}</li>`).join('')}
      </ul>
    </div>
  `;
}

/**
 * Generate coaching CTA section
 */
function generateCoachingCta(): string {
    return `
    <div style="background: linear-gradient(135deg, #fff5f0 0%, #ffe8e0 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <h3 style="margin: 0 0 12px 0; color: #e65100; font-size: 18px;">
        🎯 Want Personal Guidance?
      </h3>
      <p style="font-size: 14px; color: #333; line-height: 1.7; margin-bottom: 16px;">
        Our coaching team includes <strong>acrobats, physios, and gymnasts</strong> who can help you:
      </p>
      <ul style="text-align: left; font-size: 14px; color: #555; line-height: 1.8; margin: 0 auto 16px; max-width: 340px; padding-left: 20px;">
        <li>Review your form via video and give corrections</li>
        <li>Progress specific acroyoga poses you're working on</li>
        <li>Address injuries or limitations with personalized adjustments</li>
        <li>Build a fully customized program for your partnership</li>
      </ul>
      <div style="background: #e65100; color: white; display: inline-block; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 15px;">
        📧 Just reply to this email to get started
      </div>
      <p style="font-size: 13px; color: #888; margin-top: 12px; margin-bottom: 0;">
        We'll get back to you within 24-48 hours.
      </p>
    </div>
  `;
}

/**
 * Send a training plan via email
 */
export async function sendPlanEmail(
    email: string,
    plan: TrainingPlanOutput,
    questionnaire?: QuestionnaireInput
): Promise<SendEmailResult> {
    console.log('[Email] Preparing training plan email for:', email);

    const userRole = (questionnaire?.role || plan.profile.role) as 'base' | 'flyer' | 'both';

    const variables: TrainingPlanVariables = {
        RECEIVER_NAME: email.split('@')[0],
        PLAN_TITLE: plan.title,
        PLAN_SUMMARY: plan.summary,
        PROFILE_INTRO: generateProfileIntro(plan, questionnaire),
        EXERCISE_OVERVIEW: generateExerciseOverview(plan, userRole),
        PROGRAM_SPLIT: generateProgramSplit(plan),
        DETAILED_SESSIONS: generateDetailedSessions(plan),
        SAFETY_NOTES: generateSafetyNotes(plan),
        PROGRESSION_RULES: generateProgressionRules(plan),
        COACHING_CTA: generateCoachingCta(),
    };

    return sendEmailTemplate(
        EmailTemplate.TrainingPlan,
        email,
        `Your Personalized Training Plan: ${plan.title} 🤸`,
        variables
    );
}
