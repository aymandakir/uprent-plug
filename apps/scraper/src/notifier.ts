import { supabase } from './lib/supabase';

let resend: any = null;

// Dynamically import Resend only if API key is available
async function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    const { Resend } = await import('resend');
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendNotifications(matchId: string) {
  console.log(`[Notifier] Sending notifications for match ${matchId}`);

  // Get match with property and user details
  const { data: match, error } = await supabase
    .from('property_matches')
    .select(`
      *,
      property:properties(*),
      user:profiles(*)
    `)
    .eq('id', matchId)
    .single();

  if (error || !match) {
    console.error('[Notifier] Match not found:', error);
    return;
  }

  // Get notification targets for this user
  const { data: targets } = await supabase
    .from('notification_targets')
    .select('*')
    .eq('user_id', match.user_id)
    .eq('is_active', true);

  if (!targets || targets.length === 0) {
    // Default to user email
    await sendEmail(match.user.email, match.property);
    await logNotification(match.user_id, matchId, 'email', match.user.email, 'sent');
    return;
  }

  // Send to each target
  for (const target of targets) {
    try {
      if (target.channel === 'email') {
        await sendEmail(target.target, match.property);
        await logNotification(match.user_id, matchId, 'email', target.target, 'sent');
      }
      // Add push, SMS, telegram later
    } catch (err: any) {
      console.error(`[Notifier] Failed to send to ${target.target}:`, err);
      await logNotification(match.user_id, matchId, target.channel, target.target, 'failed', err.message);
    }
  }
}

async function sendEmail(to: string, property: any) {
  const resendClient = await getResend();
  
  if (!resendClient) {
    console.log(`[Notifier] Would send email to ${to} (RESEND_API_KEY not set)`);
    return;
  }

  await resendClient.emails.send({
    from: 'RentFusion <alerts@rentfusion.com>',
    to,
    subject: `🏠 New Match: ${property.title}`,
    html: `
      <h2>New Property Match!</h2>
      <h3>${property.title}</h3>
      <p><strong>Price:</strong> €${property.price}/month</p>
      <p><strong>City:</strong> ${property.city}</p>
      <p><a href="${property.url}">View Property →</a></p>
      <p><a href="${process.env.APP_URL || 'https://your-app.vercel.app'}/dashboard/matches">View in Dashboard →</a></p>
    `,
  });
}

async function logNotification(
  userId: string,
  matchId: string,
  channel: string,
  target: string,
  status: 'sent' | 'failed',
  error?: string
) {
  await supabase.from('notifications_sent').insert({
    user_id: userId,
    property_match_id: matchId,
    channel,
    target,
    status,
    error,
  });
}
