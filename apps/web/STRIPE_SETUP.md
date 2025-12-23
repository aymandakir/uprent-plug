# Stripe Subscription Setup Guide

This guide will help you set up Stripe subscriptions for RentFusion.

## Prerequisites

1. Stripe account (sign up at https://stripe.com)
2. Stripe CLI installed (for local webhook testing)

## Step 1: Create Products and Prices in Stripe Dashboard

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Create two products:

### Basic Plan
- **Name:** Basic
- **Price:** €14.99/month (recurring)
- **Copy the Price ID** (starts with `price_...`)

### Premium Plan
- **Name:** Premium
- **Price:** €24.99/month (recurring)
- **Copy the Price ID** (starts with `price_...`)

### Optional: Yearly Plans
Create yearly prices with 20% discount (€143.90/year for Basic, €239.90/year for Premium)

## Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Price IDs (from Step 1)
NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx

# Optional: Yearly prices
NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_xxx

# Webhook Secret (see Step 3)
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Set Up Webhooks

### For Production:

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_...`) and add to `.env.local`

### For Local Development:

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe` (Mac) or see [Stripe CLI docs](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the webhook signing secret from the output and add to `.env.local`

## Step 4: Update Pricing Page with User ID

The pricing page currently has a placeholder for user ID. Once you implement authentication:

1. Update `apps/web/app/(marketing)/pricing/page.tsx`
2. Replace `'YOUR_USER_ID'` with actual user ID from your auth context
3. Example:
   ```typescript
   const { user } = useAuth(); // Your auth hook
   const userId = user?.id;
   ```

## Step 5: Test the Integration

### Test Checkout Flow:

1. Start your dev server: `pnpm dev`
2. Visit `/pricing`
3. Click "Get Started" on Basic or Premium plan
4. Use Stripe test card: `4242 4242 4242 4242`
5. Use any future expiry date (e.g., `12/34`)
6. Use any 3-digit CVC
7. Complete checkout

### Verify:

1. Check Stripe Dashboard > Customers (should see new customer)
2. Check Stripe Dashboard > Subscriptions (should see active subscription)
3. Check Supabase `users` table:
   - `stripe_customer_id` should be populated
   - `subscription_tier` should be updated to `basic` or `premium`
   - `subscription_ends_at` should be set

### Test Webhook:

1. Check terminal/console for webhook logs: `[Stripe Webhook] checkout.session.completed`
2. Verify user was updated in database

## Step 6: Test Subscription Management

1. Visit `/dashboard` (once auth is implemented)
2. Click "Manage Subscription" in the subscription card
3. Should redirect to Stripe Customer Portal
4. Test:
   - Upgrading plan
   - Downgrading plan
   - Canceling subscription
   - Updating payment method

## Security Notes

- **Never commit** `.env.local` to git
- Use **test keys** for development
- Switch to **live keys** only in production
- Webhook signature verification is already implemented
- Consider adding rate limiting to API routes in production

## GDPR Compliance

- Stripe handles PCI DSS compliance automatically
- Customer data is stored securely in Stripe
- Billing address collection is enabled (required for EU)
- Customer portal allows users to manage their data
- Webhook events are logged for audit trail

## Troubleshooting

### Webhook not received?
- Check webhook endpoint URL is correct
- Verify webhook secret matches
- Check Stripe Dashboard > Webhooks for error logs
- For local: Ensure `stripe listen` is running

### User not updated after checkout?
- Check webhook logs in console
- Verify webhook secret is correct
- Check Supabase RLS policies allow updates
- Verify `userId` is passed in checkout session metadata

### Payment failed?
- Check Stripe Dashboard > Payments for error details
- Verify test card numbers are correct
- Check payment method types are enabled in Stripe Dashboard

## Next Steps

1. Implement authentication system
2. Add subscription limits enforcement (search profiles, AI letters)
3. Add email notifications for subscription events
4. Add analytics tracking for subscription conversions
5. Set up subscription dunning (retry failed payments)

