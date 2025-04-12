// src/utils/email.ts
import { Env } from '../types';
import { DEVICE_EMOJIS, DEVICE_INSTRUCTIONS, REGION_DISPLAY_NAMES, REGION_EMOJIS } from '../config';
import { formatDeviceName } from './helpers';

/**
 * Sends an email using SendGrid.
 */
export async function sendEmail(env: Env, toEmail: string, subject: string, htmlContent: string) {
    const url = "https://api.sendgrid.com/v3/mail/send";
    const body = {
        personalizations: [{ to: [{ email: toEmail }], subject }],
        from: { email: "support@blancosphere.com", name: "Blancosphere Support" },
        content: [{ type: "text/html", value: htmlContent }],
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SendGrid Error: ${response.status} - ${errorText}`);
    }
}

/**
 * Builds an enhanced HTML email body for a specific device type.
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
    const instructions = DEVICE_INSTRUCTIONS[deviceType] ||
        "<p>Please visit our website for detailed setup instructions for your device.</p>";
    const regionDisplayName = REGION_DISPLAY_NAMES[region] || region;
    const expiryDate = new Date(Date.now() + parseInt(subscriptionLength) * 30 * 24 * 60 * 60 * 1000);
    const formattedExpiryDate = expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const currentDate = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const deviceTypeDisplay = formatDeviceName(deviceType);
    const currentYear = new Date().getFullYear();
    const m3uUrl = `http://${serverDomain}/get.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&type=m3u_plus&output=ts`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(m3uUrl)}&size=150x150`;
    const greeting = firstName ? `Hello ${firstName},` : "Hello,";
    const deviceEmoji = DEVICE_EMOJIS[deviceType] || "📱";
    const regionEmoji = REGION_EMOJIS[region] || "🌍";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${isRenewal ? "Your IPTV Subscription Has Been Renewed" : "Welcome to Blancosphere IPTV!"}</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f9fc;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    /* (CSS for header, credentials, instructions, tips, footer, and responsiveness is included here) */
    /* For brevity, use the CSS you already have in your code above */
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="header-bg">
        <div class="header-content">
          <div class="logo-container">
            <img src="https://blancosphere.com/logo.png" alt="Blancosphere Logo" class="logo">
          </div>
          ${isRenewal ? "" : '<span class="welcome-badge">Welcome</span>'}
          <h1>${isRenewal ? "🔄 Your Subscription Has Been Renewed" : "🎉 Welcome to Premium IPTV!"}</h1>
          <div class="header-date">📅 ${currentDate}</div>
        </div>
      </div>
    </div>
    
    <div class="content">
      <p class="greeting">${greeting}</p>
      <p class="intro-text">${
        isRenewal
            ? "🔄 Your IPTV subscription has been renewed successfully and is now active. We're delighted to have you continue with our premium streaming service."
            : "🎉 Thank you for subscribing to Blancosphere IPTV! Your subscription is now active and ready to use. We're excited to have you join our premium streaming family."
    }</p>
      
      <div class="credentials-box">
        <h2><span class="section-emoji">🔐</span> Your IPTV Access Credentials</h2>
        <div class="credentials-grid">
          <div class="credentials-text">
            <div class="credential-item">
              <span class="credential-label">👤 Username</span>
              <div class="credential-value">${username}</div>
            </div>
            <div class="credential-item">
              <span class="credential-label">🔑 Password</span>
              <div class="credential-value">${password}</div>
            </div>
            <div class="credential-item">
              <span class="credential-label">${regionEmoji} Region</span>
              <div class="credential-value">${regionDisplayName}</div>
            </div>
            <div class="credential-item">
              <span class="credential-label">⏳ Duration</span>
              <div class="credential-value">${subscriptionLength} month${parseInt(subscriptionLength) > 1 ? "s" : ""}</div>
            </div>
            <div class="credential-item">
              <span class="credential-label">📅 Expires</span>
              <div class="credential-value">${formattedExpiryDate}</div>
            </div>
          </div>
          <div class="credentials-qr">
            <img src="${qrCodeUrl}" alt="QR Code for easy login">
            <p>📱 Scan to login on mobile devices</p>
            <div class="m3u-url">M3U URL: ${m3uUrl}</div>
          </div>
        </div>
      </div>
      
      <div class="instructions-box">
        <h2><span class="section-emoji">${deviceEmoji}</span> Setup Instructions for ${deviceTypeDisplay}</h2>
        ${instructions}
        <div class="tip">
          <strong>💡 Pro Tip:</strong> For the best streaming experience on your ${deviceTypeDisplay}, we recommend using a wired connection.
        </div>
      </div>
      
      <div class="warning-box">
        <div class="warning-icon">⚠️</div>
        <p class="warning-text">Please keep your credentials secure. Sharing them may result in account suspension.</p>
      </div>
      
      <div class="tips-box">
        <h3><span class="section-emoji">💡</span> Quick Tips for the Best Experience</h3>
        <ul>
          <li><span class="emoji-bullet">📶</span> Ensure a stable, fast internet connection.</li>
          <li><span class="emoji-bullet">🔄</span> Restart your device if issues arise.</li>
          <li><span class="emoji-bullet">📱</span> Use our mobile app for enhanced features.</li>
          <li><span class="emoji-bullet">🗂️</span> Organize your channels for quick access.</li>
        </ul>
      </div>
      
      <div class="divider"></div>
      
      <div class="button-container">
        ${
        portalUrl
            ? `<a href="${portalUrl}" class="action-button">Manage Your Subscription</a>`
            : `<a href="https://portal.blancosphere.com/guide" class="action-button">View User Guide</a>`
    }
      </div>
      
      <div class="closing">
        <p>We hope you enjoy your premium IPTV experience. For assistance, our support team is here 24/7.</p>
        <p>Happy streaming! 🎬</p>
        <p class="signature">The Blancosphere Team</p>
      </div>
    </div>
    
    <div class="footer">
      <div class="social-links">
        <a href="https://facebook.com/blancosphere" class="social-icon">f</a>
        <a href="https://twitter.com/blancosphere" class="social-icon">t</a>
        <a href="https://instagram.com/blancosphere" class="social-icon">i</a>
        <a href="https://youtube.com/blancosphere" class="social-icon">y</a>
      </div>
      <div class="footer-links">
        <a href="https://blancosphere.com/privacy">Privacy Policy</a> |
        <a href="https://blancosphere.com/terms">Terms of Service</a> |
        <a href="https://blancosphere.com/contact">Contact Us</a>
      </div>
      <p class="footer-links">Email: <a href="mailto:support@blancosphere.com">support@blancosphere.com</a></p>
      <p class="copyright">&copy; ${currentYear} Blancosphere. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}