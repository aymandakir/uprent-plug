'use client';

import { useState, useEffect } from 'react';
import { Upload, User, Mail, Phone, Calendar, Globe, Briefcase, Building, Euro } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { isValidEmail, isValidPhone } from '@/lib/utils/validation';

export function PersonalInformationSection() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    nationality: '',
    bio: '',
    occupation: '',
    company: '',
    monthly_income: '',
    avatar_url: '',
  });
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          email: user.email || '',
          phone: profile.phone || '',
          date_of_birth: profile.date_of_birth || '',
          nationality: profile.nationality || '',
          bio: profile.bio || '',
          occupation: profile.occupation || '',
          company: profile.company || '',
          monthly_income: profile.monthly_income?.toString() || '',
          avatar_url: profile.avatar_url || '',
        });
        setEmailVerified(user.email_confirmed_at !== null);
      }
    } catch (error: any) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Implement avatar upload to Supabase Storage
    toast.info('Avatar upload coming soon');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        setSaving(false);
        return;
      }

      // Validate
      if (formData.phone && !isValidPhone(formData.phone)) {
        toast.error('Please enter a valid phone number');
        setSaving(false);
        return;
      }

      if (formData.bio && formData.bio.length > 500) {
        toast.error('Bio must be 500 characters or less');
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name || null,
          phone: formData.phone || null,
          date_of_birth: formData.date_of_birth || null,
          nationality: formData.nationality || null,
          bio: formData.bio || null,
          occupation: formData.occupation || null,
          company: formData.company || null,
          monthly_income: formData.monthly_income ? parseInt(formData.monthly_income) : null,
          avatar_url: formData.avatar_url || null,
        })
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to update profile');
        setSaving(false);
        return;
      }

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-h2 font-heading font-bold text-white mb-8">Personal Information</h2>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar */}
        <div>
          <label className="text-body-sm font-medium text-white mb-3 block">Profile Picture</label>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
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
            <div>
              <p className="text-body-sm text-white/70">Upload a profile picture</p>
              <p className="text-caption text-white/50">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="text-body-sm font-medium text-white mb-2 block">
            Full Name
          </label>
          <input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="input w-full"
            placeholder="John Doe"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label htmlFor="email" className="text-body-sm font-medium text-white mb-2 block flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
            {emailVerified && (
              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-caption text-green-500">
                Verified
              </span>
            )}
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            disabled
            className="input w-full bg-white/5 opacity-60 cursor-not-allowed"
          />
          {!emailVerified && (
            <p className="mt-2 text-body-sm text-yellow-400">Please verify your email address</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="text-body-sm font-medium text-white mb-2 block flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
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

        {/* Date of Birth */}
        <div>
          <label htmlFor="date_of_birth" className="text-body-sm font-medium text-white mb-2 block flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date of Birth
          </label>
          <input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
            className="input w-full"
          />
        </div>

        {/* Nationality */}
        <div>
          <label htmlFor="nationality" className="text-body-sm font-medium text-white mb-2 block flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Nationality
          </label>
          <input
            id="nationality"
            type="text"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            className="input w-full"
            placeholder="Dutch"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="text-body-sm font-medium text-white mb-2 block">
            Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            maxLength={500}
            rows={4}
            className="input w-full resize-none"
            placeholder="Tell us about yourself..."
          />
          <p className="mt-2 text-body-sm text-white/60">
            {formData.bio.length}/500 characters
          </p>
        </div>

        {/* Occupation */}
        <div>
          <label htmlFor="occupation" className="text-body-sm font-medium text-white mb-2 block flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Occupation
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

        {/* Company */}
        <div>
          <label htmlFor="company" className="text-body-sm font-medium text-white mb-2 block flex items-center gap-2">
            <Building className="h-4 w-4" />
            Company
          </label>
          <input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="input w-full"
            placeholder="Company Name"
          />
        </div>

        {/* Monthly Income */}
        <div>
          <label htmlFor="monthly_income" className="text-body-sm font-medium text-white mb-2 block flex items-center gap-2">
            <Euro className="h-4 w-4" />
            Monthly Income
          </label>
          <input
            id="monthly_income"
            type="number"
            value={formData.monthly_income}
            onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
            min="0"
            step="100"
            className="input w-full"
            placeholder="3000"
          />
          <p className="mt-2 text-body-sm text-white/60">Used to match you with suitable properties</p>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-0 pt-6 border-t border-white/10 bg-neutral-900 -mx-8 -mb-8 px-8 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full md:w-auto md:ml-auto md:block"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

