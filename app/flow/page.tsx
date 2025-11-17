import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClerkSupabaseServer } from "../lib/supabase-clerk";
import Flow from "@/components/Flow/Flow";

export default async function FlowPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const supabase = await createClerkSupabaseServer();
  const { data: options } = await supabase
    .from("option_flows")
    .select("*")
    .order("created_at", { ascending: false });

  const clientConfig = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  };

  return <Flow options={options || []} config={clientConfig} />;
}
