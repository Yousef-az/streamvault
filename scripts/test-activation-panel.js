// test-activation-panel.js
const fetch = require('node-fetch');
require('dotenv').config();

// Get API key from .env file
const API_KEY = process.env.ACTIVATION_PANEL_KEY;

if (!API_KEY) {
    console.error('Error: ACTIVATION_PANEL_KEY not found in .env file');
    process.exit(1);
}

// Test functions
async function testCreateSubscription() {
    console.log('Testing: Create New Subscription');

    const url = `https://activationpanel.net/api/api.php?action=new&type=m3u&sub=1&pack=bouquet_na&api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('Response:', data);

        if (data.status === 'true' && data.url) {
            console.log('✅ Success! New subscription created');
            console.log(`M3U URL: ${data.url}`);

            // Extract credentials for testing renewal
            const urlObj = new URL(data.url);
            const username = urlObj.searchParams.get('username');
            const password = urlObj.searchParams.get('password');

            return { username, password };
        } else {
            console.log('❌ Failed to create subscription');
            return null;
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return null;
    }
}

async function testRenewalSubscription(username, password) {
    if (!username || !password) {
        console.log('⚠️ Cannot test renewal: missing credentials');
        return;
    }

    console.log('\nTesting: Renew Subscription');

    const url = `https://activationpanel.net/api/api.php?action=renew&type=m3u&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&sub=1&api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('Response:', data);

        if (data.status === 'true') {
            console.log('✅ Success! Subscription renewed');
        } else {
            console.log('❌ Failed to renew subscription');
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
}

async function testDeviceInfo(username, password) {
    if (!username || !password) {
        console.log('⚠️ Cannot test device info: missing credentials');
        return;
    }

    console.log('\nTesting: Get Device Info');

    const url = `https://activationpanel.net/api/api.php?action=device_info&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('Response:', data);

        if (data.status === 'true') {
            console.log('✅ Success! Got device info');
            console.log(`Expiry date: ${data.expire}`);
        } else {
            console.log('❌ Failed to get device info');
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
}

// Run tests
async function runTests() {
    console.log('🔍 Starting Activation Panel API Tests\n');

    const credentials = await testCreateSubscription();

    if (credentials) {
        await testRenewalSubscription(credentials.username, credentials.password);
        await testDeviceInfo(credentials.username, credentials.password);
    }

    console.log('\nActivation Panel API Tests Complete');
}

runTests();