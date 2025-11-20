import { useEffect, useMemo, useState } from "react";
import { OptionFlow } from "@/types/Flowtypes";
import isETF from "@/utils/ETF";

export const FILTERS = {
  EXPIRING_SOON: "EXPIRING_SOON",
  SWEEPS_ONLY: "SWEEPS_ONLY",
  PREMIUM_BIG: "PREMIUM_BIG",
  ALL_OPENING_TRADES: "ALL_OPENING_TRADES",
  STOCK_ONLY: "STOCK_ONLY",
  ABOVE_ASK: "ABOVE_ASK",
};

const STORAGE_KEY = "activeFlowFilters";

export function useFlowFilters(flows: OptionFlow[]) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // 🔥 Load filters from localStorage (only once)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setActiveFilters(JSON.parse(saved));
      } catch {
        console.error("invalid JSON in filter storage");
      }
    }
  }, []);

  // 🔥 Save filters when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeFilters));
  }, [activeFilters]);

  // 🔥 Debounce search (keep this)
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
  const filteredFlows = useMemo(() => {
    let result = [...flows];

    // newest first
    result.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // 🔍 Search
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

    // 🎯 Filters
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
      result = result.filter((flow) => flow.all_opening_trades);
    }

    if (activeFilters.includes(FILTERS.STOCK_ONLY)) {
      result = result.filter((flow) => !isETF(flow.ticker));
    }

    if (activeFilters.includes(FILTERS.ABOVE_ASK)) {
      result = result.filter(
        (flow) =>
          flow.ask != null && flow.price != null && flow.price > flow.ask
      );
    }

    return result;
  }, [debounced, flows, activeFilters]);

  return {
    search,
    setSearch,
    activeFilters,
    toggleFilter,
    filteredFlows,
  };
}
