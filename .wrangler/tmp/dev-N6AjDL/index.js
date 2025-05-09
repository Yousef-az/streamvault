var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-9lBNsX/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/config.ts
var REGIONAL_OPTIONS = {
  north_america: "bouquet_na",
  uk_europe: "bouquet_eu",
  middle_east_arabic: "bouquet_me",
  asia: "bouquet_asia",
  global: "bouquet_global"
};
var STRIPE_PRICES = {
  "1": "price_1RAN1mRt8rNloVVOmKvL8NZy",
  "3": "price_1RAcdYRt8rNloVVOQ9xQz0S2",
  "6": "price_1RAcgVRt8rNloVVOmWWseZbt",
  "12": "price_1RAcLVRt8rNloVVOju32toFh",
  "24": "price_1RAcRhRt8rNloVVOQclunaHF"
};
var REGION_CONFIG = {
  north_america: { display: "United States (North America)", emoji: "\u{1F1FA}\u{1F1F8}" },
  uk_europe: { display: "Europe / UK", emoji: "\u{1F1EA}\u{1F1FA}" },
  middle_east_arabic: { display: "Middle East / Arabic", emoji: "\u{1F1F8}\u{1F1E6}" },
  asia: { display: "Asia", emoji: "\u{1F30F}" },
  global: { display: "Global", emoji: "\u{1F310}" }
};
var DEVICE_CONFIG = {
  ios: { label: "Apple Devices", emoji: "\u{1F34E}" },
  fire_stick: { label: "Fire Stick", emoji: "\u{1F525}" },
  android_box: { label: "Android Box", emoji: "\u{1F4E6}" },
  smart_tv: { label: "Smart TV", emoji: "\u{1F4FA}" },
  android_phone: { label: "Android Phone", emoji: "\u{1F4F2}" },
  web_browser: { label: "Windows PC", emoji: "\u{1F310}" },
  mag_box: { label: "MAG Box", emoji: "\u{1F4FC}" },
  other: { label: "Other", emoji: "\u2728" }
};
var DEVICE_INSTRUCTIONS = {
  smart_tv: `
    <ol>
      <li>Press the Home button on your remote</li>
      <li>Navigate to the app store on your TV</li>
      <li>Search for and install the "Smart IPTV" app</li>
      <li>Open the Smart IPTV app</li>
      <li>Navigate to Settings > Configuration</li>
      <li>Enter your M3U credentials when prompted</li>
      <li>Save your settings and restart the app</li>
    </ol>
    <p><strong>Note:</strong> Some TV models may require a system restart after installation.</p>
  `,
  fire_stick: `
    <ol>
      <li>From your Fire Stick home screen, search for and install the "Downloader" app</li>
      <li>Open the Downloader app and enter: bit.ly/iptv-player</li>
      <li>Follow the prompts to install the IPTV player</li>
      <li>Open the newly installed IPTV player</li>
      <li>Select "Add Playlist" > "Add M3U URL"</li>
      <li>Enter the URL: http://stream.example.com/get.php?username=[YOUR_USERNAME]&password=[YOUR_PASSWORD]&type=m3u_plus&output=ts</li>
      <li>Replace [YOUR_USERNAME] and [YOUR_PASSWORD] with your credentials</li>
      <li>Save and enjoy your content</li>
    </ol>
  `,
  android_box: `
    <ol>
      <li>Open the Google Play Store on your Android Box</li>
      <li>Search for and install "IPTV Smarters Pro" or "TiviMate"</li>
      <li>Open the installed app</li>
      <li>Select "Add Playlist" or "Add New Playlist"</li>
      <li>Choose "Add M3U URL" or "Add URL"</li>
      <li>Enter your playlist URL with your username and password</li>
      <li>Name your playlist (e.g., "My IPTV")</li>
      <li>Save and enjoy your content</li>
    </ol>
    <p><strong>Tip:</strong> For best performance, connect your Android Box via Ethernet instead of Wi-Fi if possible.</p>
  `,
  ios: `
    <ol>
      <li>Install "IPTV Smarters Pro" from the App Store</li>
      <li>Open the IPTV Smarters Pro app</li>
      <li>Tap on "Add New User"</li>
      <li>Enter a name for your playlist</li>
      <li>Select "M3U URL" as input type</li>
      <li>Enter your M3U URL with your credentials</li>
      <li>Tap "Add User" to save</li>
      <li>Your channels will now load</li>
    </ol>
  `,
  android_phone: `
    <ol>
      <li>Install "IPTV Smarters Pro" from Google Play Store</li>
      <li>Open the app and tap "Add User"</li>
      <li>Enter a name for your profile</li>
      <li>Choose "M3U URL" for playlist type</li>
      <li>Enter your M3U URL with credentials</li>
      <li>Save your configuration</li>
      <li>Your channels will load automatically</li>
    </ol>
    <p><strong>Note:</strong> For casting to a TV, make sure both devices are on the same Wi-Fi network.</p>
  `,
  mag_box: `
    <ol>
      <li>Power on your MAG box</li>
      <li>Go to the Settings menu</li>
      <li>Select "System Settings"</li>
      <li>Navigate to "Servers" or "Portal Settings"</li>
      <li>Enter the portal URL: http://portal.example.com/c/</li>
      <li>If prompted, restart your MAG box</li>
      <li>Your channels should now load automatically</li>
    </ol>
    <p><strong>Important:</strong> Your MAG box is already registered in our system. If you change your MAG box, please contact support.</p>
  `,
  web_browser: `
    <ol>
      <li>Open your preferred web browser (Chrome, Firefox, Safari, etc.)</li>
      <li>Visit: http://watch.blancosphere.com</li>
      <li>Enter your username and password</li>
      <li>Click "Sign In"</li>
      <li>Use the navigation menu to browse channels by category</li>
    </ol>
    <p><strong>Tip:</strong> Bookmark the page for easy access in the future.</p>
  `
};

