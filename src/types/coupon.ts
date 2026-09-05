export interface Coupon {
  id: string;
  code: string; // e.g. WELCOME10, FESTIVE500
  discountType: 'percentage' | 'fixed'; // percentage (%) or fixed (₹)
  discountValue: number; // e.g. 10 (%) or 500 (₹)
  minOrderAmount: number; // Minimum subtotal required
  maxDiscountAmount?: number; // Maximum discount cap for percentage discounts
  usageLimit?: number; // Maximum times this coupon can be used across all orders
  timesUsed: number;
  expiryDate?: string; // ISO date string or YYYY-MM-DD
  isActive: boolean;
  description?: string;
  createdAt: string;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message?: string;
}

export function calculateCouponDiscount(coupon: Coupon, subtotal: number): CouponValidationResult {
  if (!coupon.isActive) {
    return { valid: false, discountAmount: 0, message: `Coupon "${coupon.code}" is currently inactive.` };
  }

  if (coupon.expiryDate) {
    const expiry = new Date(coupon.expiryDate);
    // Set to end of expiry day
    expiry.setHours(23, 59, 59, 999);
    if (new Date() > expiry) {
      return { valid: false, discountAmount: 0, message: `Coupon "${coupon.code}" has expired.` };
    }
  }

  if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
    return { valid: false, discountAmount: 0, message: `Coupon "${coupon.code}" usage limit has been reached.` };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required for "${coupon.code}". (Current: ₹${subtotal.toLocaleString('en-IN')})`,
    };
  }

  let calculatedDiscount = 0;
  if (coupon.discountType === 'percentage') {
    calculatedDiscount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount && calculatedDiscount > coupon.maxDiscountAmount) {
      calculatedDiscount = coupon.maxDiscountAmount;
    }
  } else {
    // Fixed amount
    calculatedDiscount = Math.min(coupon.discountValue, subtotal);
  }

  return {
    valid: true,
    coupon,
    discountAmount: calculatedDiscount,
    message: `Coupon "${coupon.code}" applied! Discount: ₹${calculatedDiscount.toLocaleString('en-IN')}`,
  };
}
