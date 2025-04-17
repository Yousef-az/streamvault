// handlers/status.ts
import { Env, UserCredentials } from "../types";
import {
    createErrorResponse,
    createJsonResponse,
    validateApiKey,
} from "../utils/helpers"; // Assuming you put validateApiKey here

/**
 * Handles account status checking.
 * Secured via x-api-key header.
 */
export async function handleCheckStatus(request: Request, env: Env): Promise<Response> {
    // 🔐 Step 1: Validate API Key
    if (!validateApiKey(request, env)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        // ✅ Step 2: Parse query params
        const url = new URL(request.url);
        const customer_id = url.searchParams.get("customer_id");

        if (!customer_id) {
            return createErrorResponse("Missing customer_id parameter", 400);
        }

        // 🔍 Step 3: Fetch user subscription from KV
        const kvKey = `user:${customer_id}`;
        const stored = await env.KV.get(kvKey);
        if (!stored) {
            return createJsonResponse({
                status: "not_found",
                message: "No subscription found for this customer ID",
            });
        }

        // 🧠 Step 4: Format and return only safe data
        const userData = JSON.parse(stored) as UserCredentials;
        const safeUserData = {
            username: userData.username,
            region: userData.region,
            subscriptionLength: userData.subscriptionLength,
            expiry_date: userData.expiry_date,
            status: userData.status,
            device_types: userData.device_types,
            created_at: userData.created_at,
            last_renewed: userData.last_renewed,
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