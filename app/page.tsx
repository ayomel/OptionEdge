import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Hello 👋</h1>
      <div className="mt-6 flex gap-3">
        <Link href="/flow">
          <Button>Options Flow</Button>
        </Link>
        <Link href="/sign-in">
          <Button variant="outline">Sign in</Button>
        </Link>
      </div>
    </main>
  );
}
