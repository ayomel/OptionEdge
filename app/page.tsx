import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center w-full max-w-3xl px-4 sm:px-6 mt-20 sm:mt-28">
        <h1 className="text-3xl sm:text-6xl font-extrabold leading-tight">
          Real-Time Options Flow,
          <span className="text-blue-400"> Made Simple.</span>
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-300 leading-relaxed">
          Track unusual options activity, spot smart money moves, and get
          actionable insights — all in one clean dashboard.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/flow" className="w-full sm:w-auto">
            <Button className="w-full text-base sm:text-lg py-4 sm:py-6">
              Launch Options Flow
            </Button>
          </Link>

          <Link href="/sign-in" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full text-base sm:text-lg py-4 sm:py-6 border-gray-500 text-gray-200 hover:bg-gray-800"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="mt-20 sm:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 px-4 sm:px-6 max-w-5xl w-full mb-20">
        <div className="bg-[#161b22] p-5 sm:p-6 rounded-xl shadow-lg border border-gray-800">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
            Unusual Flow
          </h3>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Instantly catch aggressive sweeps, blocks, and dark pool moves.
          </p>
        </div>

        <div className="bg-[#161b22] p-5 sm:p-6 rounded-xl shadow-lg border border-gray-800">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
            Live Updates
          </h3>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Stream real-time options flow with no refresh needed.
          </p>
        </div>

        <div className="bg-[#161b22] p-5 sm:p-6 rounded-xl shadow-lg border border-gray-800">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
            Smart Filters
          </h3>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Sort by premium, expiration, direction, and more in seconds.
          </p>
        </div>
      </section>
    </main>
  );
}
