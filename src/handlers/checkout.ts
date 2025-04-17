// handlers/checkout.ts
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
    validateRequiredParams
} from '../utils/helpers';
import { REGIONAL_OPTIONS, STRIPE_PRICES } from '../config';

/**
 * Creates a Stripe Checkout session based on the subscription selection.
 */
export async function handleCreateCheckout(request: Request, env: Env): Promise<Response> {
    try {
        const [body, parseError] = await handleErrors(request.json());
        if (parseError) return createErrorResponse(`Invalid request body: ${parseError.message}`, 400);

        // Handle device_types as either a string or an array.
        const rawSelection = body as any;
        const deviceTypes = Array.isArray(rawSelection.device_types)
            ? rawSelection.device_types
            : parseDeviceTypes(rawSelection.device_types || "");

        // Create a typed selection object.
        const selection: SubscriptionSelection = {
            subscriptionLength: rawSelection.subscriptionLength,
            region: rawSelection.region,
            customer_id: rawSelection.customer_id,
            device_types: deviceTypes,
            user_email: rawSelection.user_email,
        };

        const validationError = validateRequiredParams({
            subscriptionLength: selection.subscriptionLength,
            region: selection.region,
            customer_id: selection.customer_id,
            user_email: selection.user_email,
        });
        if (validationError) return createErrorResponse(validationError, 400);

        // Validate device types.
        const deviceTypesError = validateDeviceTypes(selection.device_types);
        if (deviceTypesError) return createErrorResponse(deviceTypesError, 400);

        // Validate email format.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(selection.user_email)) {
            return createErrorResponse("Invalid email format", 400);
        }

        // Map the region to a bouquet configuration.
        const bouquetSelection = REGIONAL_OPTIONS[selection.region];
        if (!bouquetSelection) return createErrorResponse(`Invalid region: ${selection.region}`, 400);

        // Build the success URL for activation.
        const successUrl = new URL("https://iptv-unified-worker.yousef-az.workers.dev/activate");
        successUrl.searchParams.set("subscriptionLength", selection.subscriptionLength);
        successUrl.searchParams.set("region", selection.region);
        successUrl.searchParams.set("customer_id", selection.customer_id);
        successUrl.searchParams.set("device_types", selection.device_types.join(","));
        successUrl.searchParams.set("user_email", selection.user_email);

        // Generate and attach a checkout token.
        const checkoutToken = generateSecureToken();
        successUrl.searchParams.set("checkoutToken", checkoutToken);
        await env.KV.put(`checkout:${checkoutToken}`, JSON.stringify({ selection, timestamp: Date.now() }), { expirationTtl: 3600 });

        // Determine the correct Stripe price.
        const stripePriceId = STRIPE_PRICES[selection.subscriptionLength];
        if (!stripePriceId) return createErrorResponse(`Invalid subscription length: ${selection.subscriptionLength}`, 400);

        // Build the form parameters for Stripe Checkout.
        const formParams = new URLSearchParams({
            success_url: successUrl.toString(),
            cancel_url: "https://blancosphere.com/canceled",
            mode: "subscription",
            "line_items[0][price]": stripePriceId,
            "line_items[0][quantity]": "1",
            "customer_email": selection.user_email,
        });
        formParams.append("metadata[subscriptionLength]", selection.subscriptionLength);
        formParams.append("metadata[region]", selection.region);
        formParams.append("metadata[customer_id]", selection.customer_id);
        formParams.append("metadata[device_types]", selection.device_types.join(","));
        formParams.append("metadata[bouquet]", bouquetSelection);
        formParams.append("metadata[checkout_token]", checkoutToken);

        // Log the checkout initiation.
        await logEvent(env, "checkout_initiated", {
            customer_id: selection.customer_id,
            user_email: selection.user_email,
            region: selection.region,
            subscriptionLength: selection.subscriptionLength,
            device_types: selection.device_types,
        });

        // Create the Stripe Checkout session.
        const [stripeResponse, stripeError] = await handleErrors(fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formParams,
        }));

        if (stripeError) {
            console.error("Stripe API error:", stripeError);
            await logEvent(env, "checkout_error", { customer_id: selection.customer_id, error: stripeError.message });
            return createErrorResponse("Failed to create Stripe checkout session", 500);
        }

        try {
            const sessionData = await handleStripeResponse(stripeResponse, (data) => ({
                url: data.url,
                session_id: data.id,
            }));
            await logEvent(env, "checkout_created", { customer_id: selection.customer_id, session_id: sessionData.session_id });
            return createJsonResponse(sessionData);
        } catch (error) {
            return createErrorResponse(`Stripe session error: ${error instanceof Error ? error.message : String(error)}`, 500);
        }
    } catch (err) {
        console.error("Unexpected error in handleCreateCheckout:", err);
        return createErrorResponse(`Internal server error: ${err instanceof Error ? err.message : String(err)}`, 500);
    }
}