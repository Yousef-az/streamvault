// src/utils/email/send-email.ts
import { Env } from '../../types';

/**
 * Sends an email using SendGrid.
 *
 * @param env - Environment variables containing the SendGrid API key
 * @param toEmail - Recipient email address
 * @param subject - Email subject line
 * @param htmlContent - HTML content of the email
 * @param fromEmail - Optional sender email (defaults to support@blancosphere.com)
 * @param fromName - Optional sender name (defaults to Blancosphere Support)
 * @param replyTo - Optional reply-to email address
 * @param attachments - Optional array of attachments
 * @returns Promise that resolves when email is sent successfully
 * @throws Error if SendGrid API returns an error
 */
export async function sendEmail(
    env: Env,
    toEmail: string,
    subject: string,
    htmlContent: string,
    fromEmail: string = "support@blancosphere.com",
    fromName: string = "Blancosphere Support",
    replyTo?: string,
    attachments?: Array<{
        content: string;
        filename: string;
        type: string;
        disposition: "attachment" | "inline";
        content_id?: string;
    }>
) {
    const url = "https://api.sendgrid.com/v3/mail/send";

    // Build request body
    const body: any = {
        personalizations: [{ to: [{ email: toEmail }], subject }],
        from: { email: fromEmail, name: fromName },
        content: [{ type: "text/html", value: htmlContent }],
    };

    // Add optional parameters if provided
    if (replyTo) {
        body.reply_to = { email: replyTo };
    }

    if (attachments && attachments.length > 0) {
        body.attachments = attachments;
    }

    // Send the request
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    // Handle errors
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SendGrid Error: ${response.status} - ${errorText}`);
    }

    return response;
}