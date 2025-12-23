"use client";

import SocialProofDashboard from "@/components/trust-builder/SocialProofDashboard";

export default function LiveStatsWrapper() {
  return (
    <SocialProofDashboard 
      variant="homepage" 
      showTrustpilot 
      autoRefresh 
      useLiveData 
    />
  );
}

