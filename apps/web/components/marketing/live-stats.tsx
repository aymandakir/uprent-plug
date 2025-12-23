"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import SocialProofDashboard to avoid build-time clientModules error
const SocialProofDashboard = dynamic(
  () => import("@/components/trust-builder/SocialProofDashboard"),
  { 
    ssr: false,
    loading: () => <div className="h-96 animate-pulse rounded-3xl bg-gray-100" />
  }
);

export function LiveStats() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Real-Time Community Activity
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands finding homes right now. Live data, not fake numbers.
          </p>
        </div>

        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-gray-100" />}>
          <SocialProofDashboard variant="homepage" showTrustpilot autoRefresh useLiveData />
        </Suspense>
      </div>
    </section>
  );
}

