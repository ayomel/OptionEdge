import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { OptionFlow } from "@/types/Flowtypes";
import useRealtimeFlowsToday from "@/hooks/useRealtimeFlowsToday";

export function useFlowData() {
  const [flows, setFlows] = useState<OptionFlow[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true); // Initialize hasMore to true

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
      if (!hasMore && page > 0) { // Prevent fetching if no more data and not initial load
        setIsLoading(false);
        return;
      }
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
          if (json.data.length < size) { // If fewer items than requested, no more data
            setHasMore(false);
          }
        } else {
          setHasMore(false); // If API call fails or returns no data, assume no more
        }
      } catch (error) {
        console.error("Failed to fetch flows", error);
        setHasMore(false); // On error, assume no more data
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]); // Removed hasMore from dependencies to avoid re-fetching on hasMore change

  // 🔥 Auto-load more (infinite scroll)
  useEffect(() => {
    const onScroll = () => {
      if (
        hasMore && // Only load more if there's potentially more data
        !isLoading && // Only load more if not currently loading
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 400
      ) {
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, isLoading]); // Add hasMore and isLoading to dependencies

  return { flows, isLoading, hasMore };
}
