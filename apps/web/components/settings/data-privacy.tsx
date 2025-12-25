'use client';

import { useState } from 'react';
import { Database, Download, Trash2, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function DataPrivacySection() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDownloadData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        setLoading(false);
        return;
      }

      // Get all user data
      const [profile, searchProfiles, applications, savedProperties] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('search_profiles').select('*').eq('user_id', user.id),
        supabase.from('applications').select('*').eq('user_id', user.id),
        supabase.from('saved_properties').select('*').eq('user_id', user.id),
      ]);

      const dataExport = {
        profile: profile.data,
        search_profiles: searchProfiles.data,
        applications: applications.data,
        saved_properties: savedProperties.data,
        exported_at: new Date().toISOString(),
      };

      // Create downloadable JSON file
      const blob = new Blob([JSON.stringify(dataExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uprent-plus-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data export started');
    } catch (error: any) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = prompt(
      'This action cannot be undone. Type "DELETE" to confirm account deletion:'
    );

    if (confirmed !== 'DELETE') {
      return;
    }

    setDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        setDeleting(false);
        return;
      }

      // Delete user account (this will cascade delete related data via RLS)
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) {
        // Fallback: Delete via API route if admin access not available
        const response = await fetch('/api/auth/delete-account', {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete account');
        }
      }

      toast.success('Account deleted successfully');
      window.location.href = '/';
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-h2 font-heading font-bold text-white mb-8">Data & Privacy</h2>

      <div className="space-y-8">
        {/* Download Data */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-white/60" />
              <div>
                <h3 className="text-h3 font-heading font-semibold text-white">Download My Data</h3>
                <p className="text-body-sm text-white/60 mt-1">Export all your data in JSON format (GDPR compliant)</p>
              </div>
            </div>
            <button
              onClick={handleDownloadData}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {loading ? 'Exporting...' : 'Download'}
            </button>
          </div>
        </section>

        {/* Privacy Settings */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-white/60" />
            <div>
              <h3 className="text-h3 font-heading font-semibold text-white">Privacy Settings</h3>
              <p className="text-body-sm text-white/60 mt-1">Control how your data is used</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-body font-medium text-white">Analytics & Tracking</p>
                <p className="text-body-sm text-white/60 mt-1">Help us improve by sharing anonymous usage data</p>
              </div>
              <button
                type="button"
                className={`relative h-6 w-11 rounded-full transition-colors bg-white/20`}
              >
                <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white" />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-body font-medium text-white">Marketing Emails</p>
                <p className="text-body-sm text-white/60 mt-1">Receive tips, updates, and promotional content</p>
              </div>
              <button
                type="button"
                className={`relative h-6 w-11 rounded-full transition-colors bg-white/20`}
              >
                <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white" />
              </button>
            </div>
          </div>
        </section>

        {/* Cookie Preferences */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-white/60" />
            <h3 className="text-h3 font-heading font-semibold text-white">Cookie Preferences</h3>
          </div>
          <p className="text-body text-white/60 mb-4">
            We use cookies to enhance your experience. You can manage your cookie preferences below.
          </p>
          <button className="btn-secondary">
            Manage Cookies
          </button>
        </section>

        {/* Delete Account */}
        <section className="border-t border-red-500/20 pt-8">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="h-5 w-5 text-red-400" />
            <div>
              <h3 className="text-h3 font-heading font-semibold text-red-400">Delete Account</h3>
              <p className="text-body-sm text-white/60 mt-1">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-body font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete My Account'}
          </button>
        </section>
      </div>
    </div>
  );
}

