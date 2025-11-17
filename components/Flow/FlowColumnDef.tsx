import { OptionFlow } from "@/types/Flowtypes";
import { formatPremium } from "@/utils/numberUtils/formatPremium";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const useFlowColumns = () => {
  return useMemo<ColumnDef<OptionFlow>[]>(
    () => [
      {
        header: "Ticker",
        accessorKey: "ticker",
        cell: (info) => (
          <span className="font-semibold">{info.getValue<string>()}</span>
        ),
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => {
          const isCall = row.original.type?.toLowerCase() === "call";
          return (
            <span className={isCall ? "text-green-400" : "text-pink-400"}>
              {row.original.type.toUpperCase()}
            </span>
          );
        },
      },
      {
        header: "Strike",
        accessorKey: "strike",
        cell: (info) => info.getValue<number>().toFixed(2),
      },
      {
        header: "Expiry",
        accessorKey: "expiry",
        cell: (info) => info.getValue<string>(),
      },
      {
        header: "Premium (K)",
        accessorKey: "total_premium",
        cell: (info) => {
          const val = info.getValue<number>();
          return formatPremium(val);
        },
      },
      {
        header: "Size",
        accessorKey: "total_size",
      },
      {
        header: "Price",
        accessorKey: "price",
        cell: (info) => info.getValue<number>().toFixed(2),
      },
      {
        header: "Underlying",
        accessorKey: "underlying_price",
        cell: (info) => info.getValue<number>().toFixed(2),
      },
      {
        header: "Sweep",
        accessorKey: "has_sweep",
        cell: (info) =>
          info.getValue<boolean>() ? (
            <span className="px-2 py-1 rounded-full text-[10px] bg-pink-600 text-white">
              SWEEP
            </span>
          ) : (
            ""
          ),
      },
      {
        header: "Time",
        id: "time",
        cell: ({ row }) =>
          new Date(row.original.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
      },
    ],
    []
  );
};
