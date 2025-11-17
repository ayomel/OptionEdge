/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

export function usePersistFlowPrefs(
  PREFS_KEY: string,
  search: string,
  activeFilters: any[],
  sort: any
) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefs = { search, activeFilters, sort };
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [search, activeFilters, sort]);
}
