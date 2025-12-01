import { useQuery } from "@tanstack/react-query";

export function useDarkPoolQuery() {
    return useQuery({
        queryKey: ["darkPool"],
        queryFn: async () => {
            const response = await fetch("/api/darkPool");
            return response.json();
        },
    });
}
