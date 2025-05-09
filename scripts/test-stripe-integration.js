// test-stripe-integration.js
const fetch = require('node-fetch');

// Configuration
const API_ENDPOINT = 'https://streamvault.yousef-az.workers.dev'; // Your endpoint
const TEST_EMAIL = 'test@example.com';

// Test data for various subscription options
const testScenarios = [
    {
        name: 'Basic North America 1-month Subscription',
        data: {
            subscriptionLength: '1',
            region: 'north_america',
            customer_id: `test_${Date.now()}`,
            device_types: ['smart_tv'],
            user_email: TEST_EMAIL,
            first_name: 'Test User'
        }
    },
    {
        name: 'Premium Global 12-month Multi-device Subscription',
        data: {
            subscriptionLength: '12',
            region: 'global',
            customer_id: `test_${Date.now()}`,
            device_types: ['smart_tv', 'ios', 'android_phone'],
            user_email: TEST_EMAIL,
            first_name: 'Premium User'
        }
    },
    // Add more test scenarios as needed
];

// Run tests
async function runTests() {
    console.log('🔍 Starting Stripe Integration Tests\n');

    for (const scenario of testScenarios) {
        console.log(`Testing: ${scenario.name}`);

        try {
            const response = await fetch(`${API_ENDPOINT}/create-checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scenario.data)
            });

            const result = await response.json();

            if (response.ok && result.url) {
                console.log(`✅ Success! Checkout URL created: ${result.url.substring(0, 60)}...`);
                console.log(`   Session ID: ${result.session_id}`);
            } else {
                console.log(`❌ Failed: ${JSON.stringify(result)}`);
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }

        console.log('\n-----------------------------------\n');
    }

    console.log('Stripe Integration Tests Complete');
}

runTests();