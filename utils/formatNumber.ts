export function formatNumber(num: number, precision: number = 0): string {
  const formatter = Intl.NumberFormat("th-TH", {
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  });
  return formatter.format(num);
}
