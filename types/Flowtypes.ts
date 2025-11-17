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
  all_opening_trades: boolean;
};

export const FILTERS = {
  EXPIRING_SOON: "EXPIRING_SOON",
  SWEEPS_ONLY: "SWEEPS_ONLY",
  PREMIUM_BIG: "PREMIUM_BIG",
  ALL_OPENING_TRADES: "ALL_OPENING_TRADES",
};