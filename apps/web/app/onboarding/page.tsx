'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, ArrowLeft, Upload, User, Settings, Search, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileSetup } from '@/components/onboarding/profile-setup';
import { PreferencesSetup } from '@/components/onboarding/preferences-setup';
import { SearchProfileSetup } from '@/components/onboarding/search-profile-setup';
import { SubscriptionSelection } from '@/components/onboarding/subscription-selection';

type OnboardingStep = 'profile' | 'preferences' | 'search' | 'subscription';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('profile');
  const [loading, setLoading] = useState(false);

  const steps: { id: OnboardingStep; title: string; icon: any }[] = [
    { id: 'profile', title: 'Profile Setup', icon: User },
    { id: 'preferences', title: 'Preferences', icon: Settings },
    { id: 'search', title: 'First Search', icon: Search },
    { id: 'subscription', title: 'Subscription', icon: CreditCard },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = async () => {
    if (currentStep === 'subscription') {
      // Final step - redirect to dashboard
      router.push('/dashboard');
      return;
    }

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Progress Bar */}
      <div className="border-b border-white/10 bg-neutral-900">
        <div className="mx-auto max-w-content px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                        isActive
                          ? 'border-electric-blue bg-electric-blue/20 text-electric-blue'
                          : isCompleted
                          ? 'border-green-500 bg-green-500/20 text-green-500'
                          : 'border-white/20 bg-white/5 text-white/40'
                      }`}
                    >
                      {isCompleted ? (
                        <div className="h-5 w-5 rounded-full bg-green-500" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`text-body-sm font-medium hidden md:block ${
                        isActive ? 'text-white' : isCompleted ? 'text-white/60' : 'text-white/40'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-full mx-4 transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-content px-6 py-12">
        {currentStep === 'profile' && (
          <ProfileSetup onNext={handleNext} onSkip={handleNext} />
        )}
        {currentStep === 'preferences' && (
          <PreferencesSetup onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 'search' && (
          <SearchProfileSetup onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 'subscription' && (
          <SubscriptionSelection onNext={handleNext} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}

