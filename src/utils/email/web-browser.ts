// src/utils/email/web-browser.ts
import { createBaseEmailTemplate } from './base-template';

/**
 * Builds a Web Browser specific email template
 */
export function buildWebBrowserEmailTemplate(
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
        <div class="step-content">Open your preferred web browser (Chrome, Firefox, Safari, etc.)</div>
      </li>
      <li class="step-item">
        <div class="step-content">Visit: <strong>http://watch.blancosphere.com</strong></div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter your username: <strong>${username}</strong></div>
      </li>
      <li class="step-item">
        <div class="step-content">Enter your password: <strong>${password}</strong></div>
      </li>
      <li class="step-item">
        <div class="step-content">Click "Sign In"</div>
      </li>
      <li class="step-item">
        <div class="step-content">Use the navigation menu to browse channels by category</div>
      </li>
    </ol>
    `;

    const deviceSpecificTip = `For the best web browsing experience, use Chrome, Firefox, or Edge for optimal compatibility. Bookmark the page for easy access in the future, and use full-screen mode (F11 on most browsers) for immersive viewing.`;

    return createBaseEmailTemplate(
        'web_browser',
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