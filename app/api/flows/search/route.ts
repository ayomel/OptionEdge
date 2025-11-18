import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ETF tickers list for STOCK_ONLY filter
const ETF_TICKERS = new Set([
  "SPY", "QQQ", "IWM", "DIA", "GLD", "SLV", "UVXY", "UVIX", "VXX", "VTI", "VOO", "SMH",
  "SOXX", "BITO", "IBIT", "ETHA", "ARKK", "ARKW", "XLF", "XLI", "XLE", "XLK", "XLU",
  "SQQQ", "TQQQ", "SOXL", "SOXS", "LABU", "LABD"
]);

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

    const search = searchParams.get("search") || "";
    const filtersParam = searchParams.get("filters") || "[]";
    const from = Number(searchParams.get("from")) || 0;
    const to = Number(searchParams.get("to")) || 499;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { today, tomorrow } = getLocalDayRange();

    // Start building the query
    let query = supabase
      .from("option_flows")
      .select("*")
      .gte("created_at", today)
      .lt("created_at", tomorrow);

    // Apply search if provided
    if (search.trim()) {
      // Check if search is numeric
      const isNumeric = !isNaN(Number(search));

      if (isNumeric) {
        // Search across all fields including numeric ones
        query = query.or(
          `ticker.ilike.%${search}%,type.ilike.%${search}%,strike.eq.${search},expiry.ilike.%${search}%,total_premium.eq.${search}`
        );
      } else {
        // Only search text fields
        query = query.or(
          `ticker.ilike.%${search}%,type.ilike.%${search}%,expiry.ilike.%${search}%`
        );
      }
    }

    // Apply filters
    const filters = JSON.parse(filtersParam);

    if (filters.includes("EXPIRING_SOON")) {
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
      const twoWeeksStr = twoWeeksFromNow.toISOString();
      query = query.gte("expiry", today).lte("expiry", twoWeeksStr);
    }

    if (filters.includes("SWEEPS_ONLY")) {
      query = query.eq("has_sweep", true);
    }

    if (filters.includes("PREMIUM_BIG")) {
      query = query.gt("total_premium", 500000);
    }

    if (filters.includes("ALL_OPENING_TRADES")) {
      query = query.eq("all_opening_trades", true);
    }

    if (filters.includes("STOCK_ONLY")) {
      query = query.not("ticker", "in", `(${Array.from(ETF_TICKERS).join(",")})`);
    }

    if (filters.includes("ABOVE_ASK")) {
      query = query.not("ask", "is", null)
        .not("price", "is", null)
        .filter("price", "gt", "ask");
    }

    // Apply sorting and pagination
    const { data, error } = await query
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
