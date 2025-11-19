import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { OptionFlow } from "@/types/Flowtypes";
import useRealtimeFlowsToday from "@/hooks/useRealtimeFlowsToday";

export function useFlowData() {
  const [flows, setFlows] = useState<OptionFlow[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 👇 Supabase client for realtime only
  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
  }, []);

  // 🔥 Realtime updates
  useRealtimeFlowsToday(supabase, setFlows);

  // 🔥 Load today's flows from your API route
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const size = 500;
        const from = page * size;
        const to = from + size - 1;

        const res = await fetch(`/api/flows/today?from=${from}&to=${to}`, {
          cache: "no-store",
        });

        const json = await res.json();
        if (json.success && json.data) {
          setFlows((prev) => [...prev, ...json.data]); // append
        }
      } catch (error) {
        console.error("Failed to fetch flows", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]);

  // 🔥 Auto-load more (infinite scroll)
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 400
      ) {
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { flows, isLoading };
}
