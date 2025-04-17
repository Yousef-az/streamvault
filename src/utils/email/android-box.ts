// src/utils/email/android-box.ts
import { createBaseEmailTemplate } from './base-template';

/**
 * Builds an Android Box specific email template
 */
export function buildAndroidBoxEmailTemplate(
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
        <div class="step-content">Open the Google Play Store on your Android Box</div>
      </li>
      <li class="step-item">
        <div class="step-content">Search for and install "IPTV Smarters Pro" or "TiviMate"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the installed app</div>
      </li>
      <li class="step-item">
        <div class="step-content">Select "Add Playlist" or "Add New Playlist"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Choose "Add M3U URL" or "Add URL"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter your playlist URL with your username and password (shown above) or scan the QR code</div>
      </li>
      <li class="step-item">
        <div class="step-content">Name your playlist (e.g., "My IPTV")</div>
      </li>
      <li class="step-item">
        <div class="step-content">Save and enjoy your content</div>
      </li>
    </ol>
    `;

    const deviceSpecificTip = `For best performance, connect your Android Box via Ethernet instead of Wi-Fi if possible, and periodically restart your device to clear cache and improve streaming quality.`;

    return createBaseEmailTemplate(
        'android_box',
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