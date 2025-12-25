'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function NotificationPreferencesSection() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    emailNewMatches: true,
    emailApplicationUpdates: true,
    emailMessages: true,
    emailWeeklySummary: true,
    pushNotifications: true,
    pushNewMatches: true,
    pushApplicationUpdates: true,
    pushMessages: true,
    smsNotifications: false,
    smsCriticalOnly: true,
    frequency: 'instant',
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('users')
        .select('email_notifications, push_notifications, sms_notifications')
        .eq('id', user.id)
        .single();

      if (profile) {
        setPreferences({
          ...preferences,
          emailNotifications: profile.email_notifications ?? true,
          pushNotifications: profile.push_notifications ?? true,
          smsNotifications: profile.sms_notifications ?? false,
        });
      }
    } catch (error) {
      console.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          email_notifications: preferences.emailNotifications,
          push_notifications: preferences.pushNotifications,
          sms_notifications: preferences.smsNotifications,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Preferences saved');
    } catch (error: any) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({ enabled, onToggle, disabled }: { enabled: boolean; onToggle: () => void; disabled?: boolean }) => (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        enabled ? 'bg-electric-blue' : 'bg-white/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );

  if (loading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-h2 font-heading font-bold text-white mb-8">Notification Preferences</h2>

      <div className="space-y-8">
        {/* Email Notifications */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-white/60" />
              <div>
                <h3 className="text-h3 font-heading font-semibold text-white">Email Notifications</h3>
                <p className="text-body-sm text-white/60 mt-1">Receive notifications via email</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={preferences.emailNotifications}
              onToggle={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
            />
          </div>

          {preferences.emailNotifications && (
            <div className="space-y-4 ml-8">
              <div className="flex items-center justify-between">
                <span className="text-body text-white">New matches</span>
                <ToggleSwitch
                  enabled={preferences.emailNewMatches}
                  onToggle={() => setPreferences({ ...preferences, emailNewMatches: !preferences.emailNewMatches })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body text-white">Application updates</span>
                <ToggleSwitch
                  enabled={preferences.emailApplicationUpdates}
                  onToggle={() => setPreferences({ ...preferences, emailApplicationUpdates: !preferences.emailApplicationUpdates })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body text-white">Messages</span>
                <ToggleSwitch
                  enabled={preferences.emailMessages}
                  onToggle={() => setPreferences({ ...preferences, emailMessages: !preferences.emailMessages })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body text-white">Weekly summary</span>
                <ToggleSwitch
                  enabled={preferences.emailWeeklySummary}
                  onToggle={() => setPreferences({ ...preferences, emailWeeklySummary: !preferences.emailWeeklySummary })}
                />
              </div>
            </div>
          )}
        </section>

        {/* Push Notifications */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-white/60" />
              <div>
                <h3 className="text-h3 font-heading font-semibold text-white">Push Notifications</h3>
                <p className="text-body-sm text-white/60 mt-1">Receive push notifications on your device</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={preferences.pushNotifications}
              onToggle={() => setPreferences({ ...preferences, pushNotifications: !preferences.pushNotifications })}
            />
          </div>

          {preferences.pushNotifications && (
            <div className="space-y-4 ml-8">
              <div className="flex items-center justify-between">
                <span className="text-body text-white">New matches</span>
                <ToggleSwitch
                  enabled={preferences.pushNewMatches}
                  onToggle={() => setPreferences({ ...preferences, pushNewMatches: !preferences.pushNewMatches })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body text-white">Application updates</span>
                <ToggleSwitch
                  enabled={preferences.pushApplicationUpdates}
                  onToggle={() => setPreferences({ ...preferences, pushApplicationUpdates: !preferences.pushApplicationUpdates })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body text-white">Messages</span>
                <ToggleSwitch
                  enabled={preferences.pushMessages}
                  onToggle={() => setPreferences({ ...preferences, pushMessages: !preferences.pushMessages })}
                />
              </div>
            </div>
          )}
        </section>

        {/* SMS Notifications */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-white/60" />
              <div>
                <h3 className="text-h3 font-heading font-semibold text-white">SMS Notifications</h3>
                <p className="text-body-sm text-white/60 mt-1">Receive SMS notifications (Premium only)</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={preferences.smsNotifications}
              onToggle={() => setPreferences({ ...preferences, smsNotifications: !preferences.smsNotifications })}
            />
          </div>

          {preferences.smsNotifications && (
            <div className="ml-8">
              <div className="flex items-center justify-between">
                <span className="text-body text-white">Critical updates only</span>
                <ToggleSwitch
                  enabled={preferences.smsCriticalOnly}
                  onToggle={() => setPreferences({ ...preferences, smsCriticalOnly: !preferences.smsCriticalOnly })}
                />
              </div>
            </div>
          )}
        </section>

        {/* Frequency */}
        <section className="border-t border-white/10 pt-8">
          <h3 className="text-h3 font-heading font-semibold text-white mb-4">Notification Frequency</h3>
          <div className="space-y-2">
            {[
              { value: 'instant', label: 'Instant - Get notified immediately' },
              { value: 'daily', label: 'Daily Digest - Once per day' },
              { value: 'weekly', label: 'Weekly Summary - Once per week' },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors"
              >
                <input
                  type="radio"
                  name="frequency"
                  value={option.value}
                  checked={preferences.frequency === option.value}
                  onChange={(e) => setPreferences({ ...preferences, frequency: e.target.value })}
                  className="h-4 w-4 text-electric-blue"
                />
                <span className="text-body text-white">{option.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Save Button */}
        <div className="sticky bottom-0 pt-6 border-t border-white/10 bg-neutral-900 -mx-8 -mb-8 px-8 pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full md:w-auto md:ml-auto md:block"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}

