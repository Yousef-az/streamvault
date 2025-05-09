// src/handlers/lookup-session.ts

import { Env } from '../types';
import { createErrorResponse, createJsonResponse } from '../utils/helpers';

interface StripeSession {
    id: string;
    metadata?: Record<string, string>;
    customer_email?: string;
    customer_details?: {
        email?: string;
    };
    subscription?: string;
}

export async function handleLookupSession(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const sessionId = url.searchParams.get('id');
        if (!sessionId) {
            return createErrorResponse('Missing session ID', 400);
        }

        const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}?expand[]=customer_details`, {
            headers: {
                Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!stripeRes.ok) {
            const text = await stripeRes.text();
            return createErrorResponse(`Stripe API error: ${stripeRes.status} - ${text}`, 500);
        }

        const session = (await stripeRes.json()) as StripeSession;

        const metadata = session.metadata || {};
        const customerEmail = session.customer_email || session.customer_details?.email || '';
        const region = metadata.region || 'global';
        const subscriptionLength = metadata.subscriptionLength || '1';
        let deviceTypes: string[] = ['other'];

        try {
            deviceTypes = metadata.device_types
                ? JSON.parse(metadata.device_types)
                : ['other'];
        } catch {
            deviceTypes = ['other'];
        }

        return createJsonResponse({
            email: customerEmail,
            region,
            subscriptionLength,
            deviceTypes,
            customerId: metadata.customer_id,
            sessionId: session.id,
            subscriptionId: session.subscription,
        });
    } catch (err) {
        console.error('⚠️ Lookup session error:', err);
        return createErrorResponse(
            `Failed to lookup session: ${err instanceof Error ? err.message : String(err)}`,
            500
        );
    }
}