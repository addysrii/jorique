import { supabase } from '../supabase';
import type { Coupon, CouponValidationResult } from '../../types/coupon';
import { calculateCouponDiscount } from '../../types/coupon';

const COUPONS_STORAGE_KEY = 'jorique_coupons';

const DEFAULT_PRESET_COUPONS: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1500,
    maxDiscountAmount: 1000,
    timesUsed: 14,
    isActive: true,
    description: '10% off for first-time walk-in and boutique clients',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'coupon-2',
    code: 'VIP15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 5000,
    maxDiscountAmount: 2500,
    timesUsed: 8,
    isActive: true,
    description: '15% off for VIP collectors & high-volume orders',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'coupon-3',
    code: 'FESTIVE500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 3000,
    timesUsed: 22,
    isActive: true,
    description: 'Flat ₹500 discount on festival & gift collection purchases',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'coupon-4',
    code: 'MAISON1000',
    discountType: 'fixed',
    discountValue: 1000,
    minOrderAmount: 8000,
    timesUsed: 5,
    isActive: true,
    description: 'Flat ₹1,000 privilege reduction on luxury silk & duvet sets',
    createdAt: new Date().toISOString(),
  },
];

function getLocalCoupons(): Coupon[] {
  try {
    const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(DEFAULT_PRESET_COUPONS));
      return DEFAULT_PRESET_COUPONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRESET_COUPONS;
  } catch {
    return DEFAULT_PRESET_COUPONS;
  }
}

function saveLocalCoupons(coupons: Coupon[]): void {
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
  } catch (err) {
    console.error('Failed to save coupons to local storage:', err);
  }
}

export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalCoupons();
    }

    const mapped: Coupon[] = data.map((item: any) => ({
      id: item.id,
      code: item.code,
      discountType: item.discount_type || 'percentage',
      discountValue: Number(item.discount_value) || 0,
      minOrderAmount: Number(item.min_order_amount) || 0,
      maxDiscountAmount: item.max_discount_amount ? Number(item.max_discount_amount) : undefined,
      usageLimit: item.usage_limit ? Number(item.usage_limit) : undefined,
      timesUsed: Number(item.times_used) || 0,
      expiryDate: item.expiry_date || undefined,
      isActive: item.is_active ?? true,
      description: item.description || '',
      createdAt: item.created_at || new Date().toISOString(),
    }));

    saveLocalCoupons(mapped);
    return mapped;
  } catch {
    return getLocalCoupons();
  }
}

export async function saveCoupon(couponData: Omit<Coupon, 'id' | 'createdAt' | 'timesUsed'> & { id?: string; timesUsed?: number }): Promise<Coupon> {
  const localList = getLocalCoupons();
  const id = couponData.id || `coupon-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newCoupon: Coupon = {
    ...couponData,
    id,
    timesUsed: couponData.timesUsed || 0,
    createdAt: now,
  };

  try {
    const dbPayload = {
      id: couponData.id || undefined,
      code: couponData.code.trim().toUpperCase(),
      discount_type: couponData.discountType,
      discount_value: couponData.discountValue,
      min_order_amount: couponData.minOrderAmount,
      max_discount_amount: couponData.maxDiscountAmount || null,
      usage_limit: couponData.usageLimit || null,
      times_used: newCoupon.timesUsed,
      expiry_date: couponData.expiryDate || null,
      is_active: couponData.isActive,
      description: couponData.description || null,
    };

    if (couponData.id) {
      await supabase.from('coupons').update(dbPayload).eq('id', couponData.id);
    } else {
      const { data } = await supabase.from('coupons').insert(dbPayload).select().maybeSingle();
      if (data?.id) newCoupon.id = data.id;
    }
  } catch (err) {
    console.warn('Supabase coupons write skipped (using local fallback):', err);
  }

  const idx = localList.findIndex((c) => c.id === newCoupon.id);
  let updatedList: Coupon[];
  if (idx >= 0) {
    updatedList = [...localList];
    updatedList[idx] = newCoupon;
  } else {
    updatedList = [newCoupon, ...localList];
  }
  saveLocalCoupons(updatedList);

  return newCoupon;
}

export async function deleteCoupon(couponId: string): Promise<void> {
  const localList = getLocalCoupons().filter((c) => c.id !== couponId);
  saveLocalCoupons(localList);

  try {
    await supabase.from('coupons').delete().eq('id', couponId);
  } catch {
    // silently ignore
  }
}

export async function incrementCouponUsage(code: string): Promise<void> {
  const cleanCode = code.trim().toUpperCase();
  const localList = getLocalCoupons();
  const target = localList.find((c) => c.code.toUpperCase() === cleanCode);

  if (target) {
    target.timesUsed = (target.timesUsed || 0) + 1;
    saveLocalCoupons(localList);

    try {
      await supabase
        .from('coupons')
        .update({ times_used: target.timesUsed })
        .eq('id', target.id);
    } catch {
      // silently ignore
    }
  }
}

export async function validateCouponCode(code: string, subtotal: number): Promise<CouponValidationResult> {
  const cleanCode = (code || '').trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, discountAmount: 0, message: 'Please enter a coupon code.' };
  }

  const coupons = await fetchCoupons();
  const match = coupons.find((c) => c.code.toUpperCase() === cleanCode);

  if (!match) {
    return { valid: false, discountAmount: 0, message: `Coupon code "${cleanCode}" is invalid.` };
  }

  return calculateCouponDiscount(match, subtotal);
}
