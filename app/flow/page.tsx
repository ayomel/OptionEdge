import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Flow from "@/components/Flow/Flow";

export default async function FlowPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  return <Flow />;
}
