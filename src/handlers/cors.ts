// handlers/cors.ts

/**
 * Handles CORS preflight (OPTIONS) requests.
 */
export function handleCorsPreflightRequest(): Response {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, stripe-signature",
            "Access-Control-Max-Age": "86400",
        },
    });
}