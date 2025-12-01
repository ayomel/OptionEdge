export const formatNumber = (value: string | number) => {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "-";
  return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
};