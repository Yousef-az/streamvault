// handlers/webhooks.ts
import { Env, UserCredentials } from '../src/types';
import { createErrorResponse, logEvent, verifyStripeWebhookSignature } from '../src/utils/helpers';
import { sendEmail } from '../src/utils/email';

/**
 * Handles Stripe webhook events.
 */
export async function handleStripeWebhook(request: Request, env: Env): Promise<Response> {
    try {
        const signature = request.headers.get("stripe-signature");
        if (!signature) return createErrorResponse("Missing stripe-signature header", 400);

        const payload = await request.text();
        const isValid = verifyStripeWebhookSignature(payload, signature, env.STRIPE_WEBHOOK_SECRET);
        if (!isValid) {
            await logEvent(env, "webhook_invalid_signature", { signature: signature.substring(0, 20) + "..." });
            return createErrorResponse("Invalid webhook signature", 403);
        }

        const event = JSON.parse(payload);
        const eventType = event.type;
        await logEvent(env, `webhook_${eventType}`, {
            event_id: event.id,
            object: event.data.object.object,
        });

        switch (eventType) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const customerId = session.metadata.customer_id;
                const subscriptionId = session.subscription;
                if (customerId && subscriptionId) {
                    const kvKey = `user:${customerId}`;
                    const userData = await env.KV.get(kvKey);
                    if (userData) {
                        const userRecord = JSON.parse(userData) as UserCredentials;
                        userRecord.subscription_id = subscriptionId;
                        userRecord.stripe_customer_id = session.customer;
                        await env.KV.put(kvKey, JSON.stringify(userRecord));
                        await logEvent(env, "subscription_id_updated", { customer_id: customerId, subscription_id: subscriptionId });
                    }
                }
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                const subscriptionId = subscription.id;
                console.log(`Subscription ${subscriptionId} was canceled`);
                await logEvent(env, "subscription_canceled", { subscription_id: subscriptionId });
                break;
            }
            case "invoice.payment_succeeded": {
                const invoice = event.data.object;
                const subscriptionId = invoice.subscription;
                await logEvent(env, "payment_succeeded", {
                    subscription_id: subscriptionId,
                    amount: invoice.amount_paid,
                    currency: invoice.currency,
                });
                break;
            }
            case "invoice.payment_failed": {
                const invoice = event.data.object;
                const customerEmail = invoice.customer_email;
                const subscriptionId = invoice.subscription;
                if (customerEmail) {
                    try {
                        const emailHtml = `
              <h1>Payment Failed</h1>
              <p>We were unable to process your payment for your IPTV subscription.</p>
              <p>Please update your payment method or contact support.</p>
              <p>Your subscription will be paused if payment is not received within 7 days.</p>
            `;
                        await sendEmail(env, customerEmail, "Payment Failed - Action Required", emailHtml);
                    } catch (error) {
                        console.error("Failed to send payment failure email:", error);
                    }
                }
                await logEvent(env, "payment_failed", { subscription_id: subscriptionId, customer_email: customerEmail });
                break;
            }
            default:
                console.log(`Unhandled webhook event type: ${eventType}`);
        }

        return new Response("Webhook received", { status: 200 });
    } catch (err) {
        console.error("Error processing webhook:", err);
        await logEvent(env, "webhook_processing_error", { error: err instanceof Error ? err.message : String(err) });
        return createErrorResponse(`Webhook processing error: ${err instanceof Error ? err.message : String(err)}`, 500);
    }
}