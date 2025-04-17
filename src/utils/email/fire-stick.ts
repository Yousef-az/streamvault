// src/utils/email/fire-stick.ts
import { createBaseEmailTemplate } from './base-template';

/**
 * Builds a Fire Stick specific email template
 */
export function buildFireStickEmailTemplate(
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
        <div class="step-content">From your Fire Stick home screen, search for and install the "Downloader" app</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the Downloader app and enter: bit.ly/iptv-player</div>
      </li>
      <li class="step-item">
        <div class="step-content">Follow the prompts to install the IPTV player</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the newly installed IPTV player</div>
      </li>
      <li class="step-item">
        <div class="step-content">Select "Add Playlist" > "Add M3U URL"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter the M3U URL shown above or scan the QR code</div>
      </li>
      <li class="step-item">
        <div class="step-content">Name your playlist (e.g., "My Subscription")</div>
      </li>
      <li class="step-item">
        <div class="step-content">Save and enjoy your content</div>
      </li>
    </ol>
    `;

    const deviceSpecificTip = `To navigate your Fire Stick faster, press and hold the Home button on your remote to access shortcuts, and keep your Fire Stick updated for the best streaming performance.`;

    return createBaseEmailTemplate(
        'fire_stick',
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