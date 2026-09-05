export interface SkuSeries {
  id: string;
  name: string;
  prefix: string;
  separator: string; // '-', '_', '/', ''
  includeYear: boolean;
  padding: number; // e.g. 3 => 001, 4 => 0001
  currentCounter: number;
  suffix?: string;
  category?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export function formatSeriesSku(
  series: Pick<SkuSeries, 'prefix' | 'separator' | 'includeYear' | 'padding' | 'suffix'>,
  counter: number,
  year: number = new Date().getFullYear()
): string {
  const sep = series.separator !== undefined ? series.separator : '-';
  const parts: string[] = [];

  const cleanPrefix = (series.prefix || 'SKU')
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9_-]/gi, '');
  parts.push(cleanPrefix);

  if (series.includeYear) {
    parts.push(String(year));
  }

  const paddedNum = String(Math.max(1, counter)).padStart(Math.max(1, series.padding || 3), '0');
  parts.push(paddedNum);

  if (series.suffix && series.suffix.trim()) {
    const cleanSuffix = series.suffix
      .toUpperCase()
      .trim()
      .replace(/[^A-Z0-9_-]/gi, '');
    if (cleanSuffix) parts.push(cleanSuffix);
  }

  return parts.join(sep);
}

export function generateSeriesSample(
  series: Pick<SkuSeries, 'prefix' | 'separator' | 'includeYear' | 'padding' | 'suffix' | 'currentCounter'>,
  count = 3,
  year: number = new Date().getFullYear()
): string[] {
  const start = series.currentCounter || 1;
  return Array.from({ length: count }, (_, i) =>
    formatSeriesSku(series, start + i, year)
  );
}
