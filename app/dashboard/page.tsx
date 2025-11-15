import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClerkSupabaseServer } from "../lib/supabase-clerk";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const supabase = await createClerkSupabaseServer();
  const { data: tasks } = await supabase.from("tasks").select().order("id");

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <form action={addTask} className="flex gap-2">
        <input
          name="name"
          placeholder="New task"
          className="border px-3 py-2 rounded"
        />
        <Button type="submit">Add</Button>
      </form>
      <pre className="bg-muted p-4 rounded">
        {JSON.stringify(tasks ?? [], null, 2)}
      </pre>
    </main>
  );
}

export async function addTask(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "");
  const supabase = await createClerkSupabaseServer();
  await supabase.from("tasks").insert({ name });
}
