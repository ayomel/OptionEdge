/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

export default function useRealtimeFlowsToday(supabase: any, setFlows: any) {
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
          const newFlow = payload.new;

          // Only add if it's created today
          const created = new Date(newFlow.created_at);
          const now = new Date();
          const isToday =
            created.getFullYear() === now.getFullYear() &&
            created.getMonth() === now.getMonth() &&
            created.getDate() === now.getDate();

          if (!isToday) return;

          setFlows((prev: any[]) => {
            if (prev.some((f) => f.id === newFlow.id)) return prev;
            return [newFlow, ...prev]; // prepend newest
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [supabase]);
}
