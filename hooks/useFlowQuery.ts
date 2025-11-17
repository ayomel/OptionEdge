import { useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 1500;

export function useFlows(page: number) {
  return useQuery({
    queryKey: ["flows-today", page],

    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const res = await fetch(`/api/flows/today?from=${from}&to=${to}`, {
        cache: "no-store",
      });

      const json = await res.json();
      return json.data ?? [];
    },

    // optional: keep previous result while loading new page
    placeholderData: (previousData) => previousData,

    refetchOnWindowFocus: false,
  });
}
