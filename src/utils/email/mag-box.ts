// src/utils/email/mag-box.ts
import { createBaseEmailTemplate } from './base-template';

/**
 * Builds a MAG Box specific email template
 */
export function buildMagBoxEmailTemplate(
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
        <div class="step-content">Power on your MAG box</div>
      </li>
      <li class="step-item">
        <div class="step-content">Go to the Settings menu</div>
      </li>
      <li class="step-item">
        <div class="step-content">Select "System Settings"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Navigate to "Servers" or "Portal Settings"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter the portal URL: <strong>http://${serverDomain}/c/</strong></div>
      </li>
      <li class="step-item">
        <div class="step-content">If prompted, restart your MAG box</div>
      </li>
      <li class="step-item">
        <div class="step-content">Your channels should now load automatically</div>
      </li>
    </ol>
    `;

    const deviceSpecificTip = `Your MAG box is already registered in our system. For optimal performance, keep your MAG box firmware updated, and use a wired Ethernet connection rather than Wi-Fi when possible. If you change your MAG box, please contact support.`;

    return createBaseEmailTemplate(
        'mag_box',
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