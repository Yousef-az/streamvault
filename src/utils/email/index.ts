// src/utils/email/index.ts
import { sendEmail } from './send-email';
import { buildSmartTvEmailTemplate } from './smart-tv';
import { buildFireStickEmailTemplate } from './fire-stick';
import { buildAndroidBoxEmailTemplate } from './android-box';
import { buildIosEmailTemplate } from './ios';
import { buildAndroidPhoneEmailTemplate } from './android-phone';
import { buildWebBrowserEmailTemplate } from './web-browser';
import { buildMagBoxEmailTemplate } from './mag-box';
import { buildOtherDeviceEmailTemplate } from './other';

export { sendEmail };

// Map device types to their builders
const emailBuilders: Record<string, Function> = {
    'smart_tv': buildSmartTvEmailTemplate,
    'fire_stick': buildFireStickEmailTemplate,
    'android_box': buildAndroidBoxEmailTemplate,
    'ios': buildIosEmailTemplate,
    'android_phone': buildAndroidPhoneEmailTemplate,
    'web_browser': buildWebBrowserEmailTemplate,
    'mag_box': buildMagBoxEmailTemplate,
    'other': buildOtherDeviceEmailTemplate
};

/**
 * Main function to build email for any device type.
 * This maintains the same interface as your original function.
 */
export function buildEnhancedEmailBody(
    deviceType: string,
    username: string,
    password: string,
    region: string,
    subscriptionLength: string,
    isRenewal: boolean,
    portalUrl?: string,
    firstName?: string,
    serverDomain: string = "iptv.blancosphere.com"
): string {
    const builder = emailBuilders[deviceType] || emailBuilders['other'];
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