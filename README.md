# StreamVault: IPTV Subscription Management System

StreamVault is a Cloudflare Worker-based system for managing IPTV subscriptions. It provides a complete API for handling customer subscriptions, payments through Stripe, and automated setup instructions for various devices.

## 🚀 Features

- **Payment Processing**: Integrated with Stripe for secure subscription payments
- **Multi-Device Support**: Setup instructions for Smart TVs, Fire Sticks, Android Boxes, iOS, Android phones, MAG boxes, and web browsers
- **Automated Emails**: Sends device-specific setup instructions to subscribers
- **Subscription Management**: Create, renew, and check status of subscriptions
- **Region-Based Content**: Support for different content packages by region

## 🛠️ Technologies Used

- **Cloudflare Workers**: Serverless execution environment
- **TypeScript**: Type-safe JavaScript code
- **Stripe API**: Payment processing
- **SendGrid**: Email delivery
- **KV Storage**: For persisting subscription data

## 📁 Project Structure

```
streamvault/
├── src/
│   ├── index.ts            # Main entry point
│   ├── types.ts            # Type definitions
│   ├── config.ts           # Configuration constants
│   └── utils/
│       ├── helpers.ts      # Helper functions
│       └── email.ts        # Email templating
├── handlers/
│   ├── checkout.ts         # Stripe checkout session creation
│   ├── activation.ts       # Subscription activation
│   ├── status.ts           # Status checking
│   ├── instructions.ts     # Device instructions retrieval
│   ├── webhooks.ts         # Stripe webhook processing
│   └── cors.ts             # CORS handling
├── package.json
├── tsconfig.json
└── wrangler.toml
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/create-checkout` | POST | Creates a Stripe checkout session for subscription purchase |
| `/activate` | GET | Activates a subscription after payment |
| `/check-status` | GET | Checks the status of a subscription |
| `/device-instructions` | GET | Returns setup instructions for specific devices |
| `/webhook` | POST | Handles Stripe webhook events |
| `/health-check` | GET | Simple endpoint to check if the service is running |

## 🚀 Deployment

This project is deployed as a Cloudflare Worker. The deployment URL is:
```
https://streamvault.yousef-az.workers.dev
```

## 🔧 Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/streamvault.git
cd streamvault
```

2. Install dependencies:
```bash
npm install
```

3. Create a KV namespace:
```bash
npx wrangler kv:namespace create "KV"
npx wrangler kv:namespace create "KV" --preview
```

4. Update your wrangler.toml with the KV namespace IDs.

5. Add your secrets:
```bash
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put ACTIVATION_PANEL_KEY
npx wrangler secret put SENDGRID_API_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

6. Start the development server:
```bash
npm run dev
```

7. Deploy to Cloudflare:
```bash
npm run deploy
```

## 📧 Email Templates

The system sends customized emails for different devices with:
- User credentials (username, password)
- M3U URL with a QR code for easy scanning
- Device-specific setup instructions
- Important notices and tips

## 🔒 Security Features

- Secure token generation for checkout validation
- Encrypted storage of user credentials
- Webhook signature verification for Stripe events
- No exposure of sensitive data in responses

## 📝 License

NA

## 👥 Contact

NA
