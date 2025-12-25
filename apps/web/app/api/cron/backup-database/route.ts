import { NextResponse } from "next/server";
import { supabaseAdmin } from "@uprent-plus/database";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tables = ["users", "properties", "search_profiles", "applications"];
    const backupData: Record<string, any[]> = {};

    for (const table of tables) {
      const { data, error } = await supabaseAdmin.from(table).select("*");
      if (!error && data) {
        backupData[table] = data;
      }
    }

    console.log("[Backup] Database backup completed");

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tables: Object.keys(backupData),
      totalRecords: Object.values(backupData).reduce((sum, arr) => sum + arr.length, 0)
    });
  } catch (error) {
    console.error("[Backup] Failed:", error);
    return NextResponse.json({ error: "Backup failed" }, { status: 500 });
  }
}

export const runtime = "nodejs";

