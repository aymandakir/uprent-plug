'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { isValidEmail } from '@/lib/utils/validation';
import { ArrowRight, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      setEmailSent(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
        <div className="w-full max-w-form text-center">
          <div className="mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-electric-blue/20">
              <Mail className="h-8 w-8 text-electric-blue" />
            </div>
            <h1 className="text-h2 font-heading font-bold text-white">Check your email</h1>
            <p className="mt-2 text-body text-white/70">
              We've sent password reset instructions to <strong className="text-white">{email}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-body-sm text-white/60">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Link href="/login" className="btn-primary inline-flex items-center gap-2">
              Back to Sign In
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-form">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-heading font-bold text-white">
            Uprent Plus
          </Link>
          <h1 className="mt-6 text-h2 font-heading font-bold text-white">Reset your password</h1>
          <p className="mt-2 text-body text-white/70">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-body-sm font-medium text-white mb-2 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input w-full"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-body-sm text-electric-blue hover:text-electric-blue/80">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

