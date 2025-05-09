// run-all-tests.js
const { execSync } = require('child_process');

console.log('🚀 Running All Tests\n');

const tests = [
    { name: 'Email Templates', script: 'test-email-templates.js' },
    { name: 'Stripe Integration', script: 'test-stripe-integration.js' },
    { name: 'Activation Panel', script: 'test-activation-panel.js' },
    { name: 'SendGrid Email', script: 'test-sendgrid.js' },
    { name: 'End-to-End', script: 'test-e2e.js' }
];

for (const test of tests) {
    console.log(`\n==== Running ${test.name} Tests ====\n`);

    try {
        execSync(`node scripts/${test.script}`, { stdio: 'inherit' });
        console.log(`\n✅ ${test.name} Tests Completed Successfully\n`);
    } catch (error) {
        console.log(`\n❌ ${test.name} Tests Failed\n`);

        // Continue with next test even if current one failed
        continue;
    }
}

console.log('\n🎉 All Tests Completed!');