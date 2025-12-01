import { DarkPoolTrade } from "@/types/DarkpoolTypes";
import { formatCurrency } from "@/utils/numberUtils/formatCurrency";
import { formatNumber } from "@/utils/numberUtils/formatNumber";
import { formatTime } from "@/utils/timeUtils/formatTime";
import { formatDate } from "@/utils/timeUtils/formatDate";

export default function DarkPoolCard({ trade }: { trade: DarkPoolTrade }) {
  const premium = formatCurrency(trade.premium);
  const price = formatCurrency(trade.price);
  const vol = formatNumber(trade.volume);
  const size = formatNumber(trade.size);
  const nbboBid = trade.nbbo_bid ? formatCurrency(trade.nbbo_bid) : "-";
  const nbboAsk = trade.nbbo_ask ? formatCurrency(trade.nbbo_ask) : "-";

  return (
    <div className="w-full rounded-2xl bg-[#050712] px-4 py-3 text-white shadow-md border border-white/5">
      {/* Top row: ticker + time + badges */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold tracking-wide">
            {trade.ticker}
          </span>
          {trade.market_center && (
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] uppercase text-indigo-200">
              {trade.market_center}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <span>{formatDate(trade.executed_at)}</span>
          <span>·</span>
          <span>{formatTime(trade.executed_at)} ET</span>
        </div>
      </div>

      {/* Size / price / premium */}
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase text-gray-400">Block size</span>
          <span className="text-lg font-semibold">{size}</span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[11px] uppercase text-gray-400">Notional</span>
          <span className="text-lg font-semibold text-emerald-300">
            {premium}
          </span>
        </div>
      </div>

      {/* Price + NBBO */}
      <div className="mb-2 grid grid-cols-3 gap-2 text-xs">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-400">Print</span>
          <span className="font-medium">{price}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-400">
            NBBO Bid / Ask
          </span>
          <span className="font-medium">
            {nbboBid} / {nbboAsk}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase text-gray-400">Tape Vol</span>
          <span className="font-medium">{vol}</span>
        </div>
      </div>

      {/* Flags row */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {trade.ext_hour_sold_codes && (
            <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium text-yellow-300">
              EXTENDED HOURS
            </span>
          )}
          {trade.canceled && (
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-300">
              CANCELED
            </span>
          )}
        </div>
      </div>
    </div>
  );
}