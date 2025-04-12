// handlers/status.ts
import { Env, UserCredentials } from '../src/types';
import { createErrorResponse, createJsonResponse } from '../src/utils/helpers';

/**
 * Handles account status checking.
 */
export async function handleCheckStatus(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const customer_id = url.searchParams.get("customer_id");
        if (!customer_id) return createErrorResponse("Missing customer_id parameter", 400);

        const kvKey = `user:${customer_id}`;
        const stored = await env.KV.get(kvKey);
        if (!stored) {
            return createJsonResponse({
                status: "not_found",
                message: "No subscription found for this customer ID",
            });
        }

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
        return createErrorResponse(`Error checking status: ${err instanceof Error ? err.message : String(err)}`, 500);
    }
}