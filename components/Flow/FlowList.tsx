import React from "react";
import { OptionFlow } from "@/types/Flowtypes";
import { OptionFlowCard } from "./OptionFlowCard";

interface FlowListProps {
  flows: OptionFlow[];
  isLoading: boolean;
}

export default function FlowList({ flows, isLoading }: FlowListProps) {
  return (
    <>
      {flows.map((flow) => (
        <OptionFlowCard key={flow.id} flow={flow} />
      ))}

      {flows.length === 0 && !isLoading && (
        <div className="text-center text-gray-400 mt-8">No results found.</div>
      )}

      <div className="text-center text-gray-500 mt-4 pb-8">
        {isLoading ? "Loading..." : "Loading more..."}
      </div>
    </>
  );
}
