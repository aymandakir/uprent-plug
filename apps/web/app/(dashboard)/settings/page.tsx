'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  Shield, 
  Bell, 
  Search, 
  CreditCard, 
  Database,
  Settings as SettingsIcon 
} from 'lucide-react';
import { PersonalInformationSection } from '@/components/settings/personal-information';
import { AccountSecuritySection } from '@/components/settings/account-security';
import { NotificationPreferencesSection } from '@/components/settings/notification-preferences';
import { SearchPreferencesSection } from '@/components/settings/search-preferences';
import { SubscriptionSection } from '@/components/settings/subscription';
import { DataPrivacySection } from '@/components/settings/data-privacy';
import { cn } from '@/lib/utils/cn';

const SETTINGS_SECTIONS = [
  { id: 'personal', label: 'Personal Information', icon: User, component: PersonalInformationSection },
  { id: 'security', label: 'Account Security', icon: Shield, component: AccountSecuritySection },
  { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationPreferencesSection },
  { id: 'search', label: 'Search Preferences', icon: Search, component: SearchPreferencesSection },
  { id: 'subscription', label: 'Subscription & Billing', icon: CreditCard, component: SubscriptionSection },
  { id: 'privacy', label: 'Data & Privacy', icon: Database, component: DataPrivacySection },
];

export default function SettingsPage() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('personal');

  const ActiveComponent = SETTINGS_SECTIONS.find((s) => s.id === activeSection)?.component || PersonalInformationSection;

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-content px-6 py-8">
        <div className="mb-8">
          <h1 className="text-h1 font-heading font-bold text-white">Settings</h1>
          <p className="mt-2 text-body text-white/70">Manage your account settings and preferences</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <nav className="space-y-1">
              {SETTINGS_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-body-sm font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Mobile Tabs */}
          <div className="md:hidden w-full mb-6">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="input w-full"
            >
              {SETTINGS_SECTIONS.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <main className="flex-1">
            <div className="card">
              <ActiveComponent />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

