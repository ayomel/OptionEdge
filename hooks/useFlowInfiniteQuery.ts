import { OptionFlow } from "@/types/Flowtypes";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 1500;

export function useFlowsInfinite() {
  return useInfiniteQuery<OptionFlow[]>({
    queryKey: ["flows-today"],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = (pageParam as number) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const res = await fetch(`/api/flows/today?from=${from}&to=${to}`, {
        cache: "no-store",
      });

      const json = await res.json();
      return (json.data as OptionFlow[]) ?? [];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length; // next page index
    },
    refetchOnWindowFocus: false,
  });
}
