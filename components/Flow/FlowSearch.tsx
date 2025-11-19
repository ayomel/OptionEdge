import React from "react";

interface FlowSearchProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function FlowSearch({ search, setSearch }: FlowSearchProps) {
  return (
    <input
      type="text"
      className="w-full mb-4 px-3 py-2 rounded-lg bg-[#2a2d35] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
      placeholder="Search ticker, strike, type, expiry..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
