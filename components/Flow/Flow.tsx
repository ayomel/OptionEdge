"use client";

import React, { useEffect, useMemo, useState } from "react";
import { OptionFlowCard } from "./OptionFlowCard";

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

export default function Flow({ options = [] }: { options?: OptionFlow[] }) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filtered = useMemo(() => {
    if (!debounced.trim()) return options;

    const query = debounced.toLowerCase();

    return options.filter((flow) => {
      return (
        flow.ticker.toLowerCase().includes(query) ||
        flow.type.toLowerCase().includes(query) ||
        String(flow.strike).includes(query) ||
        flow.expiry.toLowerCase().includes(query) ||
        String(flow.total_premium).includes(query)
      );
    });
  }, [debounced, options]);

  return (
    <div className="p-4">
      {/* Search Input */}
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 rounded-lg bg-[#2a2d35] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        placeholder="Search ticker, strike, type, expiry..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Results */}
      {filtered.map((flow) => (
        <OptionFlowCard key={flow.id} flow={flow} />
      ))}

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-8">No results found.</div>
      )}
    </div>
  );
}