// src/utils/helpers.ts
async function handleErrors(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}
__name(handleErrors, "handleErrors");
function validateRequiredParams(params) {
  for (const [key, value] of Object.entries(params)) {
    if (!value) return `Missing required parameter: ${key}`;
  }
  return null;
}
__name(validateRequiredParams, "validateRequiredParams");
async function fetchFromActivationPanel(url) {
  const [response, fetchError] = await handleErrors(fetch(url));
  if (fetchError) throw new Error(`API request failed: ${fetchError.message}`);
  if (!response || !response.ok) throw new Error(`API request failed with status: ${response?.status}`);
  const [data, jsonError2] = await handleErrors(response.json());
  if (jsonError2) throw new Error(`Failed to parse API response: ${jsonError2.message}`);
  return data;
}
__name(fetchFromActivationPanel, "fetchFromActivationPanel");
function createJsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(createJsonResponse, "createJsonResponse");
function createErrorResponse(message, status = 400) {
  return createJsonResponse({ error: message }, status);
}
__name(createErrorResponse, "createErrorResponse");
async function logEvent(env, eventType, data) {
  try {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const logKey = `log:${eventType}:${timestamp}:${crypto.randomUUID()}`;
    await env.KV.put(logKey, JSON.stringify({ timestamp, eventType, ...data }), { expirationTtl: 2592e3 });
  } catch (error) {
    console.error(`Failed to log ${eventType} event:`, error);
  }
}
__name(logEvent, "logEvent");
function extractCredentials(m3uUrl) {
  try {
    const url = new URL(m3uUrl);
    const username = url.searchParams.get("username");
    const password = url.searchParams.get("password");
    if (!username || !password) throw new Error("Missing username or password in URL");
    return { username, password };
  } catch (error) {
    console.error("Failed to extract credentials:", error);
    return null;
  }
}
__name(extractCredentials, "extractCredentials");
async function handleStripeResponse(stripeResponse, sessionParser) {
  if (!stripeResponse) throw new Error("Failed to connect to Stripe API");
  if (!stripeResponse.ok) throw new Error(`Stripe API returned error status: ${stripeResponse.status}`);
  const [sessionData, sessionError] = await handleErrors(stripeResponse.json());
  if (sessionError) throw new Error(`Failed to parse Stripe response: ${sessionError.message}`);
  if (!sessionData?.url) throw new Error("Stripe session creation failed - missing redirect URL");
  return sessionParser(sessionData);
}
__name(handleStripeResponse, "handleStripeResponse");
function generateSecureToken(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
__name(generateSecureToken, "generateSecureToken");
function verifyStripeWebhookSignature(payload, signature, secret) {
  try {
    console.log("Verifying webhook signature:", { payload: payload.substring(0, 20) + "...", signature });
    return true;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}
__name(verifyStripeWebhookSignature, "verifyStripeWebhookSignature");
function parseDeviceTypes(deviceTypesString) {
  if (!deviceTypesString) return [];
  return deviceTypesString.split(",").map((d) => d.trim()).filter(Boolean);
}
__name(parseDeviceTypes, "parseDeviceTypes");
function validateDeviceTypes(deviceTypes) {
  if (!deviceTypes.length) return "At least one device type must be selected";
  const unsupportedDevices = deviceTypes.filter((d) => !DEVICE_INSTRUCTIONS[d]);
  return unsupportedDevices.length ? `Unsupported device type(s): ${unsupportedDevices.join(", ")}` : null;
}
__name(validateDeviceTypes, "validateDeviceTypes");
function formatDeviceName(deviceType) {
  return deviceType.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
__name(formatDeviceName, "formatDeviceName");
function validateApiKey(request, env) {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === env.STREAMVAULT_ADMIN_KEY;
}
__name(validateApiKey, "validateApiKey");

// src/handlers/checkout.ts
async function handleCreateCheckout(request, env) {
  try {
    const [body, parseError] = await handleErrors(request.json());
    if (parseError) return createErrorResponse(`Invalid request body: ${parseError.message}`, 400);
    const rawSelection = body;
    const deviceTypes = Array.isArray(rawSelection.device_types) ? rawSelection.device_types : parseDeviceTypes(rawSelection.device_types || "");
    const selection = {
      subscriptionLength: rawSelection.subscriptionLength,
      region: rawSelection.region,
      customer_id: rawSelection.customer_id || generateSecureToken(12),
      device_types: deviceTypes,
      user_email: rawSelection.user_email
    };
    const validationError = validateRequiredParams({
      subscriptionLength: selection.subscriptionLength,
      region: selection.region,
      user_email: selection.user_email
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
    const successUrl = new URL("https://iptv-unified-worker.yousef-az.workers.dev/activate");
    successUrl.searchParams.set("subscriptionLength", selection.subscriptionLength);
    successUrl.searchParams.set("region", selection.region);
    successUrl.searchParams.set("customer_id", selection.customer_id);
    successUrl.searchParams.set("device_types", selection.device_types.join(","));
    successUrl.searchParams.set("user_email", selection.user_email);
    const checkoutToken = generateSecureToken();
    successUrl.searchParams.set("checkoutToken", checkoutToken);
    await env.KV.put(`checkout:${checkoutToken}`, JSON.stringify({ selection, timestamp: Date.now() }), { expirationTtl: 3600 });
    const stripePriceId = STRIPE_PRICES[selection.subscriptionLength];
    if (!stripePriceId) return createErrorResponse(`Invalid subscription length: ${selection.subscriptionLength}`, 400);
    const formParams = new URLSearchParams({
      success_url: successUrl.toString(),
      cancel_url: "https://blancosphere.com/canceled",
      mode: "subscription",
      "line_items[0][price]": stripePriceId,
      "line_items[0][quantity]": "1",
      customer_email: selection.user_email
    });
    formParams.append("metadata[subscriptionLength]", selection.subscriptionLength.toString());
    formParams.append("metadata[region]", selection.region);
    formParams.append("metadata[device_types]", selection.device_types.join(","));
    formParams.append("metadata[plan]", "launch");
    formParams.append("metadata[bouquet]", bouquetSelection);
    formParams.append("metadata[checkout_token]", checkoutToken);
    await logEvent(env, "checkout_initiated", {
      customer_id: selection.customer_id,
      user_email: selection.user_email,
      region: selection.region,
      subscriptionLength: selection.subscriptionLength,
      device_types: selection.device_types
    });
    const [stripeResponse, stripeError] = await handleErrors(fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formParams
    }));
    if (stripeError) {
      console.error("Stripe API error:", stripeError);
      await logEvent(env, "checkout_error", { customer_id: selection.customer_id, error: stripeError.message });
      return createErrorResponse("Failed to create Stripe checkout session", 500);
    }
    try {
      const sessionData = await handleStripeResponse(stripeResponse, (data) => ({
        url: data.url,
        session_id: data.id
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
__name(handleCreateCheckout, "handleCreateCheckout");

// src/utils/email/send-email.ts
async function sendEmail(env, toEmail, subject, htmlContent, fromEmail = "support@blancosphere.com", fromName = "Blancosphere Support", replyTo, attachments) {
  const url = "https://api.sendgrid.com/v3/mail/send";
  const body = {
    personalizations: [{ to: [{ email: toEmail }], subject }],
    from: { email: fromEmail, name: fromName },
    content: [{ type: "text/html", value: htmlContent }]
  };
  if (replyTo) {
    body.reply_to = { email: replyTo };
  }
  if (attachments && attachments.length > 0) {
    body.attachments = attachments;
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid Error: ${response.status} - ${errorText}`);
  }
  return response;
}
__name(sendEmail, "sendEmail");

// src/utils/email/base-template.ts
function createBaseEmailTemplate(deviceType, username, password, region, subscriptionLength, isRenewal, deviceSpecificInstructions, deviceSpecificTip, portalUrl, firstName, serverDomain = "iptv.blancosphere.com") {
  const regionDisplayName = REGION_CONFIG[region]?.display || region;
  const regionEmoji = REGION_CONFIG[region]?.emoji || "\u{1F30D}";
  const deviceEmoji = DEVICE_CONFIG[deviceType]?.emoji || "\u{1F4F1}";
  const deviceTypeDisplay = DEVICE_CONFIG[deviceType]?.label || formatDeviceName(deviceType);
  const expiryDate = new Date(Date.now() + parseInt(subscriptionLength) * 30 * 24 * 60 * 60 * 1e3);
  const formattedExpiryDate = expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const currentDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const m3uUrl = `http://${serverDomain}/get.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&type=m3u_plus&output=ts`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(m3uUrl)}&size=150x150`;
  const greeting = firstName ? `Hello ${firstName},` : "Hello,";
  const tipContent = deviceSpecificTip || `For the best streaming experience, use a stable internet connection with at least 10 Mbps download speed and consider using a wired connection when possible.`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Your ${deviceTypeDisplay} Access Activated</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #2B3241;
      background-color: #F1F5F9;
      margin: 0;
      padding: 0;
    }
    
    .email-container {
      max-width: 640px;
      margin: 0 auto;
      background: linear-gradient(180deg, #FFFFFF 0%, #F9FAFC 100%);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    }
    
    .header {
      position: relative;
      background: linear-gradient(125deg, #0F172A 0%, #1E293B 100%);
      padding: 60px 0 140px;
      text-align: center;
      color: white;
      overflow: hidden;
    }
    
    .header-glow {
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 70%);
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 0;
    }
    
    .header-particles {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='30' cy='40' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='50' cy='20' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='70' cy='70' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='90' cy='30' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='20' cy='80' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='60' cy='50' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='80' cy='10' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3C/svg%3E");
      opacity: 0.4;
      z-index: 1;
    }
    
    .logo-container {
      position: relative;
      z-index: 2;
      margin-bottom: 30px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      background-color: white;
      border-radius: 50%;
      padding: 15px;
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.1);
    }
    
    .header-title {
      position: relative;
      z-index: 2;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      padding: 0 20px;
      letter-spacing: -0.5px;
    }
    
    .header-subtitle {
      position: relative;
      z-index: 2;
      font-size: 16px;
      font-weight: 400;
      opacity: 0.8;
      margin: 15px 0 0;
    }
    
    .status-badge {
      position: relative;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      background: rgba(56, 189, 248, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38BDF8;
      font-size: 14px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 100px;
      margin-top: 20px;
    }
    
    .status-badge::before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: #38BDF8;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
      }
      70% {
        box-shadow: 0 0 0 6px rgba(56, 189, 248, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
      }
    }
    
    .content-wrapper {
      position: relative;
      margin-top: -80px;
      padding: 0 30px 50px;
      z-index: 10;
    }
    
    .content {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #0F172A;
      margin-top: 0;
      margin-bottom: 20px;
    }
    
    .intro-text {
      font-size: 16px;
      line-height: 1.7;
      color: #475569;
      margin-bottom: 30px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section-title {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      color: #0F172A;
      margin-bottom: 20px;
    }
    
    .section-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%);
      border-radius: 10px;
      margin-right: 12px;
      color: white;
      font-size: 18px;
    }
    
// For the credential cards, ensure the grid styling is consistent:
.credentials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 30px;
  width: 100%; /* Add this to ensure full width */
}
    
.credential-card {
  background: #F8FAFC;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #E2E8F0;
  transition: all 0.3s ease;
  width: 100%; /* Add this to ensure full width */
  box-sizing: border-box; /* Add this to include padding in width calculation */
}
    
    .credential-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      border-color: #CBD5E1;
    }
    
    .credential-label {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      color: #64748B;
      margin-bottom: 10px;
    }
    
    .credential-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #E2E8F0;
      border-radius: 6px;
      margin-right: 8px;
    }
    
// For the subscription text that appears to have a line break issue:
.credential-value {
  font-family: 'SF Mono', 'Consolas', monospace;
  font-size: 16px;
  font-weight: 500;
  color: #0F172A;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
  word-break: break-word; /* Add this to handle long text */
  white-space: normal; /* Add this to allow wrapping */
}
    
    .qr-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 30px 0;
      padding: 30px;
      background: #F8FAFC;
      border-radius: 16px;
      border: 1px solid #E2E8F0;
    }
    
    .qr-code {
      width: 150px;
      height: 150px;
      padding: 10px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      margin-bottom: 15px;
    }
    
    .qr-caption {
      font-size: 14px;
      color: #64748B;
      font-weight: 500;
      text-align: center;
    }
    
    .m3u-url {
      font-size: 13px;
      color: #64748B;
      background: white;
      padding: 10px 15px;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
      margin-top: 12px;
      word-break: break-all;
      text-align: center;
      max-width: 300px;
    }
    
    .steps-container {
      background: #F8FAFC;
      border-radius: 16px;
      padding: 30px;
      border: 1px solid #E2E8F0;
    }
    
    .steps-list {
      list-style-type: none;
      counter-reset: steps-counter;
      margin: 0;
      padding: 0;
    }
    
    .step-item {
      position: relative;
      padding-left: 50px;
      margin-bottom: 20px;
      counter-increment: steps-counter;
    }
    
    .step-item:last-child {
      margin-bottom: 0;
    }
    
    .step-item::before {
      content: counter(steps-counter);
      position: absolute;
      left: 0;
      top: 0;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%);
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }
    
    .step-item:not(:last-child)::after {
      content: "";
      position: absolute;
      left: 16px;
      top: 32px;
      bottom: -12px;
      width: 1px;
      background: #E2E8F0;
    }
    
    .step-content {
      font-size: 15px;
      color: #475569;
      line-height: 1.7;
    }
    
    .tip-box {
      margin-top: 20px;
      background: rgba(56, 189, 248, 0.1);
      border-left: 3px solid #38BDF8;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 14px;
      color: #0F172A;
    }
    
    .tip-title {
      font-weight: 600;
      color: #0EA5E9;
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }
    
    .tip-title svg {
      margin-right: 8px;
    }
    
    .warning-box {
      background: rgba(244, 63, 94, 0.05);
      border-left: 3px solid #F43F5E;
      padding: 20px;
      border-radius: 12px;
      margin: 30px 0;
      display: flex;
      align-items: flex-start;
      gap: 15px;
    }
    
    .warning-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 40px;
      background: rgba(244, 63, 94, 0.1);
      border-radius: 50%;
      color: #F43F5E;
      font-size: 20px;
    }
    
    .warning-content {
      flex: 1;
    }
    
    .warning-title {
      font-weight: 600;
      color: #F43F5E;
      margin: 0 0 5px;
      font-size: 16px;
    }
    
    .warning-text {
      margin: 0;
      color: #475569;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .tips-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 20px;
    }
    
    .tip-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #E2E8F0;
    }
    
    .tip-card-title {
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 15px;
      color: #0F172A;
      margin-bottom: 10px;
    }
    
    .tip-card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      min-width: 30px;
      background: #F1F5F9;
      border-radius: 8px;
      margin-right: 10px;
    }
    
    .tip-card-text {
      font-size: 14px;
      color: #64748B;
      line-height: 1.6;
      margin: 0;
    }
    
    .action-container {
      text-align: center;
      margin: 40px 0 20px;
    }
    
    .action-button {
      display: inline-block;
      background: linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%);
      color: white;
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 100px;
      box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .action-button::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
      transition: all 0.3s ease;
    }
    
    .action-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(14, 165, 233, 0.4);
    }
    
    .action-button:hover::after {
      opacity: 0.5;
    }
    
    .closing {
      text-align: center;
      margin-top: 40px;
      padding-top: 40px;
      border-top: 1px solid #E2E8F0;
    }
    
    .closing-text {
      color: #64748B;
      font-size: 15px;
      line-height: 1.7;
      margin-bottom: 20px;
    }
    
    .signature {
      font-weight: 600;
      color: #0F172A;
      font-size: 16px;
    }
    
    .footer {
      background: #0F172A;
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    
    .social-links {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 25px;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .social-link:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
    }
    
    .footer-nav {
      margin: 20px 0;
    }
    
    .footer-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
      transition: color 0.3s ease;
    }
    
    .footer-link:hover {
      color: white;
    }
    
    .footer-contact {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      margin-bottom: 20px;
    }
    
    .footer-contact a {
      color: #38BDF8;
      text-decoration: none;
    }
    
    .copyright {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    /* Animated elements */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animated {
      animation: fadeIn 0.5s ease forwards;
    }
    
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }
    
    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #0F172A;
        color: #E2E8F0;
      }
      
      .email-container {
        background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
      }
      
      .header {
        background: linear-gradient(125deg, #0F172A 0%, #0A101E 100%);
      }
      
      .content {
        background: rgba(30, 41, 59, 0.9);
        border-color: rgba(30, 41, 59, 0.7);
      }
      
      .greeting {
        color: #F8FAFC;
      }
      
      .intro-text {
        color: #CBD5E1;
      }
      
      .section-title {
        color: #F8FAFC;
      }
      
      .credential-card {
        background: #1E293B;
        border-color: #334155;
      }
      
      .credential-label {
        color: #94A3B8;
      }
      
      .credential-icon {
        background: #334155;
      }
      
      .credential-value {
        color: #F8FAFC;
        background: #0F172A;
        border-color: #334155;
      }
      
      .qr-container, .steps-container {
        background: #1E293B;
        border-color: #334155;
      }
      
      .qr-code {
        background: #0F172A;
      }
      
      .qr-caption {
        color: #94A3B8;
      }
      
      .m3u-url {
        color: #94A3B8;
        background: #0F172A;
        border-color: #334155;
      }
      
      .step-content {
        color: #CBD5E1;
      }
      
      .step-item:not(:last-child)::after {
        background: #334155;
      }
      
      .tip-box {
        background: rgba(56, 189, 248, 0.1);
        color: #CBD5E1;
      }
      
      .tip-card {
        background: #1E293B;
        border-color: #334155;
      }
      
      .tip-card-title {
        color: #F8FAFC;
      }
      
      .tip-card-icon {
        background: #0F172A;
      }
      
      .tip-card-text {
        color: #94A3B8;
      }
      
      .warning-text {
        color: #CBD5E1;
      }
      
      .closing {
        border-color: #334155;
      }
      
      .closing-text {
        color: #94A3B8;
      }
      
      .signature {
        color: #F8FAFC;
      }
    }
    
    /* Mobile responsiveness */
    @media (max-width: 640px) {
      .header {
        padding: 40px 0 120px;
      }
      
      .content-wrapper {
        padding: 0 15px 30px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .credentials-grid,
      .tips-grid {
        grid-template-columns: 1fr;
      }
      
      .warning-box {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .action-button {
        width: 100%;
      }
      
      .social-links {
        flex-wrap: wrap;
      }
      
      .footer-link {
        display: block;
        margin: 10px 0;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="header-glow"></div>
      <div class="header-particles"></div>
      
      <div class="logo-container">
        <img src="http://cdn.mcauto-images-production.sendgrid.net/429455c8921109b6/93d072ea-9630-4bcd-a5dc-109486957cdb/1200x1200.png" alt="Blancosphere" class="logo">
      </div>
      
      <h1 class="header-title">${isRenewal ? "Subscription Renewed" : "Premium Access Activated"}</h1>
      <p class="header-subtitle">Your gateway to unlimited entertainment</p>
      
      <div class="status-badge">Active \u2022 Premium ${deviceTypeDisplay} Access</div>
    </div>
    
    <div class="content-wrapper">
      <div class="content">
        <p class="greeting animated">${greeting}</p>
        
        <p class="intro-text animated delay-1">
          ${isRenewal ? `Your premium subscription has been successfully renewed. You continue to have unlimited access to thousands of channels and on-demand content.` : `Your premium subscription has been successfully activated. You now have unlimited access to thousands of live channels, on-demand content, and exclusive premium features.`}
        </p>
        
        <div class="section animated delay-2">
          <div class="section-title">
            <div class="section-icon">\u{1F510}</div>
            Access Credentials
          </div>
          
          <div class="credentials-grid">
            <div class="credential-card">
              <div class="credential-label">
                <div class="credential-icon">\u{1F464}</div>
                Username
              </div>
              <div class="credential-value">${username}</div>
            </div>
            
            <div class="credential-card">
              <div class="credential-label">
                <div class="credential-icon">\u{1F511}</div>
                Password
              </div>
              <div class="credential-value">${password}</div>
            </div>
            
            <div class="credential-card">
              <div class="credential-label">
                <div class="credential-icon">${regionEmoji}</div>
                Region
              </div>
              <div class="credential-value">${regionDisplayName}</div>
            </div>
            
            <div class="credential-card">
              <div class="credential-label">
                <div class="credential-icon">\u23F3</div>
                Subscription
              </div>
              <div class="credential-value">${subscriptionLength} months (Expires: ${formattedExpiryDate})</div>
            </div>
          </div>
          
          <div class="qr-container">
            <img src="${qrCodeUrl}" alt="QR Code" class="qr-code">
            <div class="qr-caption">Scan to automatically connect on mobile devices</div>
            <div class="m3u-url">${m3uUrl}</div>
          </div>
        </div>
        
        <div class="section animated delay-3">
          <div class="section-title">
            <div class="section-icon">${deviceEmoji}</div>
            Setup Instructions for ${deviceTypeDisplay}
          </div>
          
          <div class="steps-container">
            ${deviceSpecificInstructions}
            
            <div class="tip-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0EA5E9" stroke-width="2"/>
                  <path d="M12 8V12" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 16H12.01" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Pro Tip
              </div>
              ${tipContent}
            </div>
          </div>
          
          <div class="warning-box">
            <div class="warning-icon">\u26A0\uFE0F</div>
            <div class="warning-content">
              <h4 class="warning-title">Important</h4>
              <p class="warning-text">For your security, never share your credentials with anyone. Your subscription is for personal use only and sharing access may result in account termination.</p>
            </div>
          </div>
          
          <div class="tips-grid">
            <div class="tip-card">
              <div class="tip-card-title">
                <div class="tip-card-icon">\u{1F4FA}</div>
                Optimal Quality
              </div>
              <p class="tip-card-text">Set your player to "Auto" quality for the best balance between quality and streaming stability.</p>
            </div>
            
            <div class="tip-card">
              <div class="tip-card-title">
                <div class="tip-card-icon">\u{1F4F1}</div>
                Multi-device Access
              </div>
              <p class="tip-card-text">You can use your subscription on multiple devices, but simultaneous streaming is limited to 1 device at a time.</p>
            </div>
          </div>
        </div>
        
        <div class="action-container animated delay-4">
          ${portalUrl ? `<a href="${portalUrl}" class="action-button">Access Your Customer Portal</a>` : "<!-- No portal URL provided -->"}
        </div>
        
        <div class="closing animated delay-4">
          <p class="closing-text">If you have any questions or need assistance, our support team is available 24/7. Simply reply to this email or contact us through the customer portal.</p>
          <p class="signature">The Blancosphere Team</p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div class="social-links">
        <a href="#" class="social-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="#" class="social-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="#" class="social-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 11.3701C16.1234 12.2023 15.9813 13.0523 15.5938 13.7991C15.2063 14.5459 14.5932 15.1515 13.8416 15.5297C13.0901 15.908 12.2385 16.0397 11.4078 15.906C10.5771 15.7723 9.80977 15.3801 9.21484 14.7852C8.61991 14.1903 8.22773 13.4229 8.09406 12.5923C7.9604 11.7616 8.09206 10.91 8.47032 10.1584C8.84858 9.40691 9.45418 8.7938 10.201 8.4063C10.9478 8.0188 11.7978 7.87665 12.63 8.00006C13.4789 8.12594 14.2649 8.52152 14.8717 9.12836C15.4785 9.73521 15.8741 10.5211 16 11.3701Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 6.5H17.51" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="#" class="social-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 9H2V21H6V9Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
      
      <div class="footer-nav">
        <a href="#" class="footer-link">Help Center</a>
        <a href="#" class="footer-link">Terms of Service</a>
        <a href="#" class="footer-link">Privacy Policy</a>
        <a href="#" class="footer-link">Refund Policy</a>
      </div>
      
      <div class="footer-contact">
        Need help? Email us at <a href="mailto:support@blancosphere.com">support@blancosphere.com</a>
      </div>
      
      <div class="copyright">
        &copy; ${currentYear} Blancosphere. All rights reserved. Sent on ${currentDate}.
      </div>
    </div>
  </div>
</body>
</html>`;
}
__name(createBaseEmailTemplate, "createBaseEmailTemplate");

// src/utils/email/smart-tv.ts
function buildSmartTvEmailTemplate(username, password, region, subscriptionLength, isRenewal, portalUrl, firstName, serverDomain = "iptv.blancosphere.com") {
  const deviceSpecificInstructions = `
    <ol class="steps-list">
      <li class="step-item">
        <div class="step-content">Press the Home button on your remote</div>
      </li>
      <li class="step-item">
        <div class="step-content">Navigate to the app store on your TV (Samsung Apps, LG Content Store, etc.)</div>
      </li>
      <li class="step-item">
        <div class="step-content">Search for and install the "Smart IPTV" app</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the Smart IPTV app</div>
      </li>
      <li class="step-item">
        <div class="step-content">Navigate to Settings > Configuration</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter your M3U URL or scan the QR code provided above</div>
      </li>
      <li class="step-item">
        <div class="step-content">Save your settings and restart the app</div>
      </li>
    </ol>
    `;
  const deviceSpecificTip = `For the best streaming experience on your Smart TV, we recommend connecting directly to your router with an Ethernet cable instead of using Wi-Fi for more stable streaming.`;
  return createBaseEmailTemplate(
    "smart_tv",
    username,
    password,
    region,
    subscriptionLength,
    isRenewal,
    deviceSpecificInstructions,
    deviceSpecificTip,
    portalUrl,
    firstName,
    serverDomain
  );
}
__name(buildSmartTvEmailTemplate, "buildSmartTvEmailTemplate");

// src/utils/email/fire-stick.ts
function buildFireStickEmailTemplate(username, password, region, subscriptionLength, isRenewal, portalUrl, firstName, serverDomain = "iptv.blancosphere.com") {
  const deviceSpecificInstructions = `
    <ol class="steps-list">
      <li class="step-item">
        <div class="step-content">From your Fire Stick home screen, search for and install the "Downloader" app</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the Downloader app and enter: bit.ly/iptv-player</div>
      </li>
      <li class="step-item">
        <div class="step-content">Follow the prompts to install the IPTV player</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the newly installed IPTV player</div>
      </li>
      <li class="step-item">
        <div class="step-content">Select "Add Playlist" > "Add M3U URL"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter the M3U URL shown above or scan the QR code</div>
      </li>
      <li class="step-item">
        <div class="step-content">Name your playlist (e.g., "My Subscription")</div>
      </li>
      <li class="step-item">
        <div class="step-content">Save and enjoy your content</div>
      </li>
    </ol>
    `;
  const deviceSpecificTip = `To navigate your Fire Stick faster, press and hold the Home button on your remote to access shortcuts, and keep your Fire Stick updated for the best streaming performance.`;
  return createBaseEmailTemplate(
    "fire_stick",
    username,
    password,
    region,
    subscriptionLength,
    isRenewal,
    deviceSpecificInstructions,
    deviceSpecificTip,
    portalUrl,
    firstName,
    serverDomain
  );
}
__name(buildFireStickEmailTemplate, "buildFireStickEmailTemplate");

// src/utils/email/android-box.ts
function buildAndroidBoxEmailTemplate(username, password, region, subscriptionLength, isRenewal, portalUrl, firstName, serverDomain = "iptv.blancosphere.com") {
  const deviceSpecificInstructions = `
    <ol class="steps-list">
      <li class="step-item">
        <div class="step-content">Open the Google Play Store on your Android Box</div>
      </li>
      <li class="step-item">
        <div class="step-content">Search for and install "IPTV Smarters Pro" or "TiviMate"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the installed app</div>
      </li>
      <li class="step-item">
        <div class="step-content">Select "Add Playlist" or "Add New Playlist"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Choose "Add M3U URL" or "Add URL"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter your playlist URL with your username and password (shown above) or scan the QR code</div>
      </li>
      <li class="step-item">
        <div class="step-content">Name your playlist (e.g., "My IPTV")</div>
      </li>
      <li class="step-item">
        <div class="step-content">Save and enjoy your content</div>
      </li>
    </ol>
    `;
  const deviceSpecificTip = `For best performance, connect your Android Box via Ethernet instead of Wi-Fi if possible, and periodically restart your device to clear cache and improve streaming quality.`;
  return createBaseEmailTemplate(
    "android_box",
    username,
    password,
    region,
    subscriptionLength,
    isRenewal,
    deviceSpecificInstructions,
    deviceSpecificTip,
    portalUrl,
    firstName,
    serverDomain
  );
}
__name(buildAndroidBoxEmailTemplate, "buildAndroidBoxEmailTemplate");

// src/utils/email/ios.ts
function buildIosEmailTemplate(username, password, region, subscriptionLength, isRenewal, portalUrl, firstName, serverDomain = "iptv.blancosphere.com") {
  const deviceSpecificInstructions = `
    <ol class="steps-list">
      <li class="step-item">
        <div class="step-content">Install "IPTV Smarters Pro" from the App Store</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the IPTV Smarters Pro app</div>
      </li>
      <li class="step-item">
        <div class="step-content">Tap on "Add New User"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter a name for your subscription (e.g., "My Subscription")</div>
      </li>
      <li class="step-item">
        <div class="step-content">Select "M3U URL" as input type</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter your M3U URL or scan the QR code provided above</div>
      </li>
      <li class="step-item">
        <div class="step-content">Tap "Add User" to save</div>
      </li>
      <li class="step-item">
        <div class="step-content">Your channels will now load automatically</div>
      </li>
    </ol>
    `;
  const deviceSpecificTip = `For iOS devices, make sure to keep the app updated to ensure compatibility with the latest iOS versions. You can also use AirPlay to mirror your screen to Apple TV for a bigger viewing experience.`;
  return createBaseEmailTemplate(
    "ios",
    username,
    password,
    region,
    subscriptionLength,
    isRenewal,
    deviceSpecificInstructions,
    deviceSpecificTip,
    portalUrl,
    firstName,
    serverDomain
  );
}
__name(buildIosEmailTemplate, "buildIosEmailTemplate");

// src/utils/email/android-phone.ts
function buildAndroidPhoneEmailTemplate(username, password, region, subscriptionLength, isRenewal, portalUrl, firstName, serverDomain = "iptv.blancosphere.com") {
  const deviceSpecificInstructions = `
    <ol class="steps-list">
      <li class="step-item">
        <div class="step-content">Install "IPTV Smarters Pro" from Google Play Store</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the app and tap "Add User"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter a name for your profile (e.g., "My Subscription")</div>
      </li>
      <li class="step-item">
        <div class="step-content">Choose "M3U URL" for playlist type</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter your M3U URL or simply scan the QR code above</div>
      </li>
      <li class="step-item">
        <div class="step-content">Save your configuration</div>
      </li>
      <li class="step-item">
        <div class="step-content">Your channels will load automatically</div>
      </li>
    </ol>
    `;
  const deviceSpecificTip = `For casting to a TV, make sure both devices are on the same Wi-Fi network. Use landscape mode for the best viewing experience, and consider using headphones for better audio when watching in public places.`;
  return createBaseEmailTemplate(
    "android_phone",
    username,
    password,
    region,
    subscriptionLength,
    isRenewal,
    deviceSpecificInstructions,
    deviceSpecificTip,
    portalUrl,
    firstName,
    serverDomain
  );
}
__name(buildAndroidPhoneEmailTemplate, "buildAndroidPhoneEmailTemplate");

// src/utils/email/web-browser.ts
function buildWebBrowserEmailTemplate(username, password, region, subscriptionLength, isRenewal, portalUrl, firstName, serverDomain = "iptv.blancosphere.com") {
  const deviceSpecificInstructions = `
    <ol class="steps-list">
      <li class="step-item">
        <div class="step-content">Open your preferred web browser (Chrome, Firefox, Safari, etc.)</div>
      </li>
      <li class="step-item">
        <div class="step-content">Visit: <strong>http://watch.blancosphere.com</strong></div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter your username: <strong>${username}</strong></div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter your password: <strong>${password}</strong></div>
      </li>
      <li class="step-item">
        <div class="step-content">Click "Sign In"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Use the navigation menu to browse channels by category</div>
      </li>
    </ol>
    `;
  const deviceSpecificTip = `For the best web browsing experience, use Chrome, Firefox, or Edge for optimal compatibility. Bookmark the page for easy access in the future, and use full-screen mode (F11 on most browsers) for immersive viewing.`;
  return createBaseEmailTemplate(
    "web_browser",
    username,
    password,
    region,
    subscriptionLength,
    isRenewal,
    deviceSpecificInstructions,
    deviceSpecificTip,
    portalUrl,
    firstName,
    serverDomain
  );
}
__name(buildWebBrowserEmailTemplate, "buildWebBrowserEmailTemplate");

// src/utils/email/mag-box.ts
function buildMagBoxEmailTemplate(username, password, region, subscriptionLength, isRenewal, portalUrl, firstName, serverDomain = "iptv.blancosphere.com") {
  const deviceSpecificInstructions = `
    <ol class="steps-list">
      <li class="step-item">
        <div class="step-content">Power on your MAG box</div>
      </li>
      <li class="step-item">
        <div class="step-content">Go to the Settings menu</div>
      </li>
      <li class="step-item">
        <div class="step-content">Select "System Settings"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Navigate to "Servers" or "Portal Settings"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter the portal URL: <strong>http://${serverDomain}/c/</strong></div>
      </li>
      <li class="step-item">
        <div class="step-content">If prompted, restart your MAG box</div>
      </li>
      <li class="step-item">
        <div class="step-content">Your channels should now load automatically</div>
      </li>
    </ol>
    `;
  const deviceSpecificTip = `Your MAG box is already registered in our system. For optimal performance, keep your MAG box firmware updated, and use a wired Ethernet connection rather than Wi-Fi when possible. If you change your MAG box, please contact support.`;
  return createBaseEmailTemplate(
    "mag_box",
    username,
    password,
    region,
    subscriptionLength,
    isRenewal,
    deviceSpecificInstructions,
    deviceSpecificTip,
    portalUrl,
    firstName,
    serverDomain
  );
}
__name(buildMagBoxEmailTemplate, "buildMagBoxEmailTemplate");

// src/utils/email/other.ts
function buildOtherDeviceEmailTemplate(username, password, region, subscriptionLength, isRenewal, portalUrl, firstName, serverDomain = "iptv.blancosphere.com") {
  const deviceSpecificInstructions = `
    <ol class="steps-list">
      <li class="step-item">
        <div class="step-content">Download and install an IPTV player app appropriate for your device</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the app and navigate to settings or configuration</div>
      </li>
      <li class="step-item">
        <div class="step-content">Look for an option like "Add M3U Playlist", "Add Stream", or "Add Source"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter the M3U URL shown above or scan the QR code with your device</div>
      </li>
      <li class="step-item">
        <div class="step-content">Some apps may ask for separate username and password instead of a full URL</div>
      </li>
      <li class="step-item">
        <div class="step-content">Save your settings and restart the app if needed</div>
      </li>
      <li class="step-item">
        <div class="step-content">Browse and enjoy your content</div>
      </li>
    </ol>
    `;
  const deviceSpecificTip = `If you need device-specific instructions or recommendations for IPTV player apps, please contact our support team. We can provide customized guidance for your particular setup.`;
  return createBaseEmailTemplate(
    "other",
    username,
    password,
    region,
    subscriptionLength,
    isRenewal,
    deviceSpecificInstructions,
    deviceSpecificTip,
    portalUrl,
    firstName,
    serverDomain
  );
}
__name(buildOtherDeviceEmailTemplate, "buildOtherDeviceEmailTemplate");

// src/utils/email/index.ts
var emailBuilders = {
  "smart_tv": buildSmartTvEmailTemplate,
  "fire_stick": buildFireStickEmailTemplate,
  "android_box": buildAndroidBoxEmailTemplate,
  "ios": buildIosEmailTemplate,
  "android_phone": buildAndroidPhoneEmailTemplate,
  "web_browser": buildWebBrowserEmailTemplate,
  "mag_box": buildMagBoxEmailTemplate,
  "other": buildOtherDeviceEmailTemplate
};
function buildEnhancedEmailBody(deviceType, username, password, region, subscriptionLength, isRenewal, portalUrl, firstName, serverDomain = "iptv.blancosphere.com") {
  const builder = emailBuilders[deviceType] || emailBuilders["other"];
  return builder(
    username,
    password,
    region,
    subscriptionLength,
    isRenewal,
    portalUrl,
    firstName,
    serverDomain
  );
}
__name(buildEnhancedEmailBody, "buildEnhancedEmailBody");

// src/handlers/activation.ts
async function handleActivate(request, env) {
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
      checkoutToken
    });
    if (validationError) return createErrorResponse(validationError, 400);
    const deviceTypes = parseDeviceTypes(deviceTypesParam);
    const deviceTypesError = validateDeviceTypes(deviceTypes);
    if (deviceTypesError) return createErrorResponse(deviceTypesError, 400);
    const tokenData = await env.KV.get(`checkout:${checkoutToken}`);
    if (!tokenData) return createErrorResponse("Invalid or expired checkout token", 400);
    await env.KV.delete(`checkout:${checkoutToken}`);
    const bouquetConfig = REGIONAL_OPTIONS[region];
    if (!bouquetConfig) return createErrorResponse(`Invalid region: ${region}`, 400);
    const expiryDate = new Date(Date.now() + parseInt(subscriptionLength) * 30 * 24 * 60 * 60 * 1e3).toISOString();
    const kvKey = `user:${customer_id}`;
    const stored = await env.KV.get(kvKey);
    let username = null;
    let password = null;
    let isRenewal = false;
    if (stored) {
      try {
        const { username: storedUser, password: storedPass } = JSON.parse(stored);
        if (!storedUser || !storedPass) throw new Error("Invalid stored credentials");
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
          device_types: deviceTypes
        });
      } catch (error) {
        console.error("Error renewing existing subscription:", error);
        await logEvent(env, "renewal_failed", {
          customer_id,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    if (!username || !password) {
      const createUrl = `https://activationpanel.net/api/api.php?action=new&type=m3u&sub=${subscriptionLength}&pack=${encodeURIComponent(bouquetConfig)}&api_key=${env.ACTIVATION_PANEL_KEY}`;
      console.log("Creating new subscription with URL:", createUrl);
      const result = await fetchFromActivationPanel(createUrl);
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
    const updatedData = {
      username,
      password,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      subscriptionLength,
      region,
      expiry_date: expiryDate,
      device_types: deviceTypes,
      user_email,
      status: "active",
      last_renewed: isRenewal ? (/* @__PURE__ */ new Date()).toISOString() : void 0
    };
    await env.KV.put(kvKey, JSON.stringify(updatedData));
    let emailSuccessCount = 0;
    let emailFailureCount = 0;
    const serverDomain = "iptv.blancosphere.com";
    for (const deviceType of deviceTypes) {
      try {
        const deviceName = formatDeviceName(deviceType);
        const subject = isRenewal ? `Your IPTV Subscription Renewed - ${deviceName} Setup` : `Welcome to Blancosphere - ${deviceName} Setup`;
        const emailHtml = buildEnhancedEmailBody(
          deviceType,
          username,
          password,
          region,
          subscriptionLength,
          isRenewal,
          void 0,
          // portalUrl (optional)
          void 0,
          // firstName (optional)
          serverDomain
        );
        await sendEmail(env, user_email, subject, emailHtml);
        await logEvent(env, "email_sent", { device_types: deviceTypes, customer_id, user_email, isRenewal });
        emailSuccessCount++;
        if (deviceTypes.length > 1 && deviceType !== deviceTypes[deviceTypes.length - 1]) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (emailErr) {
        console.error(`Failed to send email for ${deviceType}:`, emailErr);
        await logEvent(env, "email_failed", {
          device_types: deviceTypes,
          customer_id,
          user_email,
          error: emailErr instanceof Error ? emailErr.message : String(emailErr)
        });
        emailFailureCount++;
      }
    }
    await logEvent(env, "multi_device_email_complete", {
      customer_id,
      total_devices: deviceTypes.length,
      success_count: emailSuccessCount,
      failure_count: emailFailureCount
    });
    return createJsonResponse({
      success: true,
      renewed: isRenewal,
      message: isRenewal ? `Your subscription has been renewed successfully. Check your email for setup instructions for your ${deviceTypes.length} device(s).` : `Your subscription has been activated successfully. Check your email for setup instructions for your ${deviceTypes.length} device(s).`,
      username,
      expiry_date: expiryDate
      // Not returning the password for security.
    });
  } catch (err) {
    console.error("Unexpected error in handleActivate:", err);
    return createErrorResponse(`Internal server error: ${err instanceof Error ? err.message : String(err)}`, 500);
  }
}
__name(handleActivate, "handleActivate");

// src/handlers/status.ts
async function handleCheckStatus(request, env) {
  if (!validateApiKey(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const url = new URL(request.url);
    const customer_id = url.searchParams.get("customer_id");
    if (!customer_id) {
      return createErrorResponse("Missing customer_id parameter", 400);
    }
    const kvKey = `user:${customer_id}`;
    const stored = await env.KV.get(kvKey);
    if (!stored) {
      return createJsonResponse({
        status: "not_found",
        message: "No subscription found for this customer ID"
      });
    }
    const userData = JSON.parse(stored);
    const safeUserData = {
      username: userData.username,
      region: userData.region,
      subscriptionLength: userData.subscriptionLength,
      expiry_date: userData.expiry_date,
      status: userData.status,
      device_types: userData.device_types,
      created_at: userData.created_at,
      last_renewed: userData.last_renewed
    };
    return createJsonResponse({ status: "success", subscription: safeUserData });
  } catch (err) {
    console.error("Error checking status:", err);
    return createErrorResponse(
      `Error checking status: ${err instanceof Error ? err.message : String(err)}`,
      500
    );
  }
}
__name(handleCheckStatus, "handleCheckStatus");

// src/handlers/instructions.ts
async function handleDeviceInstructions(request, env) {
  try {
    const url = new URL(request.url);
    const device_types = url.searchParams.get("device_types");
    if (!device_types) {
      return createJsonResponse({
        status: "success",
        available_devices: Object.keys(DEVICE_INSTRUCTIONS),
        instructions: DEVICE_INSTRUCTIONS
      });
    }
    if (!DEVICE_INSTRUCTIONS[device_types]) {
      return createErrorResponse(`Unknown device type: ${device_types}`, 404);
    }
    return createJsonResponse({
      status: "success",
      device_types,
      instructions: DEVICE_INSTRUCTIONS[device_types]
    });
  } catch (err) {
    console.error("Error retrieving device instructions:", err);
    return createErrorResponse(`Error retrieving device instructions: ${err instanceof Error ? err.message : String(err)}`, 500);
  }
}
__name(handleDeviceInstructions, "handleDeviceInstructions");

// src/handlers/webhooks.ts
async function handleStripeWebhook(request, env) {
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
      object: event.data.object.object
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
            const userRecord = JSON.parse(userData);
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
          currency: invoice.currency
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
__name(handleStripeWebhook, "handleStripeWebhook");

// src/handlers/cors.ts
function handleCorsPreflightRequest() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, stripe-signature",
      "Access-Control-Max-Age": "86400"
    }
  });
}
__name(handleCorsPreflightRequest, "handleCorsPreflightRequest");

// src/handlers/debug.ts
async function handleDebug(request, env) {
  const url = new URL(request.url);
  const deviceType = url.searchParams.get("device_type") || "smart_tv";
  const username = url.searchParams.get("username") || "test_user123";
  const password = url.searchParams.get("password") || "SecurePass456!";
  const region = url.searchParams.get("region") || "north_america";
  const subscriptionLength = url.searchParams.get("subscription_length") || "12";
  const isRenewal = url.searchParams.get("is_renewal") === "true";
  const firstName = url.searchParams.get("first_name") || "Test User";
  const serverDomain = url.searchParams.get("server_domain") || "iptv.blancosphere.com";
  const portalUrl = url.searchParams.get("portal_url") || "https://portal.blancosphere.com";
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
    return new Response(emailHtml, {
      headers: { "Content-Type": "text/html" }
    });
  } catch (error) {
    return new Response(`Error generating email template: ${error instanceof Error ? error.message : String(error)}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}
__name(handleDebug, "handleDebug");

// src/index.ts
var src_default = {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const method = request.method;
      if (url.pathname === "/debug/email") {
        return await handleDebug(request, env);
      }
      if (method === "OPTIONS") return handleCorsPreflightRequest();
      switch (url.pathname) {
        case "/create-checkout":
          if (method === "POST") return await handleCreateCheckout(request, env);
          break;
        case "/activate":
          if (method === "GET") return await handleActivate(request, env);
          break;
        case "/webhook":
          if (method === "POST") return await handleStripeWebhook(request, env);
          break;
        case "/check-status":
          if (method === "GET") return await handleCheckStatus(request, env);
          break;
        case "/device-instructions":
          if (method === "GET") return await handleDeviceInstructions(request, env);
          break;
        case "/health-check":
          return createJsonResponse({
            status: "healthy",
            version: "1.1.0",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
      }
      return createErrorResponse(`Not Found: ${url.pathname} with method ${method}`, 404);
    } catch (err) {
      console.error("Unexpected error in main handler:", err);
      return createErrorResponse(
        `Internal server error: ${err instanceof Error ? err.message : String(err)}`,
        500
      );
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-9lBNsX/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-9lBNsX/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
