// src/handlers/debug.ts
import { Env } from '../types';
import { buildEnhancedEmailBody } from '../utils/email';

/**
 * Debug handler for previewing email templates
 * IMPORTANT: For development use only!
 */
export async function handleDebug(request: Request, env: Env): Promise<Response> {
    // Get parameters from URL
    const url = new URL(request.url);

    // Extract all parameters with defaults
    const deviceType = url.searchParams.get('device_type') || 'smart_tv';
    const username = url.searchParams.get('username') || 'test_user123';
    const password = url.searchParams.get('password') || 'SecurePass456!';
    const region = url.searchParams.get('region') || 'north_america';
    const subscriptionLength = url.searchParams.get('subscription_length') || '12';
    const isRenewal = url.searchParams.get('is_renewal') === 'true';
    const firstName = url.searchParams.get('first_name') || 'Test User';
    const serverDomain = url.searchParams.get('server_domain') || 'iptv.blancosphere.com';
    const portalUrl = url.searchParams.get('portal_url') || 'https://portal.blancosphere.com';

    // Generate email HTML
    try {
        const emailHtml = buildEnhancedEmailBody(
            deviceType,
            username,
            password,
            region,
            subscriptionLength,
            isRenewal,
            portalUrl,
            firstName,
            serverDomain
        );

        // Return the email HTML
        return new Response(emailHtml, {
            headers: { 'Content-Type': 'text/html' }
        });
    } catch (error) {
        // Return error details
        return new Response(`Error generating email template: ${error instanceof Error ? error.message : String(error)}`, {
            status: 500,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}