/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import type { OptionFlow } from "@/components/Flow/Flow";

export default function useRealtimeFlowsToday(
  supabase: any,
  setFlows: React.Dispatch<React.SetStateAction<OptionFlow[]>>
) {
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("option_flows-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "option_flows",
        },
        (payload: any) => {
          const newFlow = payload.new as OptionFlow;

          const created = new Date(newFlow.created_at);
          const now = new Date();
          const isToday =
            created.getFullYear() === now.getFullYear() &&
            created.getMonth() === now.getMonth() &&
            created.getDate() === now.getDate();

          if (!isToday) return;

          setFlows((prev) => {
            if (prev.some((f) => f.id === newFlow.id)) return prev;
            return [newFlow, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setFlows]);
}
