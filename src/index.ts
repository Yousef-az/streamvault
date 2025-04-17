// src/index.ts
import { Env } from './types';
import { createErrorResponse, createJsonResponse } from './utils/helpers';
import { handleCreateCheckout } from './handlers/checkout';
import { handleActivate } from './handlers/activation';
import { handleCheckStatus } from './handlers/status';
import { handleDeviceInstructions } from './handlers/instructions';
import { handleStripeWebhook } from './handlers/webhooks';
import { handleCorsPreflightRequest } from './handlers/cors';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		try {
			const url = new URL(request.url);
			const method = request.method;

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
						timestamp: new Date().toISOString(),
					});
			}

			return createErrorResponse(`Not Found: ${url.pathname} with method ${method}`, 404);
		} catch (err) {
			console.error("Unexpected error in main handler:", err);
			return createErrorResponse(`Internal server error: ${err instanceof Error ? err.message : String(err)}`, 500);
		}
	},
};