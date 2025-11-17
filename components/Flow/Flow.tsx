/* eslint-disable react-hooks/incompatible-library */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import useRealtimeFlowsToday from "@/hooks/useRealtimeFlowsToday";
import { OptionFlowCard } from "./OptionFlowCard";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { OptionFlow } from "@/types/Flowtypes";
import { FILTERS, PAGE_SIZE, PREFS_KEY } from "./constants";
import { FilterKey, SortKey } from "@/types/Flowtypes";
import { useFlowColumns } from "./FlowColumnDef";
import SkeletonTableRow from "./SkeletonTableRow";
import SkeletonCard from "./SkeletonCard";
import { useLoadFlowPrefs } from "@/hooks/useLoadFlowPrefs";
import { usePersistFlowPrefs } from "@/hooks/usePersistFlowPrefs";
import { useInfiniteFlowFetch } from "@/hooks/useInfiniteFlowFetch";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useDebounce } from "@/hooks/useDebounce";

export default function Flow() {
  const [flows, setFlows] = useState<OptionFlow[]>([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>([]);
  const [sort, setSort] = useState<SortKey>("TIME_DESC");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      ),
    []
  );

  useRealtimeFlowsToday(supabase, setFlows);
  useLoadFlowPrefs(PREFS_KEY, setSearch, setActiveFilters, setSort);

  usePersistFlowPrefs(PREFS_KEY, search, activeFilters, sort);

  useInfiniteFlowFetch(
    page,
    PAGE_SIZE,
    setFlows,
    setHasMore,
    setLoading,
    setInitialLoaded
  );

  useInfiniteScroll(hasMore, loading, setPage);

  useDebounce(search, 300, setDebounced);

  const toggleFilter = (f: FilterKey) => {
    setActiveFilters((prev) =>
      prev.includes(f)
        ? (prev.filter((x) => x !== f) as FilterKey[])
        : [...prev, f]
    );
  };

  const setSortKey = (key: SortKey) => setSort(key);

  const filtered = useMemo(() => {
    let result = [...flows];

    // search
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

    // expiring soon
    if (activeFilters.includes(FILTERS.EXPIRING_SOON)) {
      const today = new Date();
      const twoWeeks = new Date();
      twoWeeks.setDate(today.getDate() + 14);

      result = result.filter((flow) => {
        const exp = new Date(flow.expiry);
        return exp >= today && exp <= twoWeeks;
      });
    }

    // sweeps only
    if (activeFilters.includes(FILTERS.SWEEPS_ONLY)) {
      result = result.filter((flow) => flow.has_sweep);
    }

    // premium > 500k
    if (activeFilters.includes(FILTERS.PREMIUM_BIG)) {
      result = result.filter((flow) => flow.total_premium > 500_000);
    }

    // unusual (custom)
    if (activeFilters.includes(FILTERS.UNUSUAL)) {
      result = result.filter(
        (flow) =>
          flow.has_sweep ||
          flow.total_premium > 750_000 ||
          flow.total_size > 1_000
      );
    }

    // sorting
    const sorted = [...result];
    switch (sort) {
      case "TIME_DESC":
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "PREMIUM_DESC":
        sorted.sort((a, b) => b.total_premium - a.total_premium);
        break;
      case "SIZE_DESC":
        sorted.sort((a, b) => b.total_size - a.total_size);
        break;
      case "EXPIRY_ASC":
        sorted.sort(
          (a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime()
        );
        break;
      case "NONE":
      default:
        break;
    }

    return sorted;
  }, [debounced, flows, activeFilters, sort]);

  const table = useReactTable({
    data: filtered,
    columns: useFlowColumns(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      {/* search */}
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 rounded-lg bg-[#2a2d35] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        placeholder="Search ticker, strike, type, expiry..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* filter pills */}
      <div className="flex flex-wrap gap-2 mb-3">
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
          onClick={() => toggleFilter(FILTERS.UNUSUAL)}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            activeFilters.includes(FILTERS.UNUSUAL)
              ? "bg-pink-600 border-pink-500 text-white"
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          Unusual
        </button>
      </div>

      {/* sort pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSortKey("TIME_DESC")}
          className={`px-3 py-1 rounded-full text-xs border ${
            sort === "TIME_DESC"
              ? "bg-white text-black border-white"
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          Newest
        </button>
        <button
          onClick={() => setSortKey("PREMIUM_DESC")}
          className={`px-3 py-1 rounded-full text-xs border ${
            sort === "PREMIUM_DESC"
              ? "bg-white text-black border-white"
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          Premium
        </button>
        <button
          onClick={() => setSortKey("SIZE_DESC")}
          className={`px-3 py-1 rounded-full text-xs border ${
            sort === "SIZE_DESC"
              ? "bg-white text-black border-white"
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          Size
        </button>
        <button
          onClick={() => setSortKey("EXPIRY_ASC")}
          className={`px-3 py-1 rounded-full text-xs border ${
            sort === "EXPIRY_ASC"
              ? "bg_WHITE text-black border-white".toLowerCase()
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          Nearest Expiry
        </button>
      </div>

      {/* initial skeletons */}
      {!initialLoaded && loading && (
        <>
          <div className="md:hidden">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
          <div className="hidden md:block">
            <table className="min-w-full text-xs text-gray-200">
              <tbody>
                {Array.from({ length: 8 }).map((_, idx) => (
                  <SkeletonTableRow key={idx} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {initialLoaded && filtered.length === 0 && !loading && (
        <div className="text-center text-gray-400 mt-8">No results found.</div>
      )}

      {/* mobile cards */}
      <div className="md:hidden">
        {filtered.map((flow) => (
          <OptionFlowCard key={flow.id} flow={flow} />
        ))}
      </div>

      {/* desktop table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#14161b]">
          <table className="min-w-full text-xs text-gray-200">
            <thead className="bg-[#1b1e25]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 py-2 text-left font-semibold text-gray-300"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-gray-800 hover:bg-[#1f222a]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* load more indicator */}
      {initialLoaded && loading && (
        <div className="text-center text-gray-500 mt-4 pb-8">
          Loading more...
        </div>
      )}
    </div>
  );
}
