// scripts/test-email-templates.js
const fs = require('fs');
const path = require('path');

// Create output directory
const outputDir = path.join(__dirname, 'email-previews');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Sample data for testing templates
const testData = {
    username: 'test_user123',
    password: 'SecurePass456!',
    region: 'north_america',
    subscriptionLength: '12',
    isRenewal: false,
    portalUrl: 'https://portal.blancosphere.com',
    firstName: 'John',
    serverDomain: 'iptv.blancosphere.com'
};

// Create a sample HTML template for each device type
const deviceTypes = [
    'smart_tv',
    'fire_stick',
    'android_box',
    'ios',
    'android_phone',
    'web_browser',
    'mag_box',
    'other'
];

// Generate preview files
deviceTypes.forEach(deviceType => {
    console.log(`Generating preview for ${deviceType}...`);

    // Create HTML preview with template variables
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${deviceType} Email Preview</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .preview-box { border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
    .variable { color: #0066cc; font-family: monospace; }
    .device-type { font-weight: bold; color: #cc0066; }
  </style>
</head>
<body>
  <h1>${deviceType} Email Template Preview</h1>
  
  <div class="preview-box">
    <h2>Template Variables</h2>
    <ul>
      <li>Device Type: <span class="device-type">${deviceType}</span></li>
      <li>Username: <span class="variable">${testData.username}</span></li>
      <li>Password: <span class="variable">${testData.password}</span></li>
      <li>Region: <span class="variable">${testData.region}</span></li>
      <li>Subscription Length: <span class="variable">${testData.subscriptionLength}</span></li>
      <li>Is Renewal: <span class="variable">${testData.isRenewal}</span></li>
      <li>First Name: <span class="variable">${testData.firstName}</span></li>
      <li>Server Domain: <span class="variable">${testData.serverDomain}</span></li>
    </ul>
  </div>
  
  <div class="preview-box">
    <h2>Email Content Preview</h2>
    <p>This is a placeholder for the actual email content. To see the real templates, you need to test them directly with the Wrangler development server.</p>
  </div>
  
  <div class="preview-box">
    <h2>Testing Instructions</h2>
    <p>To see the actual rendered email templates, you need to:</p>
    <ol>
      <li>Start your Cloudflare Worker with <code>npx wrangler dev</code></li>
      <li>Create a new endpoint in your worker for previewing emails</li>
      <li>Access the endpoint with appropriate query parameters</li>
    </ol>
  </div>
</body>
</html>
  `;

    fs.writeFileSync(
        path.join(outputDir, `${deviceType}.html`),
        htmlContent
    );
});

console.log(`\nPreview files generated in ${outputDir}`);
console.log('Open these HTML files in your browser to see basic previews');