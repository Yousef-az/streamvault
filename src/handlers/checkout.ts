// src/handlers/checkout.ts

import { Env, SubscriptionSelection } from '../types';
import {
    createErrorResponse,
    createJsonResponse,
    generateSecureToken,
    handleErrors,
    handleStripeResponse,
    logEvent,
    parseDeviceTypes,
    validateDeviceTypes,
    validateRequiredParams,
} from '../utils/helpers';
import { REGIONAL_OPTIONS, STRIPE_PRICES } from '../config';

/**
 * 🚀 Creates a Stripe Checkout session dynamically based on plan, region, and user info.
 * Includes support for promo code UI, validation, KV caching, metadata injection, and returns the Stripe checkout URL.
 */
export async function handleCreateCheckout(request: Request, env: Env): Promise<Response> {
    try {
        // 📥 Parse request body safely
        const [body, parseError] = await handleErrors(request.json());
        if (parseError) return createErrorResponse(`Invalid request body: ${parseError.message}`, 400);

        const rawSelection = body as any;

        // 🧠 Handle device types
        const deviceTypes = Array.isArray(rawSelection.device_types)
            ? rawSelection.device_types
            : parseDeviceTypes(rawSelection.device_types || "");

        const generatedCustomerId = generateSecureToken(12);

        const selection: SubscriptionSelection = {
            subscriptionLength: rawSelection.subscriptionLength,
            region: rawSelection.region,
            customer_id: rawSelection.customer_id || generatedCustomerId,
            device_types: deviceTypes,
            user_email: rawSelection.user_email,
            plan: rawSelection.plan?.toLowerCase() || 'launch',
        };

        // ✅ Required field validation
        const validationError = validateRequiredParams({
            subscriptionLength: selection.subscriptionLength,
            region: selection.region,
            user_email: selection.user_email,
            plan: selection.plan,
        });
        if (validationError) return createErrorResponse(validationError, 400);

        const deviceTypesError = validateDeviceTypes(selection.device_types);
        if (deviceTypesError) return createErrorResponse(deviceTypesError, 400);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(selection.user_email)) {
            return createErrorResponse("Invalid email format", 400);
        }

        const bouquetSelection = REGIONAL_OPTIONS[selection.region];
        if (!bouquetSelection) return createErrorResponse(`Invalid region: ${selection.region}`, 400);

        const stripePriceId = STRIPE_PRICES[selection.subscriptionLength];
        if (!stripePriceId) return createErrorResponse(`Invalid subscription length: ${selection.subscriptionLength}`, 400);

        // 🌐 Build success URL with metadata
        const checkoutToken = generateSecureToken();
        const successUrl = new URL("https://iptv-unified-worker.yousef-az.workers.dev/activate");
        successUrl.searchParams.set("subscriptionLength", selection.subscriptionLength);
        successUrl.searchParams.set("region", selection.region);
        successUrl.searchParams.set("customer_id", selection.customer_id);
        successUrl.searchParams.set("device_types", selection.device_types.join(","));
        successUrl.searchParams.set("user_email", selection.user_email);
        successUrl.searchParams.set("plan", selection.plan);
        successUrl.searchParams.set("checkoutToken", checkoutToken);

        // 🗃️ Store to KV
        await env.KV.put(
            `checkout:${checkoutToken}`,
            JSON.stringify({ selection, timestamp: Date.now() }),
            { expirationTtl: 3600 }
        );

        // 🧾 Build Stripe Checkout session params
        const formParams = new URLSearchParams({
            success_url: successUrl.toString(),
            cancel_url: "https://blancosphere.com/canceled",
            mode: "subscription",
            "line_items[0][price]": stripePriceId,
            "line_items[0][quantity]": "1",
            customer_email: selection.user_email,
        });

        // 🏷️ Include metadata
        formParams.append("metadata[subscriptionLength]", selection.subscriptionLength);
        formParams.append("metadata[region]", selection.region);
        formParams.append("metadata[device_types]", selection.device_types.join(","));
        formParams.append("metadata[plan]", selection.plan);
        formParams.append("metadata[bouquet]", bouquetSelection);
        formParams.append("metadata[checkout_token]", checkoutToken);
        formParams.append("metadata[customer_id]", selection.customer_id);

        // ✅ 👇 Enable built-in Stripe Promo Code UI
        formParams.append("allow_promotion_codes", "true");

        await logEvent(env, "checkout_initiated", {
            customer_id: selection.customer_id,
            user_email: selection.user_email,
            region: selection.region,
            subscriptionLength: selection.subscriptionLength,
            device_types: selection.device_types,
            plan: selection.plan,
        });

        // 🔄 Send to Stripe
        const [stripeResponse, stripeError] = await handleErrors(
            fetch("https://api.stripe.com/v1/checkout/sessions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formParams,
            })
        );

        if (stripeError) {
            console.error("Stripe API error:", stripeError);
            await logEvent(env, "checkout_error", {
                customer_id: selection.customer_id,
                error: stripeError.message,
            });
            return createErrorResponse("Failed to create Stripe checkout session", 500);
        }

        // 🎯 Final response
        const sessionData = await handleStripeResponse(stripeResponse, (data) => ({
            url: data.url,
            session_id: data.id,
        }));

        await logEvent(env, "checkout_created", {
            customer_id: selection.customer_id,
            session_id: sessionData.session_id,
            plan: selection.plan,
        });

        return createJsonResponse(sessionData);
    } catch (err) {
        console.error("Unexpected error in handleCreateCheckout:", err);
        return createErrorResponse(
            `Internal server error: ${err instanceof Error ? err.message : String(err)}`,
            500
        );
    }
}