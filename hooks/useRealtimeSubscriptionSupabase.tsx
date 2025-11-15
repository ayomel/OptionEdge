import React, { useEffect } from "react";

function useRealtimeSubscriptionSupabase(supabase: any, setRowsData: any) {
  useEffect(() => {
    const channel = supabase
      .channel("option_flows-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "option_flows" },
        (payload: any) => {
          console.log("Realtime change:", payload);
          const { eventType, new: newRow, old: oldRow } = payload;

          setRowsData((prev: any) => {
            switch (eventType) {
              case "INSERT":
                return [newRow, ...prev];
              case "UPDATE":
                return prev.map((r: any) => (r.id === newRow.id ? newRow : r));
              case "DELETE":
                return prev.filter((r: any) => r.id !== oldRow.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setRowsData]);
}

export default useRealtimeSubscriptionSupabase;
