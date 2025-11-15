import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClerkSupabaseServer } from "../lib/supabase-clerk";
import ClientFlowTable from "@/components/FlowTable/FlowTable";

export default async function Flow() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  // ✅ Server-side Supabase client for initial data
  const supabase = await createClerkSupabaseServer();
  const { data: options } = await supabase
    .from("option_flows")
    .select("*")
    .order("created_at", { ascending: false });

  // ✅ Client-side Supabase credentials for real-time
  // These env vars must start with NEXT_PUBLIC_ so they can be used in the browser
  const clientConfig = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  };

  return <ClientFlowTable data={options || []} supabaseConfig={clientConfig} />;
}
