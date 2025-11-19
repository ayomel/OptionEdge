"use client";

import React from "react";
import { useFlowData } from "@/hooks/useFlowData";
import { useFlowFilters } from "@/hooks/useFlowFilters";
import FlowSearch from "./FlowSearch";
import FlowFilters from "./FlowFilters";
import FlowList from "./FlowList";

export default function Flow() {
  const { flows, isLoading } = useFlowData();
  const {
    search,
    setSearch,
    activeFilters,
    toggleFilter,
    filteredFlows,
  } = useFlowFilters(flows);

  return (
    <div className="p-4">
      <FlowSearch search={search} setSearch={setSearch} />
      
      <FlowFilters 
        activeFilters={activeFilters} 
        toggleFilter={toggleFilter} 
      />

      <FlowList flows={filteredFlows} isLoading={isLoading} />
    </div>
  );
}
