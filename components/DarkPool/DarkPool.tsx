"use client";

import React from "react";
import { useDarkPoolQuery } from "@/hooks/useDarkPoolQuery";
import { DarkPoolTrade } from "@/types/DarkpoolTypes";
import DarkPoolCard from "./DarkPoolCard";

export default function DarkPool() {
  const { data, isLoading, error } = useDarkPoolQuery();
  const [searchQuery, setSearchQuery] = React.useState("");

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-400">
        Loading dark pool prints…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center text-sm text-red-400">
        Error: {error.message}
      </div>
    );
  }

  const allTrades: DarkPoolTrade[] = Array.isArray(data)
    ? data
    : (data?.data as DarkPoolTrade[]) ?? [];

  const trades = allTrades.filter((t) =>
    t.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#02030a] pb-6">
      <header className="sticky top-0 z-10 bg-[#02030a]/95 backdrop-blur px-4 pt-4 pb-3 border-b border-white/5">
        <h1 className="text-lg font-semibold text-white">Dark Pool</h1>
        <p className="mt-1 text-xs text-gray-400">
          Large off-exchange prints, newest first.
        </p>
        <div className="mt-3">
          <input
            type="text"
            placeholder="Filter by ticker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col gap-3 px-4 pt-3">
        {trades.length === 0 ? (
          <div className="mt-10 text-center text-sm text-gray-500">
            {searchQuery
              ? `No trades found for "${searchQuery}"`
              : "No dark pool activity found."}
          </div>
        ) : (
          trades.map((t) => (
            <DarkPoolCard
              key={
                (t as any).natural_id ??
                t.id ??
                `${t.ticker}-${t.executed_at}-${t.size}`
              }
              trade={t}
            />
          ))
        )}
      </main>
    </div>
  );
}
