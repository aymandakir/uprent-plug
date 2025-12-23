import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config';
import { supabaseAdmin } from '@rentfusion/database';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  console.log('[Stripe Webhook]', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  console.log(`[Webhook] Checkout completed for user ${userId}`);

    // Update user subscription status
    await (supabaseAdmin as any)
      .from('users')
      .update({
        stripe_customer_id: session.customer as string,
      })
      .eq('id', userId);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  let targetUserId = userId;

  if (!targetUserId) {
    // Fallback: find user by customer ID
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('stripe_customer_id', subscription.customer as string)
      .single();

    if (!user) return;
    type UserData = { id: string };
    targetUserId = (user as UserData).id;
  }

  // Determine tier from price ID
  const priceId = subscription.items.data[0]?.price.id;
  let tier: 'free' | 'basic' | 'premium' = 'free';

  if (priceId === STRIPE_CONFIG.prices.basic.monthly || priceId === STRIPE_CONFIG.prices.basic.yearly) {
    tier = 'basic';
  } else if (priceId === STRIPE_CONFIG.prices.premium.monthly || priceId === STRIPE_CONFIG.prices.premium.yearly) {
    tier = 'premium';
  }

  console.log(`[Webhook] Subscription updated: ${targetUserId} → ${tier}`);

    // Update user in database
    const periodEnd = (subscription as any).current_period_end;
    await (supabaseAdmin as any)
      .from('users')
      .update({
        subscription_tier: tier,
        subscription_ends_at: periodEnd 
          ? new Date(periodEnd * 1000).toISOString()
          : null,
      })
      .eq('id', targetUserId);
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('stripe_customer_id', subscription.customer as string)
    .single();

  type UserData = { id: string };
  const targetUserId = userId || (user as UserData | null)?.id;
  if (!targetUserId) return;

  console.log(`[Webhook] Subscription canceled: ${targetUserId}`);

    // Downgrade to free tier
    await (supabaseAdmin as any)
      .from('users')
      .update({
        subscription_tier: 'free',
        subscription_ends_at: null,
      })
      .eq('id', targetUserId);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`[Webhook] Payment succeeded: ${invoice.customer}`);
  // Optional: Send receipt email
}

  async function handlePaymentFailed(invoice: Stripe.Invoice) {
    console.log(`[Webhook] Payment failed: ${invoice.customer}`);
    // Send payment failure notification
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('stripe_customer_id', invoice.customer as string)
      .single();

    if (user) {
      type UserData = { email: string };
      // TODO: Send email via Resend
      console.log(`Send payment failure email to ${(user as UserData).email}`);
    }
  }

export const runtime = 'nodejs';

