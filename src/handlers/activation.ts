// handlers/activation.ts
import { Env, UserCredentials } from '../types';
import {
    createErrorResponse,
    createJsonResponse,
    extractCredentials,
    fetchFromActivationPanel,
    formatDeviceName,
    logEvent,
    parseDeviceTypes,
    validateDeviceTypes,
    validateRequiredParams
} from '../utils/helpers';
import { REGIONAL_OPTIONS } from '../config';
import { buildEnhancedEmailBody, sendEmail } from '../utils/email';

/**
 * Activates or renews a subscription after Stripe payment success.
 * Sends individual emails with device-specific instructions.
 */
export async function handleActivate(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const subscriptionLength = url.searchParams.get("subscriptionLength");
        const region = url.searchParams.get("region");
        const customer_id = url.searchParams.get("customer_id");
        const deviceTypesParam = url.searchParams.get("device_types");
        const user_email = url.searchParams.get("user_email");
        const checkoutToken = url.searchParams.get("checkoutToken");
        const firstName = url.searchParams.get("firstName");

        const validationError = validateRequiredParams({
            subscriptionLength,
            region,
            customer_id,
            deviceTypesParam,
            user_email,
            checkoutToken,
        });
        if (validationError) return createErrorResponse(validationError, 400);

        // Parse and validate device types.
        const deviceTypes = parseDeviceTypes(deviceTypesParam!);
        const deviceTypesError = validateDeviceTypes(deviceTypes);
        if (deviceTypesError) return createErrorResponse(deviceTypesError, 400);

        // Validate the checkout token.
        const tokenData = await env.KV.get(`checkout:${checkoutToken}`);
        if (!tokenData) return createErrorResponse("Invalid or expired checkout token", 400);
        await env.KV.delete(`checkout:${checkoutToken}`);

        // Map region to bouquet configuration.
        const bouquetConfig = REGIONAL_OPTIONS[region!];
        if (!bouquetConfig) return createErrorResponse(`Invalid region: ${region}`, 400);

        // Calculate expiry date using a simple month approximation.
        const expiryDate = new Date(Date.now() + parseInt(subscriptionLength!) * 30 * 24 * 60 * 60 * 1000).toISOString();

        // Check for existing user credentials.
        const kvKey = `user:${customer_id}`;
        const stored = await env.KV.get(kvKey);
        let username: string | null = null;
        let password: string | null = null;
        let isRenewal = false;

        if (stored) {
            try {
                const { username: storedUser, password: storedPass } = JSON.parse(stored) as UserCredentials;
                if (!storedUser || !storedPass) throw new Error("Invalid stored credentials");

                // Attempt renewal.
                const renewUrl = `https://activationpanel.net/api/api.php?action=renew&type=m3u&username=${encodeURIComponent(storedUser)}&password=${encodeURIComponent(storedPass)}&sub=${subscriptionLength}&api_key=${env.ACTIVATION_PANEL_KEY}`;
                const renewData = await fetchFromActivationPanel(renewUrl);
                if (renewData.status !== "true") throw new Error(`Renewal failed: ${renewData.message || "Unknown error"}`);
                isRenewal = true;
                username = storedUser;
                password = storedPass;
                await logEvent(env, "subscription_renewed", {
                    customer_id,
                    user_email,
                    subscriptionLength,
                    region,
                    device_types: deviceTypes,
                });
            } catch (error) {
                console.error("Error renewing existing subscription:", error);
                await logEvent(env, "renewal_failed", {
                    customer_id,
                    error: error instanceof Error ? error.message : String(error),
                });
                // Fall through to create a new subscription.
            }
        }

        // If no valid credentials, create a new M3U subscription.
        if (!username || !password) {
            const createUrl = `https://activationpanel.net/api/api.php?action=new&type=m3u&sub=${subscriptionLength}&pack=${encodeURIComponent(bouquetConfig)}&api_key=${env.ACTIVATION_PANEL_KEY}`;

            // Log the URL being requested
            console.log("Creating new subscription with URL:", createUrl);

            const result = await fetchFromActivationPanel(createUrl);

            // Log the full response from the activation panel
            console.log("Activation Panel Response:", result);

            if (String(result.status).toLowerCase() !== "true" || !result.url) {
                await logEvent(env, "activation_failed", {
                    customer_id,
                    error: result.message || "Activation failed - no URL returned",
                    raw_response: result
                });
                return createErrorResponse(result.message || "Activation failed", 500);
            }

            const credentials = extractCredentials(result.url);

            if (!credentials) {
                await logEvent(env, "credential_extraction_failed", {
                    customer_id,
                    m3u_url: result.url
                });
                return createErrorResponse("Failed to extract credentials from activation response", 500);
            }

            username = credentials.username;
            password = credentials.password;

            await logEvent(env, "new_subscription_created", {
                customer_id,
                user_email,
                subscriptionLength,
                region,
                device_types: deviceTypes,
                username,
                m3u_url: result.url
            });
        }

        // Store the new or updated credentials.
        const updatedData: UserCredentials = {
            username,
            password,
            created_at: new Date().toISOString(),
            subscriptionLength: subscriptionLength as UserCredentials["subscriptionLength"],
            region: region as UserCredentials["region"],
            expiry_date: expiryDate,
            device_types: deviceTypes,
            user_email: user_email as string,
            status: "active",
            last_renewed: isRenewal ? new Date().toISOString() : undefined,
        };
        await env.KV.put(kvKey, JSON.stringify(updatedData));

        // Send individual device-specific emails.
        let emailSuccessCount = 0;
        let emailFailureCount = 0;
        const serverDomain = "iptv.blancosphere.com";

        for (const deviceType of deviceTypes) {
            try {
                const deviceName = formatDeviceName(deviceType);
                const subject = isRenewal
                    ? `Your IPTV Subscription Renewed - ${deviceName} Setup`
                    : `Welcome to Blancosphere - ${deviceName} Setup`;
                const emailHtml = buildEnhancedEmailBody(
                    deviceType,
                    username,
                    password,
                    region as string,
                    subscriptionLength as string,
                    isRenewal,
                    undefined, // portalUrl (optional)
                    undefined, // firstName (optional)
                    serverDomain
                );
                await sendEmail(env, user_email as string, subject, emailHtml);
                await logEvent(env, "email_sent", { device_types: deviceTypes, customer_id, user_email, isRenewal });
                emailSuccessCount++;
                if (deviceTypes.length > 1 && deviceType !== deviceTypes[deviceTypes.length - 1]) {
                    await new Promise(resolve => setTimeout(resolve, 500)); // Delay to prevent rate limiting.
                }
            } catch (emailErr) {
                console.error(`Failed to send email for ${deviceType}:`, emailErr);
                await logEvent(env, "email_failed", {
                    device_types: deviceTypes,
                    customer_id,
                    user_email,
                    error: emailErr instanceof Error ? emailErr.message : String(emailErr),
                });
                emailFailureCount++;
            }
        }

        await logEvent(env, "multi_device_email_complete", {
            customer_id,
            total_devices: deviceTypes.length,
            success_count: emailSuccessCount,
            failure_count: emailFailureCount,
        });

        return createJsonResponse({
            success: true,
            renewed: isRenewal,
            message: isRenewal
                ? `Your subscription has been renewed successfully. Check your email for setup instructions for your ${deviceTypes.length} device(s).`
                : `Your subscription has been activated successfully. Check your email for setup instructions for your ${deviceTypes.length} device(s).`,
            username,
            expiry_date: expiryDate,
            // Not returning the password for security.
        });
    } catch (err) {
        console.error("Unexpected error in handleActivate:", err);
        return createErrorResponse(`Internal server error: ${err instanceof Error ? err.message : String(err)}`, 500);
    }
}