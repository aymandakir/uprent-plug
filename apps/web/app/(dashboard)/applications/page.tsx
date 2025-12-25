'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Clock, Minus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate, formatRelativeTime } from '@/lib/utils/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

type ApplicationStatus = 'draft' | 'submitted' | 'viewed' | 'accepted' | 'rejected' | 'withdrawn';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; icon: any }> = {
  draft: { label: 'Draft', color: 'bg-gray-500', icon: FileText },
  submitted: { label: 'Submitted', color: 'bg-blue-500', icon: Clock },
  viewed: { label: 'Viewed', color: 'bg-purple-500', icon: CheckCircle },
  accepted: { label: 'Accepted', color: 'bg-green-500', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500', icon: XCircle },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-400', icon: Minus },
};

export default function ApplicationsPage() {
  const supabase = createClient();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          properties (
            id,
            title,
            address,
            city,
            price_monthly,
            images
          )
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast.error('Failed to load applications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const groupByStatus = (apps: any[]) => {
    const groups: Record<string, any[]> = {
      draft: [],
      submitted: [],
      viewed: [],
      accepted: [],
      rejected: [],
      withdrawn: [],
    };

    apps.forEach((app) => {
      const status = app.status || 'draft';
      groups[status].push(app);
    });

    return groups;
  };

  const statusGroups = groupByStatus(applications);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="mx-auto max-w-content">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-content px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-h1 font-heading font-bold text-white mb-2">Applications</h1>
            <p className="text-body text-white/60">Track and manage your rental applications</p>
          </div>
          <Link href="/dashboard/applications/new" className="btn-primary">
            New Application
          </Link>
        </div>

        {/* Status Pipeline */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const count = statusGroups[status].length;
              const Icon = config.icon;
              return (
                <div key={status} className="flex-shrink-0 w-48">
                  <div className={cn(
                    'rounded-lg border-2 p-4 transition-all',
                    count > 0 ? 'border-white/20 bg-white/5' : 'border-white/10 bg-white/5 opacity-50'
                  )}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn('p-2 rounded-lg', config.color)}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-body font-semibold text-white">{config.label}</div>
                        <div className="text-h3 font-heading font-bold text-white">{count}</div>
                      </div>
                    </div>
                    {count > 0 && (
                      <div className="space-y-2">
                        {statusGroups[status].slice(0, 3).map((app) => (
                          <Link
                            key={app.id}
                            href={`/dashboard/applications/${app.id}`}
                            className="block p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="text-body-sm font-medium text-white line-clamp-1">
                              {app.properties?.address || app.properties?.title || 'Property'}
                            </div>
                            {app.submitted_at && (
                              <div className="text-caption text-white/60 mt-1">
                                {formatRelativeTime(app.submitted_at)}
                              </div>
                            )}
                          </Link>
                        ))}
                        {statusGroups[status].length > 3 && (
                          <Link
                            href={`/dashboard/applications?status=${status}`}
                            className="text-body-sm text-electric-blue hover:text-electric-blue/80"
                          >
                            View all ({statusGroups[status].length})
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="card text-center py-24">
              <FileText className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-h3 font-heading font-bold text-white mb-2">No applications yet</h3>
              <p className="text-body text-white/60 mb-6">
                Start applying to properties to track your applications here
              </p>
              <Link href="/dashboard/applications/new" className="btn-primary">
                Create Application
              </Link>
            </div>
          ) : (
            applications.map((application) => {
              const status = application.status || 'draft';
              const config = STATUS_CONFIG[status];
              const Icon = config.icon;
              const isExpanded = expandedId === application.id;
              const property = application.properties;

              return (
                <div key={application.id} className="card">
                  <div className="flex items-start gap-4">
                    {/* Property Thumbnail */}
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-white/5">
                      {property?.images?.[0] ? (
                        <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/40">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-body-lg font-semibold text-white mb-1">
                            {property?.address || property?.title || 'Property'}
                          </h3>
                          {property?.city && (
                            <p className="text-body-sm text-white/60">{property.city}</p>
                          )}
                        </div>
                        <div className={cn(
                          'flex items-center gap-2 rounded-full px-3 py-1',
                          config.color,
                          status === 'withdrawn' && 'opacity-50'
                        )}>
                          <Icon className="h-4 w-4 text-white" />
                          <span className="text-caption font-medium text-white">{config.label}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-body-sm text-white/60 mb-4">
                        {application.submitted_at && (
                          <span>Submitted {formatRelativeTime(application.submitted_at)}</span>
                        )}
                        {application.updated_at && (
                          <span>Last updated {formatRelativeTime(application.updated_at)}</span>
                        )}
                      </div>

                      {/* Expanded View */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                          {/* Application Details */}
                          <div>
                            <h4 className="text-body-sm font-semibold text-white mb-2">Application Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-body-sm">
                              <div>
                                <span className="text-white/60">Name:</span>
                                <span className="text-white ml-2">{application.full_name}</span>
                              </div>
                              <div>
                                <span className="text-white/60">Email:</span>
                                <span className="text-white ml-2">{application.email}</span>
                              </div>
                              {application.move_in_date && (
                                <div>
                                  <span className="text-white/60">Move-in date:</span>
                                  <span className="text-white ml-2">{formatDate(application.move_in_date)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/applications/${application.id}`}
                              className="btn-secondary"
                            >
                              View Details
                            </Link>
                            {status === 'draft' && (
                              <Link
                                href={`/dashboard/applications/${application.id}/edit`}
                                className="btn-secondary"
                              >
                                Continue Editing
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand Toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : application.id)}
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className={cn(
                        'text-white/60 transition-transform',
                        isExpanded && 'rotate-180'
                      )}>
                        ↓
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

