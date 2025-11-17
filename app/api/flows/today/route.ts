import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getLocalDayRange() {
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const localNow = new Date(Date.now() - tzOffset);

  const today = localNow.toISOString().split("T")[0];

  const tomorrow = new Date(localNow);
  tomorrow.setDate(localNow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  return { today, tomorrow: tomorrowStr };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const from = Number(searchParams.get("from") ?? 0);
    const to = Number(searchParams.get("to") ?? 1499);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { today, tomorrow } = getLocalDayRange();

    const { data, error } = await supabase
      .from("option_flows")
      .select("*")
      .gte("created_at", today)
      .lt("created_at", tomorrow)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
