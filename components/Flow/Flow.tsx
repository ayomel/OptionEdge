"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import useRealtimeFlowsToday from "@/hooks/useRealtimeFlowsToday";
import { OptionFlowCard } from "./OptionFlowCard";
import { OptionFlow } from "@/types/Flowtypes";
import isETF from "@/utils/ETF";

const FILTERS = {
  EXPIRING_SOON: "EXPIRING_SOON",
  SWEEPS_ONLY: "SWEEPS_ONLY",
  PREMIUM_BIG: "PREMIUM_BIG",
  ALL_OPENING_TRADES: "ALL_OPENING_TRADES",
  STOCK_ONLY: "STOCK_ONLY",
};

export default function Flow() {
  const [flows, setFlows] = useState<OptionFlow[]>([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  // 👇 Supabase client for realtime only
  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
  }, []);

  // 🔥 Realtime updates
  useRealtimeFlowsToday(supabase, setFlows);

  // 🔥 Load today's flows from your API route
  useEffect(() => {
    const fetchData = async () => {
      const size = 500;
      const from = page * size;
      const to = from + size - 1;

      const res = await fetch(`/api/flows/today?from=${from}&to=${to}`, {
        cache: "no-store",
      });

      const json = await res.json();
      if (json.success && json.data) {
        setFlows((prev) => [...prev, ...json.data]); // append
      }
    };

    fetchData();
  }, [page]);

  // 🔥 Auto-load more (infinite scroll)
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 400
      ) {
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 🔥 Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 Toggle pill filters
  const toggleFilter = (f: string) => {
    setActiveFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  // 🔥 Apply search + filters
  const filtered = useMemo(() => {
    let result = [...flows];

    result.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    if (debounced.trim()) {
      const q = debounced.toLowerCase();
      result = result.filter(
        (flow) =>
          flow.ticker.toLowerCase().includes(q) ||
          flow.type.toLowerCase().includes(q) ||
          String(flow.strike).includes(q) ||
          flow.expiry.toLowerCase().includes(q) ||
          String(flow.total_premium).includes(q)
      );
    }

    if (activeFilters.includes(FILTERS.EXPIRING_SOON)) {
      const today = new Date();
      const twoWeeks = new Date();
      twoWeeks.setDate(today.getDate() + 14);

      result = result.filter((flow) => {
        const exp = new Date(flow.expiry);
        return exp >= today && exp <= twoWeeks;
      });
    }

    if (activeFilters.includes(FILTERS.SWEEPS_ONLY)) {
      result = result.filter((flow) => flow.has_sweep);
    }

    if (activeFilters.includes(FILTERS.PREMIUM_BIG)) {
      result = result.filter((flow) => flow.total_premium > 500_000);
    }

    if (activeFilters.includes(FILTERS.ALL_OPENING_TRADES)) {
      result
      
        = result.filter((flow) => flow.all_opening_trades);
    }

    if (activeFilters.includes(FILTERS.STOCK_ONLY)) {
      result = result.filter((flow) => !isETF(flow.ticker));
    }

    return result;
  }, [debounced, flows, activeFilters]);

  return (
    <div className="p-4">
      {/* SEARCH */}
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 rounded-lg bg-[#2a2d35] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        placeholder="Search ticker, strike, type, expiry..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* PILL FILTERS */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => toggleFilter(FILTERS.EXPIRING_SOON)}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            activeFilters.includes(FILTERS.EXPIRING_SOON)
              ? "bg-pink-600 border-pink-500 text-white"
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          Expiring Soon
        </button>

        <button
          onClick={() => toggleFilter(FILTERS.SWEEPS_ONLY)}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            activeFilters.includes(FILTERS.SWEEPS_ONLY)
              ? "bg-pink-600 border-pink-500 text-white"
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          Sweeps Only
        </button>

        <button
          onClick={() => toggleFilter(FILTERS.PREMIUM_BIG)}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            activeFilters.includes(FILTERS.PREMIUM_BIG)
              ? "bg-pink-600 border-pink-500 text-white"
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          Premium &gt; 500K
        </button>

        <button
          onClick={() => toggleFilter(FILTERS.ALL_OPENING_TRADES)}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            activeFilters.includes(FILTERS.ALL_OPENING_TRADES)
              ? "bg-pink-600 border-pink-500 text-white"
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          All Opening Trades
        </button>

        <button
          onClick={() => toggleFilter(FILTERS.STOCK_ONLY)}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            activeFilters.includes(FILTERS.STOCK_ONLY)
              ? "bg-pink-600 border-pink-500 text-white"
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          Stock Only
        </button>
      </div>

      {/* RESULTS */}
      {filtered.map((flow) => (
        <OptionFlowCard key={flow.id} flow={flow} />
      ))}

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-8">No results found.</div>
      )}

      <div className="text-center text-gray-500 mt-4 pb-8">Loading more...</div>
    </div>
  );
}
