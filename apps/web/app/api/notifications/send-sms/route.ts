import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Note: Twilio integration would go here
// For now, this is a placeholder

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, message, linkUrl } = await req.json();

    // Check if user has Premium subscription
    const { data: userProfile } = await supabase
      .from('users')
      .select('subscription_tier, sms_notifications, phone')
      .eq('id', userId)
      .single();

    if (userProfile?.subscription_tier !== 'premium') {
      return NextResponse.json(
        { error: 'SMS notifications are a Premium feature' },
        { status: 403 }
      );
    }

    if (userProfile?.sms_notifications === false) {
      return NextResponse.json({ message: 'SMS notifications disabled' }, { status: 200 });
    }

    if (!userProfile?.phone) {
      return NextResponse.json({ error: 'Phone number not found' }, { status: 404 });
    }

    // TODO: Integrate with Twilio
    // const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // 
    // const smsMessage = linkUrl 
    //   ? `${message} ${linkUrl}`
    //   : message;
    //
    // const result = await twilio.messages.create({
    //   body: smsMessage.substring(0, 160), // Truncate to 160 chars
    //   to: userProfile.phone,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    // });

    // For now, just log
    console.log('SMS notification (not sent - Twilio not configured):', {
      to: userProfile.phone,
      message: message.substring(0, 160),
    });

    // Update notification as delivered
    await supabase
      .from('notifications')
      .update({ delivered: true, delivered_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('channel', 'sms')
      .eq('delivered', false)
      .order('created_at', { ascending: false })
      .limit(1);

    return NextResponse.json({ success: true, message: 'SMS queued' });
  } catch (error: any) {
    console.error('SMS notification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send SMS' },
      { status: 500 }
    );
  }
}

