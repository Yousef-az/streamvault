// src/types.ts
export interface Env {
    STREAMVAULT_API_KEY: string;
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
    device_types: string[]; // Supports multiple devices
    user_email: string;
    subscription_id?: string;
    stripe_customer_id?: string;
    status: "active" | "cancelled" | "expired";
    first_name?: string; // Added field for customer's first name
}

export interface SubscriptionSelection {
    subscriptionLength: "1" | "3" | "6" | "12" | "24";
    region: "north_america" | "uk_europe" | "middle_east_arabic" | "asia" | "global";
    customer_id: string;
    device_types: string[]; // Supports multiple devices
    user_email: string;
    first_name?: string; // Added field for customer's first name
}

export interface StripeSessionResponse {
    url: string;
    id?: string;
    object?: string;
    customer?: string;
    subscription?: string;
}