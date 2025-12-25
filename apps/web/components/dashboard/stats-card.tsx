'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtext?: string;
  badge?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  subtext,
  badge,
  trend,
  href,
  onClick,
  className,
}: StatsCardProps) {
  const content = (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        'card group cursor-pointer transition-all',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-electric-blue/20 text-electric-blue">
          {icon}
        </div>
        {badge && (
          <span className="rounded-full bg-electric-blue px-2 py-0.5 text-caption text-white">
            {badge}
          </span>
        )}
      </div>

      <div className="mb-2">
        <div className="text-h1 font-heading font-bold text-white mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-body-sm font-medium text-white/60">{title}</div>
      </div>

      {subtext && (
        <p className="text-body-sm text-white/60 mb-2">{subtext}</p>
      )}

      {trend && (
        <div className={cn(
          'text-body-sm font-medium',
          trend.isPositive ? 'text-green-400' : 'text-red-400'
        )}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}
        </div>
      )}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return content;
}

