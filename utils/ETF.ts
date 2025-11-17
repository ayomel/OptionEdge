// Simple ETF detector
export const ETF_TICKERS = new Set([
  "SPY","QQQ","IWM","DIA","GLD","SLV","UVXY","UVIX","VXX","VTI","VOO","SMH",
  "SOXX","BITO","IBIT","ETHA","ARKK","ARKW","XLF","XLI","XLE","XLK","XLU",
  "SQQQ","TQQQ","SOXL","SOXS","LABU","LABD"
]);

const isETF = (ticker: string) => ETF_TICKERS.has(ticker.toUpperCase());
export default isETF;