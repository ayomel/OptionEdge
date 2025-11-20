/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

export default function useRealtimeFlowsToday(supabase: any, setFlows: any) {
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel("option_flows-realtime", {
      config: {
        presence: { key: "flows" },
        broadcast: { ack: true },
        retry: 10, // try reconnecting up to 10 times
      },
    });

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "option_flows",
      },
      (payload: any) => {
        const newFlow = payload.new;

        const getNYDateString = (date: Date) => {
          return new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/New_York",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(date);
        };

        const createdDateNY = getNYDateString(new Date(newFlow.created_at));
        const todayNY = getNYDateString(new Date());
        const isToday = createdDateNY === todayNY;

        if (!isToday) return;

        setFlows((prev: any[]) => {
          if (prev.some((f) => f.id === newFlow.id)) return prev;
          return [newFlow, ...prev];
        });
      }
    );

    channel.subscribe((status: string) => {
      if (status === "SUBSCRIBED") {
        console.log("Realtime connected ✔️");
      }
      if (status === "TIMED_OUT") {
        console.warn("Realtime timeout, retrying…");
      }
      if (status === "CLOSED") {
        console.warn("Realtime connection closed, will retry…");
      }
      if (status === "CHANNEL_ERROR") {
        console.error("Realtime channel error");
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
}
