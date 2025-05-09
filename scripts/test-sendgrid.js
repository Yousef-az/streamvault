// test-sendgrid.js
const { sendEmail } = require('../src/utils/email');
const { buildEnhancedEmailBody } = require('../src/utils/email');
require('dotenv').config();

// Mock environment for testing
const testEnv = {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
};

// Test data
const testData = {
    toEmail: process.env.TEST_EMAIL || 'your-test-email@example.com', // Update this!
    subject: 'Test Email from StreamVault',
    username: 'test_user123',
    password: 'SecurePass456!',
    region: 'north_america',
    subscriptionLength: '12',
    deviceType: 'smart_tv',
    isRenewal: false,
    serverDomain: 'iptv.blancosphere.com',
    firstName: 'Test User',
    portalUrl: 'https://portal.blancosphere.com'
};

async function testSendEmail() {
    console.log('🔍 Starting SendGrid Email Test');
    console.log(`Sending test email to: ${testData.toEmail}`);

    try {
        // Generate HTML content
        const htmlContent = buildEnhancedEmailBody(
            testData.deviceType,
            testData.username,
            testData.password,
            testData.region,
            testData.subscriptionLength,
            testData.isRenewal,
            testData.portalUrl,
            testData.firstName,
            testData.serverDomain
        );

        // Send email
        const result = await sendEmail(
            testEnv,
            testData.toEmail,
            testData.subject,
            htmlContent
        );

        console.log('✅ Email sent successfully!');
        console.log('Check your inbox at:', testData.toEmail);

        return true;
    } catch (error) {
        console.log(`❌ Error sending email: ${error.message}`);
        if (error.message.includes('SendGrid Error')) {
            console.log('This may be due to invalid API key or SendGrid restrictions.');
        }

        return false;
    }
}

testSendEmail();