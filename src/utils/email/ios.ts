// src/utils/email/ios.ts
import { createBaseEmailTemplate } from './base-template';

/**
 * Builds an iOS specific email template
 */
export function buildIosEmailTemplate(
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
        <div class="step-content">Install "IPTV Smarters Pro" from the App Store</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the IPTV Smarters Pro app</div>
      </li>
      <li class="step-item">
        <div class="step-content">Tap on "Add New User"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter a name for your subscription (e.g., "My Subscription")</div>
      </li>
      <li class="step-item">
        <div class="step-content">Select "M3U URL" as input type</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter your M3U URL or scan the QR code provided above</div>
      </li>
      <li class="step-item">
        <div class="step-content">Tap "Add User" to save</div>
      </li>
      <li class="step-item">
        <div class="step-content">Your channels will now load automatically</div>
      </li>
    </ol>
    `;

    const deviceSpecificTip = `For iOS devices, make sure to keep the app updated to ensure compatibility with the latest iOS versions. You can also use AirPlay to mirror your screen to Apple TV for a bigger viewing experience.`;

    return createBaseEmailTemplate(
        'ios',
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