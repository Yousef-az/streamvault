// src/types.ts

export interface Env {
    STREAMVAULT_API_KEY: string;
    STREAMVAULT_ADMIN_KEY: string;
    STRIPE_SECRET_KEY: string;
    ACTIVATION_PANEL_KEY: string;
    KV: KVNamespace;
    SENDGRID_API_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
}

export interface ActivationResponse {
    status: string;
    user_id?: string;
    message?: string;
    url?: string;
    mac?: string;
    code?: string;
}

export interface DeviceInfo {
    status: string;
    username?: string;
    password?: string;
    expire?: string;
    country?: string;
    user_id?: string;
    note?: string;
    url?: string;
    enabled?: string;
}

export interface UserCredentials {
    username: string;
    password: string;
    created_at: string;
    subscriptionLength: "1" | "3" | "6" | "12" | "24";
    region: "north_america" | "uk_europe" | "middle_east_arabic" | "asia" | "global";
    expiry_date?: string;
    last_renewed?: string;
    device_types: string[]; // Devices the user will stream from
    user_email: string;
    subscription_id?: string;
    stripe_customer_id?: string;
    status: "active" | "cancelled" | "expired";
    first_name?: string; // User's name
}

/**
 * Describes the selection made by the customer at checkout.
 */
export interface SubscriptionSelection {
    subscriptionLength: "1" | "3" | "6" | "12" | "24"; // Duration of subscription in months
    region: "north_america" | "uk_europe" | "middle_east_arabic" | "asia" | "global"; // Regional content bundle
    customer_id: string; // Unique customer token used across systems
    device_types: string[]; // Types of devices selected (e.g., Apple Devices, Fire Stick)
    user_email: string; // Email entered in Framer
    plan: "launch" | "horizon" | "voyage" | "odyssey" | "infinity"; // ✅ Plan name selected during checkout
    first_name?: string; // Optional field for user’s name
}

export interface StripeSessionResponse {
    url: string;
    id?: string;
    object?: string;
    customer?: string;
    subscription?: string;
}