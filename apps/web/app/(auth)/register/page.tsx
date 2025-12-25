'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { validatePassword } from '@/lib/utils/password-validation';
import { isValidEmail } from '@/lib/utils/validation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [passwordValidation, setPasswordValidation] = useState<ReturnType<typeof validatePassword> | null>(null);

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordValidation(validatePassword(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!passwordValidation?.isValid) {
      toast.error('Please fix password errors');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      setLoading(false);
      return;
    }

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          toast.error('An account with this email already exists');
        } else {
          toast.error(authError.message);
        }
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Continue anyway - profile can be created later
        }

        toast.success('Account created! Please check your email to verify your account.');
        
        // Redirect to onboarding after a short delay
        setTimeout(() => {
          router.push('/onboarding');
        }, 1500);
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
          <h1 className="mt-6 text-h2 font-heading font-bold text-white">Create your account</h1>
          <p className="mt-2 text-body text-white/70">
            Start finding your perfect rental home
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="text-body-sm font-medium text-white mb-2 block">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="input w-full"
              placeholder="John Doe"
            />
          </div>

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
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="text-body-sm font-medium text-white mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                className="input w-full pr-10"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && passwordValidation && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
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
                      <li key={idx} className="flex items-start gap-2 text-body-sm text-red-400">
                        <span>•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="text-body-sm font-medium text-white mb-2 block">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="input w-full"
              placeholder="Confirm your password"
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="mt-2 text-body-sm text-red-400">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-body-sm text-white/60">
            Already have an account?{' '}
            <Link href="/login" className="text-electric-blue hover:text-electric-blue/80 font-medium">
              Sign in
            </Link>
          </p>
          <p className="text-body-sm text-white/60">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-electric-blue hover:text-electric-blue/80">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-electric-blue hover:text-electric-blue/80">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
