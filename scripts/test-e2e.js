// test-e2e.js
const fetch = require('node-fetch');
require('dotenv').config();

// Configuration
const API_ENDPOINT = 'https://streamvault.yousef-az.workers.dev'; // Your endpoint
const API_KEY = process.env.STREAMVAULT_API_KEY;

// Test data
const testData = {
    subscriptionLength: '1',
    region: 'north_america',
    customer_id: `test_e2e_${Date.now()}`,
    device_types: ['smart_tv'],
    user_email: process.env.TEST_EMAIL || 'your-test-email@example.com',
    first_name: 'E2E Test'
};

// Store results between steps
const testResults = {};

async function step1_createCheckout() {
    console.log('Step 1: Creating checkout session');

    try {
        const response = await fetch(`${API_ENDPOINT}/create-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        if (response.ok && result.url) {
            console.log('✅ Checkout created successfully');
            console.log(`Checkout URL: ${result.url.substring(0, 60)}...`);

            // Extract session_id for next steps
            testResults.session_id = result.session_id;

            // Get checkout token from URL
            const checkoutUrl = new URL(result.url);
            const redirectUrl = new URL(checkoutUrl.searchParams.get('success_url'));
            testResults.checkout_token = redirectUrl.searchParams.get('checkoutToken');

            console.log(`Checkout token: ${testResults.checkout_token}`);

            return true;
        } else {
            console.log('❌ Failed to create checkout');
            console.log(result);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return false;
    }
}

async function step2_simulateActivation() {
    console.log('\nStep 2: Simulating successful payment & activation');

    if (!testResults.checkout_token) {
        console.log('❌ Cannot proceed: missing checkout token');
        return false;
    }

    // Build activation URL
    const activationUrl = new URL(`${API_ENDPOINT}/activate`);
    activationUrl.searchParams.set('subscriptionLength', testData.subscriptionLength);
    activationUrl.searchParams.set('region', testData.region);
    activationUrl.searchParams.set('customer_id', testData.customer_id);
    activationUrl.searchParams.set('device_types', testData.device_types.join(','));
    activationUrl.searchParams.set('user_email', testData.user_email);
    activationUrl.searchParams.set('checkoutToken', testResults.checkout_token);

    if (testData.first_name) {
        activationUrl.searchParams.set('firstName', testData.first_name);
    }

    try {
        const response = await fetch(activationUrl.toString());
        const result = await response.json();

        if (response.ok && result.success) {
            console.log('✅ Activation successful!');
            console.log(`Username: ${result.username}`);
            console.log(`Expiry date: ${result.expiry_date}`);

            // Store username for next step
            testResults.username = result.username;

            return true;
        } else {
            console.log('❌ Activation failed');
            console.log(result);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return false;
    }
}

async function step3_checkStatus() {
    console.log('\nStep 3: Checking subscription status');

    if (!testResults.username) {
        console.log('❌ Cannot proceed: missing username');
        return false;
    }

    const statusUrl = new URL(`${API_ENDPOINT}/check-status`);
    statusUrl.searchParams.set('customer_id', testData.customer_id);

    try {
        const response = await fetch(statusUrl.toString(), {
            headers: { 'x-api-key': API_KEY }
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            console.log('✅ Status check successful!');
            console.log(`Subscription status: ${result.subscription.status}`);
            console.log(`Device types: ${result.subscription.device_types.join(', ')}`);
            return true;
        } else {
            console.log('❌ Status check failed');
            console.log(result);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return false;
    }
}

// Run the full E2E test
async function runE2ETest() {
    console.log('🔍 Starting End-to-End Test\n');

    let success = await step1_createCheckout();
    if (success) {
        success = await step2_simulateActivation();
        if (success) {
            await step3_checkStatus();
        }
    }

    console.log('\nEnd-to-End Test Complete');

    // Provide manual verification steps
    console.log('\nManual verification steps:');
    console.log('1. Check your email inbox for the confirmation email');
    console.log('2. Verify that the email displays correctly on both desktop and mobile');
    console.log('3. Click links in the email to verify they work correctly');
}

runE2ETest();