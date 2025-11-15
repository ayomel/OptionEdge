"use client";
import { useUser, useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function TasksClient() {
  const { user } = useUser();
  const { session } = useSession();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      accessToken: async () => (await session?.getToken()) ?? null,
    }
  );

  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase
      .from("tasks")
      .select()
      .then(({ data }) => setTasks(data ?? []));
  }, [user]);

  return <pre>{JSON.stringify(tasks, null, 2)}</pre>;
}
