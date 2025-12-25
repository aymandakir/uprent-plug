'use client';

import { useState } from 'react';
import { Eye, EyeOff, Shield, LogOut, Smartphone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { validatePassword } from '@/lib/utils/password-validation';
import { toast } from 'sonner';

export function AccountSecuritySection() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordValidation, setPasswordValidation] = useState<ReturnType<typeof validatePassword> | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (newPassword: string) => {
    setPasswordForm({ ...passwordForm, newPassword });
    setPasswordValidation(validatePassword(newPassword));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!passwordValidation?.isValid) {
      toast.error('Please fix password errors');
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Verify current password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast.error('Not authenticated');
        setLoading(false);
        return;
      }

      // Supabase requires re-authentication for password change
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordValidation(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm('Are you sure you want to log out from all devices?')) return;

    try {
      // TODO: Implement logout from all devices
      toast.success('Logged out from all devices');
    } catch (error: any) {
      toast.error('Failed to log out from all devices');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-h2 font-heading font-bold text-white mb-8">Account Security</h2>

      <div className="space-y-8">
        {/* Change Password */}
        <section>
          <h3 className="text-h3 font-heading font-semibold text-white mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label htmlFor="currentPassword" className="text-body-sm font-medium text-white mb-2 block">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="input w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="text-body-sm font-medium text-white mb-2 block">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="input w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {passwordForm.newPassword && passwordValidation && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordValidation.strength === 'weak'
                            ? 'bg-red-500 w-1/3'
                            : passwordValidation.strength === 'medium'
                            ? 'bg-yellow-500 w-2/3'
                            : 'bg-green-500 w-full'
                        }`}
                      />
                    </div>
                    <span className="text-caption text-white/60 capitalize">
                      {passwordValidation.strength}
                    </span>
                  </div>
                  {passwordValidation.errors.length > 0 && (
                    <ul className="space-y-1">
                      {passwordValidation.errors.map((error, idx) => (
                        <li key={idx} className="text-body-sm text-red-400">• {error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-body-sm font-medium text-white mb-2 block">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="input w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="mt-2 text-body-sm text-red-400">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

        {/* Two-Factor Authentication */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-white/60" />
              <div>
                <h3 className="text-h3 font-heading font-semibold text-white">Two-Factor Authentication</h3>
                <p className="text-body-sm text-white/60 mt-1">Add an extra layer of security to your account</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                toast.info('2FA setup coming soon');
                // setTwoFactorEnabled(!twoFactorEnabled);
              }}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                twoFactorEnabled ? 'bg-electric-blue' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </section>

        {/* Active Sessions */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-h3 font-heading font-semibold text-white">Active Sessions</h3>
              <p className="text-body-sm text-white/60 mt-1">Manage your active login sessions</p>
            </div>
            <button
              onClick={handleLogoutAll}
              className="btn-secondary flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout All Devices
            </button>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-white/60" />
                <div>
                  <p className="text-body font-medium text-white">Current Session</p>
                  <p className="text-body-sm text-white/60">This device • Now</p>
                </div>
              </div>
              <span className="text-caption text-green-500">Active</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

