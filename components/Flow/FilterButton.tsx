// FilterButton.tsx

import React from "react";

interface FilterButtonProps {
    filter: string;
    activeFilters: string[];
    toggleFilter: (filter: string) => void;
    label: string;
}

function FilterButton({ filter, activeFilters, toggleFilter, label }: FilterButtonProps) {
    return (
        <button
          onClick={() => toggleFilter(filter)}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            activeFilters.includes(filter)
              ? "bg-pink-600 border-pink-500 text-white"
              : "bg-[#2a2d35] border-gray-600 text-gray-300"
          }`}
        >
          {label}
        </button>
    )
}

export default FilterButton;