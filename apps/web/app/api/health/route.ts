import { NextResponse } from "next/server";
import { supabase } from "@uprent-plus/database";

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    checks: {
      database: false,
      stripe: false,
      openai: false
    }
  };

  try {
    const { error: dbError } = await supabase.from("users").select("id").limit(1);
    checks.checks.database = !dbError;

    checks.checks.stripe = !!process.env.STRIPE_SECRET_KEY;
    checks.checks.openai = !!process.env.OPENAI_API_KEY;

    const allHealthy = Object.values(checks.checks).every(Boolean);
    checks.status = allHealthy ? "healthy" : "degraded";

    return NextResponse.json(checks, { status: allHealthy ? 200 : 503 });
  } catch (error) {
    return NextResponse.json(
      { ...checks, status: "unhealthy", error: String(error) },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

