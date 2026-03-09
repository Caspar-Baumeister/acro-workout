import 'server-only';

import { TRAINING_PLAN_TEMPLATE } from '@/lib/email-templates';
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
    PLAN_BODY: string;
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
        return styles.map(s => styleLabels[s] || s).join(', ');
    }
    return styleLabels[styles] || styles;
}

/**
 * Format a training plan into email-friendly HTML body
 */
export function formatPlanAsEmailBody(plan: TrainingPlanOutput): string {
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

    const profileHtml = `
    <table style="width: 100%; font-size: 14px; margin-bottom: 20px;">
      <tr><td style="padding: 6px 12px 6px 0; color: #666; width: 120px;">Role:</td><td style="padding: 6px 0;"><strong>${plan.profile.role}</strong></td></tr>
      <tr><td style="padding: 6px 12px 6px 0; color: #666;">Acro Type:</td><td style="padding: 6px 0;"><strong>${plan.profile.acrobaticsType}</strong></td></tr>
      <tr><td style="padding: 6px 12px 6px 0; color: #666;">Style Focus:</td><td style="padding: 6px 0;"><strong>${formatStyleFocus(plan.profile.acroStyleFocus)}</strong></td></tr>
      <tr><td style="padding: 6px 12px 6px 0; color: #666;">Level:</td><td style="padding: 6px 0;"><strong>${plan.profile.level}</strong></td></tr>
      <tr><td style="padding: 6px 12px 6px 0; color: #666;">Training:</td><td style="padding: 6px 0;"><strong>${plan.profile.trainingDays} days/week</strong></td></tr>
      <tr><td style="padding: 6px 12px 6px 0; color: #666;">Setup:</td><td style="padding: 6px 0;"><strong>${plan.profile.setup}</strong></td></tr>
      ${plan.profile.limitations ? `<tr><td style="padding: 6px 12px 6px 0; color: #666;">Notes:</td><td style="padding: 6px 0;">${plan.profile.limitations}</td></tr>` : ''}
    </table>
  `;

    const weeklyPlanHtml = plan.weeklyPlan
        .map((week) => {
            const sessionsHtml = week.sessions
                .map(
                    (session) => `
        <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 8px 0; color: #e65100; font-size: 16px;">${session.name}</h4>
          <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">${session.focus}</p>
          
          ${session.warmup.length > 0
                            ? `
            <div style="margin-bottom: 12px;">
              <h5 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">🔥 Warmup</h5>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px;">${session.warmup.map(exerciseHtml).join('')}</ul>
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
          
          ${session.accessory.length > 0
                            ? `
            <div style="margin-bottom: 12px;">
              <h5 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">🎯 Accessory</h5>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px;">${session.accessory.map(exerciseHtml).join('')}</ul>
            </div>
          `
                            : ''
                        }
          
          ${session.cooldown.length > 0
                            ? `
            <div>
              <h5 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">🧘 Cooldown</h5>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px;">${session.cooldown.map(exerciseHtml).join('')}</ul>
            </div>
          `
                            : ''
                        }
        </div>
      `
                )
                .join('');

            return `
      <div style="margin-bottom: 24px;">
        <h3 style="color: #e65100; font-size: 18px; border-bottom: 2px solid #ffcc80; padding-bottom: 8px; margin-bottom: 16px;">
          📅 Week ${week.week}: ${week.theme}
        </h3>
        ${sessionsHtml}
      </div>
    `;
        })
        .join('');

    const safetyNotesHtml =
        plan.safetyNotes.length > 0
            ? `
    <div style="background: #fff8e1; border-left: 4px solid #ff9800; padding: 16px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
      <h3 style="margin: 0 0 12px 0; color: #e65100; font-size: 16px;">⚠️ Safety Notes</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
        ${plan.safetyNotes.map((note) => `<li style="margin-bottom: 6px;">${note}</li>`).join('')}
      </ul>
    </div>
  `
            : '';

    const progressionRulesHtml =
        plan.progressionRules.length > 0
            ? `
    <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 16px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
      <h3 style="margin: 0 0 12px 0; color: #2e7d32; font-size: 16px;">📈 Progression Guidelines</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
        ${plan.progressionRules.map((rule) => `<li style="margin-bottom: 6px;">${rule}</li>`).join('')}
      </ul>
    </div>
  `
            : '';

    return `
    ${profileHtml}
    ${weeklyPlanHtml}
    ${safetyNotesHtml}
    ${progressionRulesHtml}
  `.trim();
}

/**
 * Send a training plan via email
 */
export async function sendPlanEmail(
    email: string,
    plan: TrainingPlanOutput
): Promise<SendEmailResult> {
    console.log('[Email] Preparing training plan email for:', email);

    const variables: TrainingPlanVariables = {
        RECEIVER_NAME: email.split('@')[0], // Use email prefix as name fallback
        PLAN_TITLE: plan.title,
        PLAN_SUMMARY: plan.summary,
        PLAN_BODY: formatPlanAsEmailBody(plan),
    };

    return sendEmailTemplate(
        EmailTemplate.TrainingPlan,
        email,
        `Your Personalized Training Plan: ${plan.title} 🤸`,
        variables
    );
}
