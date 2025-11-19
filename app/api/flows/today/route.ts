import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getNYDayRange() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayStr = formatter.format(now); // YYYY-MM-DD

  // Create dates from the string to ensure we get the correct ISO string for the query
  // We just need the YYYY-MM-DD string for the Supabase query as it defaults to 00:00 UTC
  // But to be safe and consistent with the logic of "next day", let's calculate tomorrow's date string
  const todayDate = new Date(todayStr);
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split("T")[0];

  return { today: todayStr, tomorrow: tomorrowStr };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const from = Number(searchParams.get("from"));
    const to = Number(searchParams.get("to"));

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { today, tomorrow } = getNYDayRange();

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
