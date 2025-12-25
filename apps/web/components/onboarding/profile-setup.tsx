'use client';

import { useState } from 'react';
import { Upload, User, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface ProfileSetupProps {
  onNext: () => void;
  onSkip: () => void;
}

export function ProfileSetup({ onNext, onSkip }: ProfileSetupProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    occupation: '',
    monthlyIncome: '',
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Implement avatar upload to Supabase Storage
    toast.info('Avatar upload coming soon');
  };

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
          phone: formData.phone || null,
          occupation: formData.occupation || null,
          monthly_income: formData.monthlyIncome ? parseInt(formData.monthlyIncome) : null,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to update profile');
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
        <h2 className="text-h2 font-heading font-bold text-white">Tell us about yourself</h2>
        <p className="mt-2 text-body text-white/70">
          Help us personalize your experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-white/40" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-electric-blue hover:bg-electric-blue/80 transition-colors">
              <Upload className="h-4 w-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="text-body-sm font-medium text-white mb-2 block">
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input w-full"
            placeholder="+31 6 12345678"
          />
        </div>

        {/* Occupation */}
        <div>
          <label htmlFor="occupation" className="text-body-sm font-medium text-white mb-2 block">
            Occupation (Optional)
          </label>
          <input
            id="occupation"
            type="text"
            value={formData.occupation}
            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
            className="input w-full"
            placeholder="Software Engineer"
          />
        </div>

        {/* Monthly Income */}
        <div>
          <label htmlFor="monthlyIncome" className="text-body-sm font-medium text-white mb-2 block">
            Monthly Income (Optional)
          </label>
          <select
            id="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
            className="input w-full"
          >
            <option value="">Select range</option>
            <option value="1500">€1,500 - €2,500</option>
            <option value="2500">€2,500 - €3,500</option>
            <option value="3500">€3,500 - €5,000</option>
            <option value="5000">€5,000+</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onSkip}
            className="btn-secondary flex-1"
          >
            Skip
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

