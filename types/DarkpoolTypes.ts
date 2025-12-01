export type DarkPoolTrade = {
  id?: number | string;
  size: number;
  ticker: string;
  price: string;
  volume: number;
  executed_at: string;
  premium: string;
  nbbo_ask?: string | null;
  nbbo_bid?: string | null;
  canceled: boolean;
  ext_hour_sold_codes?: string | null;
  market_center?: string | null;
};