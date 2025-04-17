// handlers/instructions.ts
import { Env } from '../types';
import { createErrorResponse, createJsonResponse } from '../utils/helpers';
import { DEVICE_INSTRUCTIONS } from '../config';

/**
 * Handles device instructions retrieval.
 */
export async function handleDeviceInstructions(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const device_types = url.searchParams.get("device_types");
        if (!device_types) {
            return createJsonResponse({
                status: "success",
                available_devices: Object.keys(DEVICE_INSTRUCTIONS),
                instructions: DEVICE_INSTRUCTIONS,
            });
        }
        if (!DEVICE_INSTRUCTIONS[device_types]) {
            return createErrorResponse(`Unknown device type: ${device_types}`, 404);
        }
        return createJsonResponse({
            status: "success",
            device_types,
            instructions: DEVICE_INSTRUCTIONS[device_types],
        });
    } catch (err) {
        console.error("Error retrieving device instructions:", err);
        return createErrorResponse(`Error retrieving device instructions: ${err instanceof Error ? err.message : String(err)}`, 500);
    }
}