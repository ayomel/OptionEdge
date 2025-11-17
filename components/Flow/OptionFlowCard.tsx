import { formatDate } from "@/utils/timeUtils/formatDate";
import { OptionFlow } from "./Flow";

export function OptionFlowCard({ flow }: { flow: OptionFlow }) {
  const isCall = flow.type?.toLowerCase() === "call";
  const premium = (flow.total_premium / 1000).toFixed(0) + "K";

  return (
    <div className="w-full bg-[#1c1f26] rounded-xl p-4 mb-4 text-white shadow-sm">
      <div className="text-xs text-gray-400 mb-1">
        {new Date(flow.created_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xs font-bold px-2 py-1 rounded-md ${
            isCall ? "bg-green-600" : "bg-pink-600"
          }`}
        >
          {flow.ticker}
        </span>

        <span className="text-xl font-bold text-pink-300">${premium}</span>

        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
      </div>

      <div className="h-[1px] w-full bg-gray-700 my-3" />

      <div className="grid grid-cols-3 gap-y-3 text-gray-300 text-xs">
        <div>
          <div className="text-[10px] uppercase">Exp</div>
          <div className="font-medium text-white">{formatDate(flow.expiry)}</div>
        </div>

        <div>
          <div className="text-[10px] uppercase">Strike</div>
          <div className="font-medium text-white">{flow.strike}</div>
        </div>

        <div>
          <div className="text-[10px] uppercase">C/P</div>
          <div className="font-medium text-white">{isCall ? "C" : "P"}</div>
        </div>

        <div>
          <div className="text-[10px] uppercase">Spot</div>
          <div className="font-medium text-white">
            {flow.underlying_price?.toFixed(2)}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase">Type</div>
          <div className="font-medium text-white">
            {flow.has_sweep ? "S" : "—"}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase">Details</div>
          <div className="font-medium text-white">
            {flow.total_size} @ {flow.price}
          </div>
        </div>
      </div>
    </div>
  );
}