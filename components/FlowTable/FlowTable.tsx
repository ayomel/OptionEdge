/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@supabase/supabase-js";
import useRealtimeSubscriptionSupabase from "@/hooks/useRealtimeSubscriptionSupabase";
import { useSupabase } from "@/hooks/useSupabase";

type OptionFlow = {
  id: string;
  ticker: string;
  option_chain: string;
  type: "call" | "put";
  strike: number;
  expiry: string | null;
  total_premium?: number;
  volume?: number;
  open_interest?: number;
  volume_oi_ratio?: number;
  iv_start?: number;
  price?: number;
  underlying_price?: number;
  alert_rule?: string;
};

export interface Props {
  supabaseConfig: { supabaseUrl: string; supabaseAnonKey: string };
  data: OptionFlow[];
}

export default function ClientFlowTable({ data, supabaseConfig }: Props) {
  const [rowsData, setRowsData] = useState<OptionFlow[]>(data);
  const [sort, setSort] = useState<{
    key: keyof OptionFlow;
    dir: "asc" | "desc";
  } | null>(null);
  const [filter, setFilter] = useState("");

  const supabase = useSupabase(supabaseConfig);
  useRealtimeSubscriptionSupabase(supabase, setRowsData);

  const rows = useMemo(() => {
    const filtered = rowsData.filter((r) => {
      const q = filter.toLowerCase();
      return (
        r.ticker?.toLowerCase().includes(q) ||
        r.alert_rule?.toLowerCase().includes(q) ||
        r.option_chain?.toLowerCase().includes(q)
      );
    });

    if (!sort) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sort.key] as any;
      const bVal = b[sort.key] as any;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sort.dir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sort.dir === "asc"
        ? String(aVal ?? "").localeCompare(String(bVal ?? ""))
        : String(bVal ?? "").localeCompare(String(aVal ?? ""));
    });
  }, [rowsData, filter, sort]);

  const dateFmt = (d?: string | null) =>
    d ? format(new Date(d), "MMM d, yyyy") : "—";
  const reqSort = (key: keyof OptionFlow) =>
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );

  return (
    <div className="space-y-4 px-2 sm:px-4">
      <h1 className="text-2xl font-semibold text-center sm:text-left">
        Options Flow
      </h1>

      <div className="flex justify-center sm:justify-start">
        <Input
          placeholder="Filter by ticker, alert rule, or chain…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:max-w-md"
        />
      </div>

      <Card className="shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px] sm:min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead
                    label="Ticker"
                    onClick={() => reqSort("ticker")}
                  />
                  <SortableHead label="Type" onClick={() => reqSort("type")} />
                  <SortableHead
                    label="Strike"
                    onClick={() => reqSort("strike")}
                  />
                  <SortableHead
                    label="Expiry"
                    onClick={() => reqSort("expiry")}
                  />
                  <SortableHead
                    label="Premium ($)"
                    onClick={() => reqSort("total_premium")}
                  />
                  <SortableHead
                    label="Volume/OI"
                    onClick={() => reqSort("volume")}
                  />
                  <SortableHead
                    label="IV (%)"
                    onClick={() => reqSort("iv_start")}
                  />
                  <SortableHead
                    label="Price ($)"
                    onClick={() => reqSort("price")}
                  />
                  <SortableHead
                    label="Underlying ($)"
                    onClick={() => reqSort("underlying_price")}
                  />
                  <SortableHead
                    label="Alert Rule"
                    onClick={() => reqSort("alert_rule")}
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} className="text-xs sm:text-sm">
                    <TableCell className="font-medium">{r.ticker}</TableCell>
                    <TableCell>
                      <Badge
                        variant={r.type === "call" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {r.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.strike ?? "—"}</TableCell>
                    <TableCell>{dateFmt(r.expiry)}</TableCell>
                    <TableCell>
                      {r.total_premium != null
                        ? `$${r.total_premium.toLocaleString()}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {r.volume ?? 0} / {r.open_interest ?? 0} (
                      {r.volume_oi_ratio != null
                        ? r.volume_oi_ratio.toFixed(2)
                        : "0.00"}
                      )
                    </TableCell>
                    <TableCell>
                      {r.iv_start != null
                        ? `${(r.iv_start * 100).toFixed(2)}%`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {r.price != null ? `$${r.price.toFixed(2)}` : "—"}
                    </TableCell>
                    <TableCell>
                      {r.underlying_price != null
                        ? `$${r.underlying_price.toFixed(2)}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.alert_rule ?? "—"}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No matching records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SortableHead({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <TableHead
      className="cursor-pointer select-none whitespace-nowrap"
      onClick={onClick}
    >
      <div className="flex items-center justify-center sm:justify-start gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
      </div>
    </TableHead>
  );
}
