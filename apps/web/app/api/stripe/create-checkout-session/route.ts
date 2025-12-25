import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { supabaseAdmin } from '@uprent-plus/database';

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId } = await req.json();

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: 'Missing priceId or userId' },
        { status: 400 }
      );
    }

    // Get user from database
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    type UserData = { email: string; stripe_customer_id: string | null };
    const userData = user as UserData;
    let customerId = userData.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          userId,
        },
      });

      customerId = customer.id;

      // Save customer ID to database
      await (supabaseAdmin as any)
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card', 'ideal', 'paypal'], // Dutch payment methods
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

