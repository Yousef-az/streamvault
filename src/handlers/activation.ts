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
        const serverDomain = "iptv.example.com";

        for (const deviceType of deviceTypes) {
            try {
                const deviceName = formatDeviceName(deviceType);
                const subject = isRenewal
                    ? `Your IPTV Subscription Renewed - ${deviceName} Setup`
                    : `Welcome - ${deviceName} Setup`;
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

        // Format date to be human readable
        const formatDate = (isoDate: string): string => {
            const date = new Date(isoDate);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const readableExpiryDate = formatDate(expiryDate);

        // Check if the request is from a browser expecting HTML
        const accept = request.headers.get("accept") || "";
        if (accept.includes("text/html")) {
            // Process all variables before HTML generation

            // Format region name nicely
            let formattedRegion = "Global";
            if (region) {
                formattedRegion = region.replace(/_/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
            }

            // Format subscription length
            let durationText = "1 Month";
            if (subscriptionLength) {
                switch (subscriptionLength) {
                    case "1": durationText = "1 Month"; break;
                    case "3": durationText = "3 Months"; break;
                    case "6": durationText = "6 Months"; break;
                    case "12": durationText = "1 Year"; break;
                    default:
                        const months = parseInt(subscriptionLength);
                        durationText = `${months} Month${months !== 1 ? 's' : ''}`;
                }
            }

            // Format device count
            const deviceCount = deviceTypes.length;
            const deviceText = deviceCount === 1 ? "1 Device" : `${deviceCount} Devices`;

            // Mask email
            let maskedEmail = "Not provided";
            if (user_email) {
                const atIndex = user_email.indexOf('@');
                if (atIndex > 1) {
                    maskedEmail = user_email.substring(0, 2) + '•••' + user_email.substring(atIndex);
                } else {
                    maskedEmail = user_email;
                }
            }

            // Choose title based on renewal status
            const pageTitle = isRenewal ? 'Subscription Renewed' : 'Subscription Activated';
            const headingText = isRenewal ? 'Subscription Renewed' : 'Payment Successful';
            const messageText = isRenewal
                ? 'Your subscription has been renewed successfully. We\'ve sent updated login details to your email.'
                : 'Your subscription is now active. We\'ve emailed your login credentials and setup guide!';

            // Create HTML response with string literals
            const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <style>
        /* Base Styles */
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #000;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(100, 43, 115, 0.1) 0%, rgba(0, 0, 0, 0) 90%),
                radial-gradient(circle at 90% 80%, rgba(43, 100, 115, 0.1) 0%, rgba(0, 0, 0, 0) 90%);
            background-attachment: fixed;
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
        }
        
        .container {
            width: 100%;
            max-width: 520px;
            margin: 0 auto;
        }
        
        /* Main Card */
        .card {
            background-color: #111;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 
                0 15px 35px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.05);
            position: relative;
            transform: translateY(0);
            transition: all 0.4s ease;
        }
        
        .card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #ff69b4, #764ba2, #667eea);
            background-size: 200% 200%;
            animation: gradient-shift 6s ease infinite;
            z-index: 2;
        }
        
        /* Check Animation */
        .checkmark-wrapper {
            width: 150px;
            height: 150px;
            margin: 40px auto;
            position: relative;
        }
        
        .checkmark-circle {
            width: 150px;
            height: 150px;
            position: relative;
            border-radius: 50%;
            border: 4px solid white;
            opacity: 0;
            transform: scale(0.5);
            animation: circle-appear 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }
        
        .checkmark {
            width: 76px;
            height: 38px;
            position: absolute;
            top: 60px;
            left: 38px;
            border-bottom: 12px solid white;
            border-left: 12px solid white;
            opacity: 0;
            transform: rotate(-45deg) scale(0.5) translate(-30px, 30px);
            animation: checkmark-appear 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.5s;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }
        
        @keyframes circle-appear {
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes checkmark-appear {
            to {
                opacity: 1;
                transform: rotate(-45deg) scale(1) translate(0, 0);
            }
        }
        
        /* Content */
        .content {
            padding: 0 2.5rem 2.5rem;
            text-align: center;
        }
        
        h1 {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(90deg, #ffffff, #c0c0c0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
        }
        
        .message {
            color: #c1c1c1;
            font-size: 1.125rem;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .highlight {
            display: block;
            margin-top: 1.2rem;
            color: #ededed;
            font-weight: 600;
            padding: 0.8rem 1.2rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            backdrop-filter: blur(5px);
        }
        
        /* Details Grid */
        .details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
            margin-bottom: 1.25rem;
        }
        
        .detail-block {
            background: linear-gradient(135deg, #1a1a1a, #141414);
            padding: 1.25rem;
            border-radius: 16px;
            text-align: left;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            position: relative;
            z-index: 1;
        }
        
        .detail-block::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
            z-index: -1;
            transition: transform 0.6s ease;
            transform: translateY(100%);
        }
        
        .detail-block:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
            border-color: rgba(255, 255, 255, 0.1);
        }
        
        .detail-block:hover::before {
            transform: translateY(0);
        }
        
        .detail-label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #8c8c8c;
            margin-bottom: 0.6rem;
        }
        
        .detail-value {
            font-size: 1.125rem;
            font-weight: 500;
            color: #fff;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }
        
        .expiry-block {
            grid-column: 1 / -1;
            background: linear-gradient(135deg, #181818, #141414);
            border: 1px solid rgba(255, 255, 255, 0.07);
            animation: pulse 5s infinite ease-in-out;
        }
        
        .expiry-block .detail-value {
            color: #ffffff;
            font-weight: 600;
        }
        
        /* Footer */
        .footer {
            margin-top: 2.5rem;
            text-align: center;
            color: #7d7d7d;
            font-size: 0.875rem;
        }
        
        .footer a {
            color: #ffffff;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
        }
        
        .footer a:hover {
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }
        
        /* Responsive */
        @media (max-width: 480px) {
            .details {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .checkmark-wrapper {
                width: 120px;
                height: 120px;
                margin: 30px auto;
            }
            
            .checkmark-circle {
                width: 120px;
                height: 120px;
            }
            
            .checkmark {
                width: 60px;
                height: 30px;
                top: 50px;
                left: 30px;
                border-bottom: 10px solid white;
                border-left: 10px solid white;
            }
            
            h1 {
                font-size: 1.75rem;
            }
            
            .content {
                padding: 0 1.5rem 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="checkmark-wrapper">
                <div class="checkmark-circle"></div>
                <div class="checkmark"></div>
            </div>
            
            <div class="content">
                <h1>${headingText}</h1>
                <p class="message">
                    ${messageText}
                    <span class="highlight">📬 Check your inbox — and peek at your spam folder just in case!</span>
                </p>
                
                <div class="details">
                    <div class="detail-block">
                        <div class="detail-label">Email</div>
                        <div class="detail-value">${maskedEmail}</div>
                    </div>
                    
                    <div class="detail-block">
                        <div class="detail-label">Subscription</div>
                        <div class="detail-value">${durationText}</div>
                    </div>
                    
                    <div class="detail-block">
                        <div class="detail-label">Region</div>
                        <div class="detail-value">${formattedRegion}</div>
                    </div>
                    
                    <div class="detail-block">
                        <div class="detail-label">Devices</div>
                        <div class="detail-value">${deviceText}</div>
                    </div>
                    
                    <div class="detail-block expiry-block">
                        <div class="detail-label">Subscription Expires</div>
                        <div class="detail-value">${readableExpiryDate}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <p class="footer">
            Need help? <a href="mailto:support@example.com">Contact our support team</a>
        </p>
    </div>
</body>
</html>`;

            return new Response(html, {
                headers: {
                    "Content-Type": "text/html;charset=UTF-8",
                },
            });
        }

        // Return JSON response for API requests
        return createJsonResponse({
            success: true,
            renewed: isRenewal,
            message: isRenewal
                ? `Your subscription has been renewed successfully. Check your email for setup instructions for your ${deviceTypes.length} device(s).`
                : `Your subscription has been activated successfully. Check your email for setup instructions for your ${deviceTypes.length} device(s).`,
            username,
            expiry_date: expiryDate,
            human_readable_expiry: readableExpiryDate,
            // Not returning the password for security.
        });
    } catch (err) {
        console.error("Unexpected error in handleActivate:", err);
        return createErrorResponse(`Internal server error: ${err instanceof Error ? err.message : String(err)}`, 500);
    }
}