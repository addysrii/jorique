import { supabase } from '../supabase';
import type { SkuSeries } from '../../types/skuSeries';

const LOCAL_STORAGE_KEY = 'jorique_sku_series';

function getLocalSeries(): SkuSeries[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const realOnly = Array.isArray(parsed) ? parsed.filter(s => !s.id?.startsWith('preset-')) : [];
    return realOnly;
  } catch {
    return [];
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

    if (error) {
      console.warn('[skuSeriesStorage] Supabase fetch error (using local storage fallback):', error.message || error);
      return getLocalSeries();
    }

    const mapped: SkuSeries[] = (data || []).map((item: any) => ({
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

    // Auto-sync: if Supabase table is live, upload any locally saved series that are not yet in Supabase
    const localList = getLocalSeries();
    const unsynced = localList.filter(
      (local) => !mapped.some((db) => db.id === local.id || (db.name.toLowerCase() === local.name.toLowerCase() && db.prefix === local.prefix))
    );

    if (unsynced.length > 0) {
      for (const item of unsynced) {
        try {
          const { data: inserted, error: insertErr } = await supabase
            .from('sku_series')
            .insert({
              name: item.name,
              prefix: item.prefix,
              separator: item.separator,
              include_year: item.includeYear,
              padding: item.padding,
              current_counter: item.currentCounter,
              suffix: item.suffix || null,
              category: item.category || null,
              description: item.description || null,
              is_active: item.isActive,
            })
            .select()
            .maybeSingle();

          if (!insertErr && inserted) {
            mapped.unshift({
              id: inserted.id,
              name: inserted.name,
              prefix: inserted.prefix,
              separator: inserted.separator ?? '-',
              includeYear: inserted.include_year ?? true,
              padding: inserted.padding ?? 3,
              currentCounter: inserted.current_counter ?? 1,
              suffix: inserted.suffix ?? '',
              category: inserted.category ?? '',
              description: inserted.description ?? '',
              isActive: inserted.is_active ?? true,
              createdAt: inserted.created_at || new Date().toISOString(),
            });
          }
        } catch {
          // ignore individual sync errors
        }
      }
    }

    // Persist full synchronized list locally
    saveLocalSeries(mapped);
    return mapped;
  } catch (err) {
    console.warn('[skuSeriesStorage] Unexpected error fetching SKU series, fallback to local:', err);
    return getLocalSeries();
  }
}

export async function saveSkuSeries(seriesData: Omit<SkuSeries, 'id' | 'createdAt'> & { id?: string }): Promise<SkuSeries> {
  const localList = getLocalSeries();
  const isValidUuid = Boolean(
    seriesData.id &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(seriesData.id)
  );
  let id = seriesData.id || `series-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const dbPayload = {
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

  // 1. Try Supabase
  try {
    if (isValidUuid) {
      const { error } = await supabase.from('sku_series').update(dbPayload).eq('id', seriesData.id);
      if (error) {
        console.warn('Supabase sku_series update warning:', error);
      }
    } else {
      const { data, error } = await supabase.from('sku_series').insert(dbPayload).select().maybeSingle();
      if (error) {
        console.warn('Supabase sku_series insert warning:', error);
      } else if (data?.id) {
        id = data.id;
      }
    }
  } catch (err) {
    console.warn('Supabase sku_series write skipped (using local fallback):', err);
  }

  const newSeries: SkuSeries = {
    ...seriesData,
    id,
    createdAt: now,
  };

  // 2. Persist locally
  const index = localList.findIndex((s) => s.id === newSeries.id || s.name.toLowerCase() === newSeries.name.toLowerCase());
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
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(seriesId);
    if (isValidUuid) {
      await supabase.from('sku_series').update({ current_counter: nextCounter }).eq('id', seriesId);
    }
  } catch {
    // silently ignore if offline/unconfigured
  }

  return nextCounter;
}

export async function deleteSkuSeries(seriesId: string): Promise<void> {
  const localList = getLocalSeries().filter((s) => s.id !== seriesId);
  saveLocalSeries(localList);

  try {
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(seriesId);
    if (isValidUuid) {
      await supabase.from('sku_series').delete().eq('id', seriesId);
    }
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
