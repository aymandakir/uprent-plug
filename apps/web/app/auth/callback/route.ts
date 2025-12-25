import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();

    try {
      // Exchange code for session
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`);
      }

      if (session?.user) {
        // Check if user profile exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', session.user.id)
          .single();

        // Create profile if it doesn't exist
        if (!existingUser) {
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url || null,
              locale: 'en',
              subscription_tier: 'free',
              subscription_status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Continue anyway - profile can be created later
          }

          // Create default settings (if settings table exists)
          const { error: settingsError } = await supabase
            .from('settings')
            .insert({
              user_id: session.user.id,
              email_notifications: true,
              push_notifications: true,
              sms_notifications: false,
              in_app_notifications: true,
              marketing_emails: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }).select().single();

          if (settingsError) {
            // Settings table might not exist, continue
            console.log('Settings creation skipped (table may not exist):', settingsError.message);
          }
        }
      }

      // Redirect to dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=callback_failed`);
    }
  }

  // No code present, redirect to home
  return NextResponse.redirect(`${requestUrl.origin}/`);
}
