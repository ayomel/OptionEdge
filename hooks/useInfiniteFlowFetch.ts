import { useEffect } from "react";
import { OptionFlow } from "@/types/Flowtypes";

export function useInfiniteFlowFetch(
  page: number,
  PAGE_SIZE: number,
  setFlows: React.Dispatch<React.SetStateAction<OptionFlow[]>>,
  setHasMore: (v: boolean) => void,
  setLoading: (v: boolean) => void,
  setInitialLoaded: (v: boolean) => void
) {
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const res = await fetch(`/api/flows/today?from=${from}&to=${to}`, {
        cache: "no-store",
      });

      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        const incoming = json.data as OptionFlow[];

        setFlows((prev) => {
          const seen = new Set(prev.map((f) => f.id));
          const merged = [...prev];

          for (const row of incoming) {
            if (!seen.has(row.id)) merged.push(row);
          }

          return merged;
        });

        if (incoming.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }

      setLoading(false);
      setInitialLoaded(true);
    };

    fetchData();
  }, [page, PAGE_SIZE, setFlows, setHasMore, setLoading, setInitialLoaded]);
}
