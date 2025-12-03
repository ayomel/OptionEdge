import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { DarkPoolTrade } from "@/types/DarkpoolTypes";

export function useDarkPoolQuery() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel("dark_pool_realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "dark_pool",
                },
                (payload) => {
                    const newTrade = payload.new as DarkPoolTrade;
                    queryClient.setQueryData<DarkPoolTrade[]>(["darkPool"], (oldData) => {
                        if (!oldData) return [newTrade];
                        // Handle both array and object wrapper cases based on existing usage
                        const currentTrades = Array.isArray(oldData)
                            ? oldData
                            : (oldData as any).data || [];

                        return [newTrade, ...currentTrades];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

    return useQuery({
        queryKey: ["darkPool"],
        queryFn: async () => {
            const response = await fetch("/api/darkPool");
            return response.json();
        },
    });
}
