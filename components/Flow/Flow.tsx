"use client";

import React, { useEffect, useMemo, useState } from "react";
import { OptionFlowCard } from "./OptionFlowCard";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { createClient } from "@supabase/supabase-js";
import useRealtimeSubscriptionSupabase from "@/hooks/useRealtimeSubscriptionSupabase";

export type OptionFlow = {
  id: string;
  ticker: string;
  type: string;
  strike: number;
  expiry: string;
  total_premium: number;
  total_size: number;
  price: number;
  underlying_price: number;
  created_at: string;
  has_sweep: boolean;
};

const FILTERS = {
  EXPIRING_SOON: "EXPIRING_SOON",
  SWEEPS_ONLY: "SWEEPS_ONLY",
  PREMIUM_BIG: "PREMIUM_BIG",
};

export default function Flow({
  options = [],
  config,
}: {
  options?: OptionFlow[];
  config: { supabaseUrl: string; supabaseAnonKey: string };
}) {
  const [flows, setFlows] = useState<OptionFlow[]>(options);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { isLG } = useBreakpoint();

  const supabase = useMemo(
    () => createClient(config.supabaseUrl, config.supabaseAnonKey),
    [config]
  );

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useRealtimeSubscriptionSupabase(supabase, setFlows);

  // --- TOGGLE FILTER HANDLER ---
  const toggleFilter = (filterName: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterName)
        ? prev.filter((f) => f !== filterName)
        : [...prev, filterName]
    );
  };

  const filtered = useMemo(() => {
    let result = [...flows];

    // --- SEARCH LOGIC ---
    if (debounced.trim()) {
      const query = debounced.toLowerCase();
      result = result.filter((flow) => {
        return (
          flow.ticker.toLowerCase().includes(query) ||
          flow.type.toLowerCase().includes(query) ||
          String(flow.strike).includes(query) ||
          flow.expiry.toLowerCase().includes(query) ||
          String(flow.total_premium).includes(query)
        );
      });
    }

    // --- PILL FILTERS LOGIC ---
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
      result = result.filter((flow) => flow.total_premium > 500000);
    }

    return result;
  }, [debounced, flows, activeFilters]);

  // --- MOBILE VIEW ---
  return (
    <div className="p-4">
      {/* SEARCH INPUT */}
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
      </div>

      {/* RESULTS */}
      {filtered.map((flow) => (
        <OptionFlowCard key={flow.id} flow={flow} />
      ))}

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-8">No results found.</div>
      )}
    </div>
  );
}
