import { supabase } from '../supabase';
import type { SkuSeries } from '../../types/skuSeries';

const LOCAL_STORAGE_KEY = 'jorique_sku_series';

// Initial Luxury Series Presets for JORIQUE
const DEFAULT_PRESET_SERIES: SkuSeries[] = [
  {
    id: 'preset-1',
    name: 'Jorique Standard Master',
    prefix: 'JR',
    separator: '-',
    includeYear: true,
    padding: 3,
    currentCounter: 1,
    suffix: '',
    category: '',
    description: 'Standard luxury maison series format (e.g. JR-2026-001)',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'preset-2',
    name: 'Royal Heritage Silk',
    prefix: 'RHS',
    separator: '-',
    includeYear: true,
    padding: 4,
    currentCounter: 1,
    suffix: 'LUX',
    category: 'Bedsheets',
    description: 'Ultra-luxury mulberry silk & 800TC sateen collection',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'preset-3',
    name: 'Artisan Cushion & Drape',
    prefix: 'ART-FAB',
    separator: '-',
    includeYear: false,
    padding: 3,
    currentCounter: 1,
    suffix: '',
    category: 'Home Decor',
    description: 'Handcrafted cushions, drapes, and artisanal accessories',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'preset-4',
    name: 'Limited Edition Vault',
    prefix: 'LTD',
    separator: '-',
    includeYear: true,
    padding: 3,
    currentCounter: 1,
    suffix: 'ED1',
    category: '',
    description: 'Numbered limited editions with custom serial certificates',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

function getLocalSeries(): SkuSeries[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PRESET_SERIES));
      return DEFAULT_PRESET_SERIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRESET_SERIES;
  } catch {
    return DEFAULT_PRESET_SERIES;
  }
}

function saveLocalSeries(seriesList: SkuSeries[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seriesList));
  } catch (err) {
    console.error('Failed to save SKU series to local storage:', err);
  }
}

export async function fetchSkuSeriesList(): Promise<SkuSeries[]> {
  try {
    const { data, error } = await supabase
      .from('sku_series')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Supabase table may not exist yet or is empty; use local storage with default presets
      return getLocalSeries();
    }

    const mapped: SkuSeries[] = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      prefix: item.prefix,
      separator: item.separator ?? '-',
      includeYear: item.include_year ?? true,
      padding: item.padding ?? 3,
      currentCounter: item.current_counter ?? 1,
      suffix: item.suffix ?? '',
      category: item.category ?? '',
      description: item.description ?? '',
      isActive: item.is_active ?? true,
      createdAt: item.created_at || new Date().toISOString(),
    }));

    // Merge with any local series that aren't in Supabase
    saveLocalSeries(mapped);
    return mapped;
  } catch {
    return getLocalSeries();
  }
}

export async function saveSkuSeries(seriesData: Omit<SkuSeries, 'id' | 'createdAt'> & { id?: string }): Promise<SkuSeries> {
  const localList = getLocalSeries();
  const id = seriesData.id || `series-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newSeries: SkuSeries = {
    ...seriesData,
    id,
    createdAt: now,
  };

  // 1. Try Supabase
  try {
    const dbPayload = {
      id: seriesData.id || undefined,
      name: seriesData.name,
      prefix: seriesData.prefix,
      separator: seriesData.separator,
      include_year: seriesData.includeYear,
      padding: seriesData.padding,
      current_counter: seriesData.currentCounter,
      suffix: seriesData.suffix || null,
      category: seriesData.category || null,
      description: seriesData.description || null,
      is_active: seriesData.isActive,
    };

    if (seriesData.id) {
      await supabase.from('sku_series').update(dbPayload).eq('id', seriesData.id);
    } else {
      const { data } = await supabase.from('sku_series').insert(dbPayload).select().maybeSingle();
      if (data?.id) {
        newSeries.id = data.id;
      }
    }
  } catch (err) {
    console.warn('Supabase sku_series write skipped (using local fallback):', err);
  }

  // 2. Persist locally
  const index = localList.findIndex((s) => s.id === newSeries.id);
  let updatedList: SkuSeries[];
  if (index >= 0) {
    updatedList = [...localList];
    updatedList[index] = newSeries;
  } else {
    updatedList = [newSeries, ...localList];
  }
  saveLocalSeries(updatedList);

  return newSeries;
}

export async function incrementSeriesCounter(seriesId: string): Promise<number> {
  const localList = getLocalSeries();
  const index = localList.findIndex((s) => s.id === seriesId);
  let nextCounter = 2;

  if (index >= 0) {
    nextCounter = (localList[index].currentCounter || 1) + 1;
    localList[index].currentCounter = nextCounter;
    saveLocalSeries(localList);
  }

  try {
    await supabase.from('sku_series').update({ current_counter: nextCounter }).eq('id', seriesId);
  } catch {
    // silently ignore if offline/unconfigured
  }

  return nextCounter;
}

export async function deleteSkuSeries(seriesId: string): Promise<void> {
  const localList = getLocalSeries().filter((s) => s.id !== seriesId);
  saveLocalSeries(localList);

  try {
    await supabase.from('sku_series').delete().eq('id', seriesId);
  } catch {
    // silently ignore
  }
}

export async function checkSkuAvailable(sku: string): Promise<{ available: boolean; reason?: string }> {
  const cleanSku = (sku || '').trim().toUpperCase();
  if (!cleanSku || cleanSku.length < 3) {
    return { available: false, reason: 'SKU must be at least 3 characters.' };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, sku')
      .eq('sku', cleanSku)
      .maybeSingle();

    if (error) {
      console.warn('Error checking SKU in Supabase:', error);
      return { available: true };
    }

    if (data) {
      return {
        available: false,
        reason: `SKU "${cleanSku}" is already assigned to "${data.name}".`,
      };
    }

    return { available: true };
  } catch {
    return { available: true };
  }
}
