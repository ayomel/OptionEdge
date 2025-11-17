import { OptionFlow } from "@/types/Flowtypes";

export function getFillTypeUW(trade: OptionFlow): string {
  const price = trade.price;
  const bid = trade.bid;
  const ask = trade.ask;

  if (!price || bid == null || ask == null) return "unknown";

  if (price > ask) return "above_ask";
  if (price === ask) return "at_ask";
  if (price > bid && price < ask) return "mid";
  if (price === bid) return "at_bid";
  if (price < bid) return "below_bid";

  return "unknown";
}
