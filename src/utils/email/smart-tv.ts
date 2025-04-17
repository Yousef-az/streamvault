// src/utils/email/smart-tv.ts
import { createBaseEmailTemplate } from './base-template';

/**
 * Builds a Smart TV specific email template
 */
export function buildSmartTvEmailTemplate(
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
        <div class="step-content">Press the Home button on your remote</div>
      </li>
      <li class="step-item">
        <div class="step-content">Navigate to the app store on your TV (Samsung Apps, LG Content Store, etc.)</div>
      </li>
      <li class="step-item">
        <div class="step-content">Search for and install the "Smart IPTV" app</div>
      </li>
      <li class="step-item">
        <div class="step-content">Open the Smart IPTV app</div>
      </li>
      <li class="step-item">
        <div class="step-content">Navigate to Settings > Configuration</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter your M3U URL or scan the QR code provided above</div>
      </li>
      <li class="step-item">
        <div class="step-content">Save your settings and restart the app</div>
      </li>
    </ol>
    `;

    const deviceSpecificTip = `For the best streaming experience on your Smart TV, we recommend connecting directly to your router with an Ethernet cable instead of using Wi-Fi for more stable streaming.`;

    return createBaseEmailTemplate(
        'smart_tv',
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