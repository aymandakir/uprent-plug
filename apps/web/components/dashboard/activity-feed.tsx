'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, FileText, TrendingDown, MessageCircle, Bell, X, CheckCircle } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export interface ActivityItem {
  id: string;
  type: 'match' | 'application_update' | 'price_drop' | 'message' | 'system';
  title: string;
  subtitle?: string;
  timestamp: string;
  thumbnail?: string;
  badge?: string;
  metadata?: Record<string, any>;
  actions?: {
    label: string;
    href?: string;
    onClick?: () => void;
  }[];
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  onDismiss?: (id: string) => void;
  className?: string;
}

const ACTIVITY_ICONS = {
  match: Star,
  application_update: FileText,
  price_drop: TrendingDown,
  message: MessageCircle,
  system: Bell,
};

const ACTIVITY_COLORS = {
  match: 'bg-blue-500',
  application_update: 'bg-green-500',
  price_drop: 'bg-green-500',
  message: 'bg-purple-500',
  system: 'bg-gray-500',
};

export function ActivityFeed({ activities, onDismiss, className }: ActivityFeedProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setDismissedIds(new Set([...dismissedIds, id]));
    onDismiss?.(id);
  };

  const visibleActivities = activities.filter((a) => !dismissedIds.has(a.id));

  if (visibleActivities.length === 0) {
    return (
      <div className={cn('card', className)}>
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <p className="text-body text-white/60">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('card', className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-h2 font-heading font-bold text-white">Recent Activity</h2>
        <Link href="/dashboard/activity" className="text-body-sm text-electric-blue hover:text-electric-blue/80">
          View all
        </Link>
      </div>

      <div className="space-y-0">
        {visibleActivities.map((activity, index) => {
          const Icon = ACTIVITY_ICONS[activity.type];
          const iconColor = ACTIVITY_COLORS[activity.type];

          return (
            <div
              key={activity.id}
              className={cn(
                'flex items-start gap-4 p-4 transition-colors hover:bg-white/5',
                index < visibleActivities.length - 1 && 'border-b border-white/10'
              )}
            >
              {/* Icon */}
              <div className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                iconColor
              )}>
                <Icon className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-body font-medium text-white mb-1">{activity.title}</p>
                    {activity.subtitle && (
                      <p className="text-body-sm text-white/60">{activity.subtitle}</p>
                    )}
                    {activity.badge && (
                      <span className="inline-block mt-2 rounded-full bg-electric-blue/20 px-2 py-0.5 text-caption text-electric-blue">
                        {activity.badge}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail */}
                  {activity.thumbnail && (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                      <img src={activity.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                {activity.actions && activity.actions.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    {activity.actions.map((action, actionIdx) => (
                      action.href ? (
                        <Link
                          key={actionIdx}
                          href={action.href}
                          className="text-body-sm text-electric-blue hover:text-electric-blue/80"
                        >
                          {action.label}
                        </Link>
                      ) : (
                        <button
                          key={actionIdx}
                          onClick={action.onClick}
                          className="text-body-sm text-electric-blue hover:text-electric-blue/80"
                        >
                          {action.label}
                        </button>
                      )
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp & Dismiss */}
              <div className="flex-shrink-0 flex items-start gap-2">
                <span className="text-body-sm text-white/40 whitespace-nowrap">
                  {formatRelativeTime(activity.timestamp)}
                </span>
                {onDismiss && (
                  <button
                    onClick={() => handleDismiss(activity.id)}
                    className="p-1 rounded hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4 text-white/40" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {visibleActivities.length >= 10 && (
        <div className="mt-6 text-center">
          <Link href="/dashboard/activity" className="btn-secondary">
            Load more
          </Link>
        </div>
      )}
    </div>
  );
}

