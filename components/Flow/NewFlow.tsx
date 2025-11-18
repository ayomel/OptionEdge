"use client";

import React, { useEffect, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { createClient } from "@supabase/supabase-js";
import useRealtimeFlowsToday from "@/hooks/useRealtimeFlowsToday";
import { OptionFlowCard } from "./OptionFlowCard";
import { OptionFlow } from "@/types/Flowtypes";

const FILTERS = {
  EXPIRING_SOON: "EXPIRING_SOON",
  SWEEPS_ONLY: "SWEEPS_ONLY",
  PREMIUM_BIG: "PREMIUM_BIG",
  ALL_OPENING_TRADES: "ALL_OPENING_TRADES",
  STOCK_ONLY: "STOCK_ONLY",
  ABOVE_ASK: "ABOVE_ASK",
};

export default function Flow() {
  const [flows, setFlows] = useState<OptionFlow[]>([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  // 👇 Supabase client for realtime only
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  // 🔥 Realtime updates
  useRealtimeFlowsToday(supabase, setFlows);

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

  // 🔥 Fetch flows with search and filters from API
  useEffect(() => {
    const fetchData = async () => {
      const size = 500;
      const from = page * size;
      const to = from + size - 1;

      const params = new URLSearchParams({
        from: from.toString(),
        to: to.toString(),
        filters: JSON.stringify(activeFilters),
      });

      if (debounced.trim()) {
        params.set("search", debounced);
      }

      const res = await fetch(`/api/flows/search?${params.toString()}`, {
        cache: "no-store",
      });

      const json = await res.json();
      if (json.success && json.data) {
        if (page === 0) {
          setFlows(json.data); // Replace on first page
        } else {
          setFlows((prev) => [...prev, ...json.data]); // Append on subsequent pages
        }
      }
    };

    fetchData();
  }, [page, debounced, activeFilters]);

  // Reset to page 0 when search or filters change
  useEffect(() => {
    setPage(0);
    setFlows([]);
  }, [debounced, activeFilters]);

  console.log(flows);

  const listRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count: flows.length,
    estimateSize: () => 180, // Approximate height of a card including margin
    scrollMargin: listRef.current?.offsetTop ?? 0,
    overscan: 5,
  });

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
        <button
          onClick={() => toggleFilter(FILTERS.ABOVE_ASK)}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            activeFilters.includes(FILTERS.ABOVE_ASK)
              ? "bg-pink-600 border-pink-500 text-white"
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          Above Ask
        </button>
      </div>

      {/* RESULTS */}
      <div ref={listRef} style={{ position: "relative", height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const flow = flows[virtualItem.index];
          return (
            <div
              key={flow.id}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <OptionFlowCard flow={flow} />
            </div>
          );
        })}
      </div>

      {flows.length === 0 && (
        <div className="text-center text-gray-400 mt-8">No results found.</div>
      )}

      <div className="text-center text-gray-500 mt-4 pb-8">Loading more...</div>
    </div>
  );
}
