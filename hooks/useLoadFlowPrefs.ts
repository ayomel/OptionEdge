/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

export function useLoadFlowPrefs(
  PREFS_KEY: string,
  setSearch: (v: string) => void,
  setActiveFilters: (v: any) => void,
  setSort: (v: any) => void
) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        search?: string;
        activeFilters?: any[];
        sort?: any;
      };

      if (parsed.search) setSearch(parsed.search);
      if (parsed.activeFilters) setActiveFilters(parsed.activeFilters);
      if (parsed.sort) setSort(parsed.sort);
    } catch {
      // ignore errors
    }
  }, []);
}
