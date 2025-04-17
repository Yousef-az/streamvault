// src/utils/email/android-phone.ts
import { createBaseEmailTemplate } from './base-template';

/**
 * Builds an Android Phone specific email template
 */
export function buildAndroidPhoneEmailTemplate(
    username: string,
    password: string,
    region: string,
    subscriptionLength: string,
    isRenewal: boolean,
    portalUrl?: string,
    firstName?: string,
    serverDomain: string = "iptv.blancosphere.com"
): string {
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
        'android_phone',
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