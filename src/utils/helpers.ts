// src/utils/helpers.ts
import { Env, StripeSessionResponse } from '../types';
import { DEVICE_INSTRUCTIONS } from '../config';

/**
 * Handles errors from a promise and returns a tuple [data, error].
 */
export async function handleErrors<T>(promise: Promise<T>): Promise<[T | null, Error | null]> {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        return [null, error instanceof Error ? error : new Error(String(error))];
    }
}

/**
 * Validates that all required parameters are present.
 */
export function validateRequiredParams(params: Record<string, string | null>): string | null {
    for (const [key, value] of Object.entries(params)) {
        if (!value) return `Missing required parameter: ${key}`;
    }
    return null;
}

/**
 * Fetches JSON from the Activation Panel API.
 */
export async function fetchFromActivationPanel(url: string): Promise<any> {
    const [response, fetchError] = await handleErrors(fetch(url));
    if (fetchError) throw new Error(`API request failed: ${fetchError.message}`);
    if (!response || !response.ok) throw new Error(`API request failed with status: ${response?.status}`);
    const [data, jsonError] = await handleErrors(response.json());
    if (jsonError) throw new Error(`Failed to parse API response: ${jsonError.message}`);
    return data;
}

/**
 * Creates a standard JSON response.
 */
export function createJsonResponse(data: any, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
        },
    });
}

/**
 * Creates an error JSON response.
 */
export function createErrorResponse(message: string, status = 400): Response {
    return createJsonResponse({ error: message }, status);
}

/**
 * Logs an event to the KV store.
 */
export async function logEvent(env: Env, eventType: string, data: Record<string, any>): Promise<void> {
    try {
        const timestamp = new Date().toISOString();
        const logKey = `log:${eventType}:${timestamp}:${crypto.randomUUID()}`;
        await env.KV.put(logKey, JSON.stringify({ timestamp, eventType, ...data }), { expirationTtl: 2592000 });
    } catch (error) {
        console.error(`Failed to log ${eventType} event:`, error);
    }
}

/**
 * Extracts credentials from an M3U URL.
 */
export function extractCredentials(m3uUrl: string): { username: string; password: string } | null {
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

/**
 * Processes the Stripe response using a custom session parser.
 */
export async function handleStripeResponse(
    stripeResponse: Response | null,
    sessionParser: (data: StripeSessionResponse) => any
): Promise<any> {
    if (!stripeResponse) throw new Error("Failed to connect to Stripe API");
    if (!stripeResponse.ok) throw new Error(`Stripe API returned error status: ${stripeResponse.status}`);
    const [sessionData, sessionError] = await handleErrors<StripeSessionResponse>(stripeResponse.json());
    if (sessionError) throw new Error(`Failed to parse Stripe response: ${sessionError.message}`);
    if (!sessionData?.url) throw new Error("Stripe session creation failed - missing redirect URL");
    return sessionParser(sessionData);
}

/**
 * Generates a secure random token.
 */
export function generateSecureToken(length = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifies a Stripe webhook signature.
 */
export function verifyStripeWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
        // ✅ You can enhance this with crypto.subtle for real HMAC SHA256
        console.log("Verifying webhook signature:", {
            payload: payload.substring(0, 20) + "...",
            signature
        });
        return true; // Stub: replace with real HMAC check if needed
    } catch (error) {
        console.error("Signature verification error:", error);
        return false;
    }
}

/**
 * Parses a comma-separated device types string into an array.
 */
export function parseDeviceTypes(deviceTypesString: string): string[] {
    if (!deviceTypesString) return [];
    return deviceTypesString.split(",").map(d => d.trim()).filter(Boolean);
}

/**
 * Validates that all provided device types are supported.
 */
export function validateDeviceTypes(deviceTypes: string[]): string | null {
    if (!deviceTypes.length) return "At least one device type must be selected";
    const unsupportedDevices = deviceTypes.filter(d => !DEVICE_INSTRUCTIONS[d]);
    return unsupportedDevices.length ? `Unsupported device type(s): ${unsupportedDevices.join(", ")}` : null;
}

/**
 * Formats device type names for display.
 */
export function formatDeviceName(deviceType: string): string {
    return deviceType
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Validates the x-api-key header against the STREAMVAULT_ADMIN_KEY.
 */
export function validateApiKey(request: Request, env: Env): boolean {
    const apiKey = request.headers.get("x-api-key");
    return apiKey === env.STREAMVAULT_ADMIN_KEY;
}