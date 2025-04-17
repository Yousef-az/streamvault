// src/utils/email/other.ts
import { createBaseEmailTemplate } from './base-template';

/**
 * Builds a generic template for any unspecified device type
 */
export function buildOtherDeviceEmailTemplate(
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
        <div class="step-content">Download and install an IPTV player app appropriate for your device</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the app and navigate to settings or configuration</div>
      </li>
      <li class="step-item">
        <div class="step-content">Look for an option like "Add M3U Playlist", "Add Stream", or "Add Source"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter the M3U URL shown above or scan the QR code with your device</div>
      </li>
      <li class="step-item">
        <div class="step-content">Some apps may ask for separate username and password instead of a full URL</div>
      </li>
      <li class="step-item">
        <div class="step-content">Save your settings and restart the app if needed</div>
      </li>
      <li class="step-item">
        <div class="step-content">Browse and enjoy your content</div>
      </li>
    </ol>
    `;

    const deviceSpecificTip = `If you need device-specific instructions or recommendations for IPTV player apps, please contact our support team. We can provide customized guidance for your particular setup.`;

    return createBaseEmailTemplate(
        'other',
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