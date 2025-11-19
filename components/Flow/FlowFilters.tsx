import React from "react";
import FilterButton from "./FilterButton";
import { FILTERS } from "@/hooks/useFlowFilters";

interface FlowFiltersProps {
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
}

export default function FlowFilters({
  activeFilters,
  toggleFilter,
}: FlowFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <FilterButton
        filter={FILTERS.EXPIRING_SOON}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        label="Expiring Soon"
      />

      <FilterButton
        filter={FILTERS.SWEEPS_ONLY}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        label="Sweeps Only"
      />

      <FilterButton
        filter={FILTERS.PREMIUM_BIG}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        label="Premium > 500K"
      />

      <FilterButton
        filter={FILTERS.ALL_OPENING_TRADES}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        label="All Opening Trades"
      />

      <FilterButton
        filter={FILTERS.STOCK_ONLY}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        label="Stock Only"
      />

      <FilterButton
        filter={FILTERS.ABOVE_ASK}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        label="Above Ask"
      />
    </div>
  );
}
