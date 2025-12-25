'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { isValidEmail } from '@/lib/utils/validation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email or password is incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email address', {
            action: {
              label: 'Resend',
              onClick: async () => {
                await supabase.auth.resend({
                  type: 'signup',
                  email: formData.email,
                });
                toast.success('Verification email sent!');
              },
            },
          });
        } else if (error.message.includes('too many requests')) {
          toast.error('Too many attempts. Please try again in a few minutes');
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        toast.success('Welcome back!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-form">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-heading font-bold text-white">
            Uprent Plus
          </Link>
          <h1 className="mt-6 text-h2 font-heading font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-body text-white/70">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-body-sm font-medium text-white mb-2 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="input w-full"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-body-sm font-medium text-white">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-body-sm text-electric-blue hover:text-electric-blue/80"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="input w-full pr-10"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-body-sm text-white/60">
            Don't have an account?{' '}
            <Link href="/register" className="text-electric-blue hover:text-electric-blue/80 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
