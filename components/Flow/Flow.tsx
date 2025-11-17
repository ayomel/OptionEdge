"use client";

import React, { useEffect, useMemo, useState } from "react";
import { OptionFlowCard } from "./OptionFlowCard";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { createClient } from "@supabase/supabase-js";

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
  const { isLG } = useBreakpoint();

  // Supabase client
  const supabase = useMemo(
    () => createClient(config.supabaseUrl, config.supabaseAnonKey),
    [config]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("option_flows_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "option_flows",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setFlows((prev) => [payload.new as OptionFlow, ...prev]);
          }

          if (payload.eventType === "UPDATE") {
            setFlows((prev) =>
              prev.map((f) =>
                f.id === payload.new.id ? (payload.new as OptionFlow) : f
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setFlows((prev) => prev.filter((f) => f.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Filters
  const filtered = useMemo(() => {
    if (!debounced.trim()) return flows;

    const query = debounced.toLowerCase();

    return flows.filter((flow) => {
      return (
        flow.ticker.toLowerCase().includes(query) ||
        flow.type.toLowerCase().includes(query) ||
        String(flow.strike).includes(query) ||
        flow.expiry.toLowerCase().includes(query) ||
        String(flow.total_premium).includes(query)
      );
    });
  }, [debounced, flows]);

  // Mobile view only
  return !isLG ? (
    <div className="p-4">
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 rounded-lg bg-[#2a2d35] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        placeholder="Search ticker, strike, type, expiry..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.map((flow) => (
        <OptionFlowCard key={flow.id} flow={flow} />
      ))}

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-8">No results found.</div>
      )}
    </div>
  ) : (
    <div>No Desktop View just yet sorry :D</div>
  );
}
