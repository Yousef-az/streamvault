// src/handlers/webhooks.ts
import { Env, UserCredentials } from '../types';
import {
    createErrorResponse,
    logEvent,
    verifyStripeWebhookSignature,
} from '../utils/helpers';
import { sendEmail, buildEnhancedEmailBody } from '../utils/email';

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
            await logEvent(env, "webhook_invalid_signature", {
                signature: signature.substring(0, 20) + "...",
            });
            return createErrorResponse("Invalid webhook signature", 403);
        }

        const event = JSON.parse(payload);
        const eventType = event.type;

        await logEvent(env, `webhook_${eventType}`, {
            event_id: event.id,
            object: event.data.object.object,
        });

        // ------------------------------------------
        // 🎯 Main Checkout Handler
        // ------------------------------------------
        if (eventType === "checkout.session.completed") {
            const session = event.data.object;

            // Extract all necessary metadata from session
            const customerId = session.metadata?.customer_id;
            const subscriptionLength = session.metadata?.subscriptionLength || "1";
            const region = session.metadata?.region || "global";

            // Safely parse device types with error handling
            let deviceTypes: string[] = ["other"];
            try {
                const parsedTypes = JSON.parse(session.metadata?.device_types || "[]");
                if (Array.isArray(parsedTypes) && parsedTypes.length > 0) {
                    deviceTypes = parsedTypes;
                }
            } catch (err) {
                console.log("⚠️ Failed to parse device_types JSON, using default:", err);
            }

            const customerEmail = session.customer_details?.email || session.customer_email || "";

            console.log("✅ Checkout complete:", {
                email: customerEmail,
                region,
                devices: deviceTypes,
                subscription_length: subscriptionLength
            });
            console.log("📌 Stripe Customer ID:", session.customer);
            console.log("📌 Stripe Subscription ID:", session.subscription);
            console.log("📌 Metadata customer_id:", customerId);

            // Log any missing important fields
            if (!customerId) console.log("❌ Missing customer_id in session metadata");
            if (!session.subscription) console.log("❌ Missing subscription ID in session");
            if (!customerEmail) console.log("❌ Missing customer email!");
            if (!region) console.log("❓ Region not specified, using global as fallback");
            if (!deviceTypes || deviceTypes.length === 0) console.log("❓ No device types specified, using 'other' as fallback");

            // 1️⃣ Map region to bouquet ID
            const BOUQUET_MAP: Record<string, string> = {
                north_america: "132",
                uk_europe: "152",
                middle_east_arabic: "146",
                asia: "158",
                global: "all",
            };
            const bouquet = BOUQUET_MAP[region] || "all";
            console.log("🌍 Using bouquet:", { region, bouquet_id: bouquet });

            // 2️⃣ Map device type to Activation Panel API type
            const PANEL_TYPE_MAP: Record<string, string> = {
                fire_stick: "m3u",
                smart_tv: "m3u",
                android_box: "m3u",
                android_phone: "m3u",
                ios: "m3u",
                web_browser: "m3u",
                mag_box: "mag",
                other: "m3u",
            };

            // Process each device type
            interface DeviceActivationResult {
                deviceType: string;
                username: string;
                password: string;
                portalUrl: string;
                activationType: string;
                // No error property here - we'll handle errors differently
            }

            const deviceCredentials: DeviceActivationResult[] = [];
            // Keep track of errors separately
            const activationErrors: Record<string, string> = {};

            console.log(`🔄 Processing ${deviceTypes.length} device(s)...`);

            for (const deviceType of deviceTypes) {
                const activationType = PANEL_TYPE_MAP[deviceType] || "m3u";
                console.log(`📱 Processing device: ${deviceType} (activation type: ${activationType})`);

                // 3️⃣ Call Activation Panel API for this device
                const activationUrl = `https://activationpanel.net/api/api.php?action=new&type=${activationType}&sub=${subscriptionLength}&pack=${bouquet}&api_key=${env.ACTIVATION_PANEL_KEY}`;
                console.log(`🔗 Calling activation API for ${deviceType}...`);

                try {
                    const activationRes = await fetch(activationUrl);
                    if (!activationRes.ok) {
                        throw new Error(`API returned ${activationRes.status}: ${await activationRes.text()}`);
                    }

                    const activationJson = await activationRes.json();
                    console.log(`✅ Activation API response for ${deviceType}:`, activationJson);

                    const credentials = Array.isArray(activationJson) ? activationJson[0] : {};

                    // Extract credentials based on device type (m3u vs mag have different response formats)
                    let username = "", password = "", portalUrl = "";

                    if (activationType === "m3u") {
                        // Extract from M3U response format
                        username = credentials.user_id || "";
                        password = credentials.password || "";

                        // Parse URL to extract credentials if they weren't directly provided
                        if (credentials.url && (!username || !password)) {
                            try {
                                const urlObj = new URL(credentials.url);
                                const params = new URLSearchParams(urlObj.search);
                                username = username || params.get("username") || "";
                                password = password || params.get("password") || "";
                            } catch (err) {
                                console.warn("⚠️ Failed to parse URL for credentials:", err);
                            }
                        }

                        portalUrl = credentials.url || "";
                    } else if (activationType === "mag") {
                        // Extract from MAG response format
                        username = credentials.mac || "";
                        password = ""; // MAG devices don't typically have passwords
                        portalUrl = credentials.url || "";
                    }

                    if (!username) {
                        console.warn(`⚠️ No username found in API response for ${deviceType}`);
                    }
                    if (!portalUrl) {
                        console.warn(`⚠️ No portal URL found in API response for ${deviceType}`);
                    }

                    deviceCredentials.push({
                        deviceType,
                        username,
                        password,
                        portalUrl,
                        activationType
                    });

                    console.log(`✅ Successfully created ${activationType} subscription for ${deviceType}:`, {
                        username: username ? username.substring(0, 4) + "..." : "missing",
                        password: password ? "********" : "missing",
                        portal: portalUrl ? portalUrl.substring(0, 20) + "..." : "missing"
                    });

                } catch (err) {
                    console.error(`❌ Activation panel call failed for ${deviceType}:`, err);
                    await logEvent(env, "activation_failed", {
                        device_type: deviceType,
                        error: err instanceof Error ? err.message : String(err)
                    });

                    // Add error to our tracking map rather than the credentials object
                    if (activationErrors) {
                        activationErrors[deviceType] = err instanceof Error ? err.message : String(err);
                    }

                    // Still add to array with empty values so we can include in email
                    deviceCredentials.push({
                        deviceType,
                        username: "",
                        password: "",
                        portalUrl: "",
                        activationType
                    });
                }
            }

            if (activationErrors && typeof activationErrors === 'object') {
                console.log(`📋 Activation issues summary: ${Object.keys(activationErrors).length} devices had errors`);
            }

            // 4️⃣ Generate dynamic HTML email with all device credentials
            console.log(`📧 Generating email with ${deviceCredentials.length} device sections...`);

            // Since SUPPORT_EMAIL is not defined in the Env type, use safe access and default value
            // Using type assertion to avoid TypeScript errors
            const supportEmail = "support@example.com"; // Hard-coded default since env.SUPPORT_EMAIL is undefined

            // Option 1: Generate one multi-section email with all devices
            let combinedHtml = `
                <h1>🎉 Your Access is Ready!</h1>
                <p>Thank you for subscribing to our service. Below are your login credentials for each device:</p>
            `;

            for (const cred of deviceCredentials) {
                // Get individual HTML for this device
                const deviceHtml = buildEnhancedEmailBody(
                    cred.deviceType,
                    cred.username,
                    cred.password,
                    region,
                    subscriptionLength,
                    false,
                    cred.portalUrl,
                    "",
                    "iptv.example.com"
                );

                // Extract the content part (skipping the standard headers/footers)
                // This depends on how buildEnhancedEmailBody is structured
                // Assuming it returns a full HTML doc with <body> tags
                const contentRegex = /<body>([\s\S]*?)<\/body>/i;
                const contentMatch = deviceHtml.match(contentRegex);
                const deviceContent = contentMatch ? contentMatch[1] : deviceHtml;

                combinedHtml += `
                    <div style="margin-top: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                        <h2>📱 ${cred.deviceType.replace('_', ' ').toUpperCase()}</h2>
                        ${deviceContent}
                        ${activationErrors && activationErrors[cred.deviceType] ?
                    `<div style="margin-top: 15px; padding: 10px; background-color: #ffebee; border-left: 4px solid #f44336; color: #b71c1c;">
                                <p>⚠️ We encountered an issue activating this device: ${activationErrors[cred.deviceType]}</p>
                                <p>Please contact our support team for assistance.</p>
                            </div>` : ''}
                    </div>
                `;
            }

            combinedHtml += `
                <div style="margin-top: 30px; text-align: center;">
                    <p>Need help? Contact our support team at ${supportEmail}</p>
                </div>
            `;

            // 5️⃣ Send welcome email
            try {
                await sendEmail(env, customerEmail, "🎉 Your Access is Ready!", combinedHtml);
                console.log(`✅ Sent email to ${customerEmail} with ${deviceCredentials.length} device credentials`);
                await logEvent(env, "email_sent", {
                    to: customerEmail,
                    devices: deviceTypes.join(','),
                    region
                });
            } catch (err) {
                console.error("❌ Failed to send email:", err);
                await logEvent(env, "email_failed", {
                    to: customerEmail,
                    error: err instanceof Error ? err.message : String(err)
                });
            }

            // 6️⃣ Store to KV for future account lookups
            if (customerId && session.subscription) {
                const kvKey = `user:${customerId}`;
                try {
                    const userData = await env.KV.get(kvKey);
                    const existing = userData ? JSON.parse(userData) as Partial<UserCredentials> : {};

                    // Create a map of device types to credentials
                    const deviceCredMap: Record<string, {username: string; password: string; portal: string}> = {};
                    for (const cred of deviceCredentials) {
                        deviceCredMap[cred.deviceType] = {
                            username: cred.username,
                            password: cred.password,
                            portal: cred.portalUrl
                        };
                    }

                    // Create updated user data without device_credentials field (not in type)
                    const updated: UserCredentials = {
                        ...existing,
                        user_email: customerEmail,
                        username: deviceCredentials[0]?.username || "",  // Primary username (first device)
                        password: deviceCredentials[0]?.password || "",  // Primary password (first device)
                        device_types: deviceTypes,
                        region,
                        subscriptionLength,
                        stripe_customer_id: session.customer,
                        subscription_id: session.subscription,
                        status: "active",
                        created_at: existing?.created_at || new Date().toISOString(),
                        last_renewed: new Date().toISOString(),
                    };

                    // Store the full data including device credentials in KV
                    // Include activation errors in the stored data
                    const fullData: any = {
                        ...updated,
                        device_credentials: deviceCredMap,
                        activation_issues: activationErrors
                    };

                    await env.KV.put(kvKey, JSON.stringify(fullData));
                    console.log("✅ KV write succeeded:", kvKey);
                    await logEvent(env, "user_kv_updated", {
                        kvKey,
                        customer_email: customerEmail,
                        device_count: deviceTypes.length
                    });
                } catch (err) {
                    console.error("❌ KV put failed:", err);
                    await logEvent(env, "kv_write_failed", {
                        customer_id: customerId,
                        error: err instanceof Error ? err.message : String(err)
                    });
                }
            } else {
                console.warn("⚠️ Skipping KV write. Missing customerId or subscription");
            }
        }

        // ------------------------------------------
        // 🔔 Additional Stripe Lifecycle Events
        // ------------------------------------------
        if (eventType === "customer.subscription.created") {
            const sub = event.data.object;
            await logEvent(env, "subscription_created", {
                customer_id: sub.customer,
                subscription_id: sub.id,
                status: sub.status,
            });
        }

        if (eventType === "customer.subscription.deleted") {
            const sub = event.data.object;
            await logEvent(env, "subscription_canceled", {
                subscription_id: sub.id,
            });
        }

        if (eventType === "invoice.payment_succeeded") {
            const invoice = event.data.object;
            await logEvent(env, "payment_succeeded", {
                subscription_id: invoice.subscription,
                amount: invoice.amount_paid,
                currency: invoice.currency,
            });
        }

        if (eventType === "invoice.payment_failed") {
            const invoice = event.data.object;
            const customerEmail = invoice.customer_email;
            if (customerEmail) {
                const html = `
					<h1>❌ Payment Failed</h1>
					<p>We couldn't process your payment. Please update your billing info ASAP.</p>
					<p>Your subscription may be paused in 7 days if not resolved.</p>
				`;
                await sendEmail(env, customerEmail, "⚠️ Payment Failed", html);
            }
            await logEvent(env, "payment_failed", {
                subscription_id: invoice.subscription,
                customer_email: customerEmail,
            });
        }

        if (eventType === "payment_intent.succeeded") {
            const intent = event.data.object;
            await logEvent(env, "payment_intent_succeeded", {
                id: intent.id,
                amount: intent.amount,
                customer: intent.customer,
            });
        }

        // ------------------------------------------
        // 🌀 Catch-all for other webhook types
        // ------------------------------------------
        if (
            ![
                "checkout.session.completed",
                "customer.subscription.created",
                "customer.subscription.deleted",
                "invoice.payment_succeeded",
                "invoice.payment_failed",
                "payment_intent.succeeded",
            ].includes(eventType)
        ) {
            console.log(`🌀 Unhandled webhook event type: ${eventType}`);
        }

        return new Response("Webhook received", { status: 200 });
    } catch (err) {
        console.error("🚨 Error processing webhook:", err);
        await logEvent(env, "webhook_processing_error", {
            error: err instanceof Error ? err.message : String(err),
        });
        return createErrorResponse(
            `Webhook processing error: ${err instanceof Error ? err.message : String(err)}`,
            500
        );
    }
}