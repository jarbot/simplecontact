import { Resend } from 'resend';

export interface ContactSubmission {
  name: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Send email notification for a new contact form submission
 */
export async function sendContactNotification(submission: ContactSubmission): Promise<{ success: boolean; error?: string }> {
  const toEmail = process.env.CONTACT_EMAIL;

  if (!toEmail) {
    console.error('CONTACT_EMAIL environment variable not set');
    return { success: false, error: 'Email not configured' };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY environment variable not set');
    return { success: false, error: 'Email service not configured' };
  }

  // Initialize Resend client lazily to avoid build-time errors
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Contact Form <onboarding@resend.dev>',
      to: toEmail,
      subject: `New contact from ${submission.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a></p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Submitted at: ${new Date().toISOString()}<br>
          ${submission.ipAddress ? `IP: ${submission.ipAddress}<br>` : ''}
        </p>
      `,
      text: `
New Contact Form Submission

Name: ${submission.name}
Email: ${submission.email}

Submitted at: ${new Date().toISOString()}
${submission.ipAddress ? `IP: ${submission.ipAddress}` : ''}
      `.trim(),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
