'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface PreferencesSetupProps {
  onNext: () => void;
  onBack: () => void;
}

export function PreferencesSetup({ onNext, onBack }: PreferencesSetupProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    preferredLanguage: 'en',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    emailFrequency: 'instant',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          preferred_language: preferences.preferredLanguage,
          email_notifications: preferences.emailNotifications,
          push_notifications: preferences.pushNotifications,
          sms_notifications: preferences.smsNotifications,
        })
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to save preferences');
        setLoading(false);
        return;
      }

      onNext();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-narrow">
      <div className="mb-8 text-center">
        <h2 className="text-h2 font-heading font-bold text-white">Set your preferences</h2>
        <p className="mt-2 text-body text-white/70">
          Customize how we communicate with you
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Language */}
        <div>
          <label className="text-body-sm font-medium text-white mb-3 block">
            Preferred Language
          </label>
          <select
            value={preferences.preferredLanguage}
            onChange={(e) => setPreferences({ ...preferences, preferredLanguage: e.target.value })}
            className="input w-full"
          >
            <option value="en">English</option>
            <option value="nl">Nederlands</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {/* Email Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="text-body font-medium text-white">Email Notifications</label>
              <p className="text-body-sm text-white/60 mt-1">Receive notifications via email</p>
            </div>
            <button
              type="button"
              onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                preferences.emailNotifications ? 'bg-electric-blue' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  preferences.emailNotifications ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="text-body font-medium text-white">Push Notifications</label>
              <p className="text-body-sm text-white/60 mt-1">Receive push notifications on your device</p>
            </div>
            <button
              type="button"
              onClick={() => setPreferences({ ...preferences, pushNotifications: !preferences.pushNotifications })}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                preferences.pushNotifications ? 'bg-electric-blue' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  preferences.pushNotifications ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="text-body font-medium text-white">SMS Notifications</label>
              <p className="text-body-sm text-white/60 mt-1">Receive SMS notifications (Premium only)</p>
            </div>
            <button
              type="button"
              onClick={() => setPreferences({ ...preferences, smsNotifications: !preferences.smsNotifications })}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                preferences.smsNotifications ? 'bg-electric-blue' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  preferences.smsNotifications ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Email Frequency */}
        <div>
          <label className="text-body-sm font-medium text-white mb-3 block">
            Email Frequency
          </label>
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
                  name="emailFrequency"
                  value={option.value}
                  checked={preferences.emailFrequency === option.value}
                  onChange={(e) => setPreferences({ ...preferences, emailFrequency: e.target.value })}
                  className="h-4 w-4 text-electric-blue"
                />
                <span className="text-body text-white">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

