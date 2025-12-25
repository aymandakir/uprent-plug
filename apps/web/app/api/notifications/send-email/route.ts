import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Dynamic import Resend to avoid build-time errors if package not installed
async function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  try {
    const { Resend } = await import('resend');
    return new Resend(process.env.RESEND_API_KEY);
  } catch (error) {
    console.warn('Resend package not installed');
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, type, title, message, linkUrl } = await req.json();

    // Get user email
    const { data: userProfile } = await supabase
      .from('users')
      .select('email, preferred_language')
      .eq('id', userId)
      .single();

    if (!userProfile?.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    // Check user email notification preferences
    const { data: userPrefs } = await supabase
      .from('users')
      .select('email_notifications')
      .eq('id', userId)
      .single();

    if (userPrefs?.email_notifications === false) {
      return NextResponse.json({ message: 'Email notifications disabled' }, { status: 200 });
    }

    // Generate email HTML
    const emailHtml = generateEmailTemplate({
      title,
      message,
      linkUrl,
      linkLabel: 'View Details',
    });

    // Send email
    const resend = await getResend();
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Uprent Plus <notifications@uprent.nl>',
      to: userProfile.email,
      subject: title,
      html: emailHtml,
      text: `${title}\n\n${message}${linkUrl ? `\n\n${linkUrl}` : ''}`,
    });

    if (error) {
      throw error;
    }

    // Update notification as delivered
    await supabase
      .from('notifications')
      .update({ delivered: true, delivered_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('type', type)
      .eq('channel', 'email')
      .eq('delivered', false)
      .order('created_at', { ascending: false })
      .limit(1);

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error: any) {
    console.error('Email notification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

function generateEmailTemplate({
  title,
  message,
  linkUrl,
  linkLabel,
}: {
  title: string;
  message: string;
  linkUrl?: string;
  linkLabel?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700;">Uprent Plus</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 20px; font-weight: 600;">${title}</h2>
              <p style="margin: 0 0 30px 0; color: rgba(255,255,255,0.7); font-size: 16px; line-height: 1.6;">${message}</p>
              
              ${linkUrl ? `
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${linkUrl}" style="display: inline-block; padding: 12px 24px; background-color: #FFFFFF; color: #000000; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px;">${linkLabel || 'View Details'}</a>
                  </td>
                </tr>
              </table>
              ` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0A0A0A; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
              <p style="margin: 0 0 10px 0; color: rgba(255,255,255,0.6); font-size: 12px;">
                © 2025 Uprent Plus. All rights reserved.
              </p>
              <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 12px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/notifications" style="color: rgba(255,255,255,0.7); text-decoration: underline;">Manage notification preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

