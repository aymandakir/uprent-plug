'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: number | string;
}

export function FilterSection({ title, children, defaultOpen = true, badge }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-body font-semibold text-white">{title}</h3>
          {badge && (
            <span className="rounded-full bg-electric-blue px-2 py-0.5 text-caption text-white">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-white/60" />
        ) : (
          <ChevronDown className="h-5 w-5 text-white/60" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

