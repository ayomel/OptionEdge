import { FILTERS } from "@/components/Flow/constants";

export type FilterKey = (typeof FILTERS)[keyof typeof FILTERS];

export type SortKey =
  | "NONE"
  | "TIME_DESC"
  | "PREMIUM_DESC"
  | "SIZE_DESC"
  | "EXPIRY_ASC";

  export type OptionFlow = {
  id: string;
  ticker: string;
  type: string;
  strike: number;
  expiry: string;
  total_premium: number;
  total_size: number;
  price: number;
  underlying_price: number;
  created_at: string;
  has_sweep: boolean;
};