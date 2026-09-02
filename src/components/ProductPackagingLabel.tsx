import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode128 from './Barcode128';

export interface ProductPackagingLabelProps {
  productName: string;
  sku?: string;
  serialNumber?: string;
  price?: number;
  cost?: number;
  discountPrice?: number;
  badge?: string;
  category?: string;
  brandName?: string;
  tagline?: string;
  showChannels?: boolean;
  showQR?: boolean;
  className?: string;
}

export default function ProductPackagingLabel({
  productName,
  sku = 'BS34-PASSOT',
  serialNumber,
  price = 1882,
  cost,
  discountPrice,
  badge,
  category = 'BED SHEET (DOUBLE BED)',
  brandName = 'JORIQUE',
  tagline = 'WHERE COMFORT MEETS DESIGN',
  showChannels = true,
  showQR = true,
  className = '',
}: ProductPackagingLabelProps) {
  const effectiveSku = sku || serialNumber || 'JRQ-BS-1024';
  const barcodeValue = effectiveSku.toUpperCase();
  const serialSuffix = serialNumber ? serialNumber.split('-').slice(-2).join('') : '001';
  const reviewUrl = `https://jorique.in/review/${serialNumber || effectiveSku}`;

  // Check if discount applies
  const hasDiscount = Boolean(discountPrice && discountPrice > 0 && discountPrice < price);
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice!) / price) * 100) : 0;
  const effectivePrice = hasDiscount ? discountPrice! : price;

  // Format wholesale/retail pricing hash string (e.g. WSP896.19RP94100ST82000HBP87000)
  const calcCost = cost || Math.round(price * 0.48);
  const wsp = (calcCost * 1.02).toFixed(2);
  const rp = Math.round(effectivePrice * 50);
  const st = Math.round(effectivePrice * 44);
  const hbp = Math.round(effectivePrice * 46);
  const discTag = hasDiscount ? `D${discountPercent}` : '';
  const pricingCode = `WSP${wsp}${discTag}RP${rp}ST${st}HBP${hbp}${serialSuffix ? `-${serialSuffix}` : ''}`;

  // Full product descriptor formatted like retail bedding packaging
  const formattedTitle = productName.toUpperCase().includes('BED')
    ? productName.toUpperCase()
    : `${category.toUpperCase()} ${productName.toUpperCase()} - ${effectiveSku}`;

  const formattedOriginalPrice = Number(price).toFixed(2);
  const formattedDiscountedPrice = Number(discountPrice || price).toFixed(2);

  return (
    <div
      className={`bg-white text-black font-sans border-2 border-black/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between select-none shadow-sm relative overflow-hidden max-w-[380px] w-full mx-auto print:border-black print:shadow-none print:m-0 print:break-inside-avoid ${className}`}
      style={{
        aspectRatio: '1.05 / 1',
        minHeight: '320px',
      }}
    >
      {/* 🏷️ OPTIONAL TOP-RIGHT BADGE PILL */}
      {badge && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center gap-1 bg-black text-white text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
            <span>★</span>
            <span>{badge}</span>
          </span>
        </div>
      )}

      {/* 🌿 TOP BRAND HEADER */}
      <div className="flex flex-col items-center justify-center text-center pb-1.5">
        {/* Brand Clover / Luxury Emblem SVG */}
        <div className="w-10 h-10 mb-1 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-9 h-9 fill-[#1B5E20] dark:fill-[#1B5E20]">
            {/* Elegant 4-Leaf Clover / Architectural Crest */}
            <path d="M50 15 C42 0, 25 0, 25 15 C25 28, 45 42, 50 48 C55 42, 75 28, 75 15 Z" />
            <path d="M15 50 C0 42, 0 25, 15 25 C28 25, 42 45, 48 50 C42 55, 28 75, 15 75 C0 75, 0 58, 15 50 Z" />
            <path d="M50 85 C42 100, 25 100, 25 85 C25 72, 45 58, 50 52 C55 58, 75 72, 75 85 C75 100, 58 100, 50 85 Z" />
            <path d="M85 50 C100 42, 100 25, 85 25 C72 25, 58 45, 52 50 C58 55, 72 75, 85 75 C100 75, 100 58, 85 50 Z" />
            <rect x="46" y="46" width="8" height="8" rx="2" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Brand Name with Registered Trademark */}
        <div className="flex items-center justify-center gap-0.5">
          <span className="font-extrabold text-2xl tracking-[0.08em] uppercase text-black font-sans leading-none">
            {brandName}
          </span>
          <span className="text-[9px] font-bold self-start leading-none -mt-0.5">®</span>
        </div>

        <p className="text-[8.5px] font-bold tracking-[0.2em] text-neutral-800 uppercase mt-0.5">
          {tagline}
        </p>

        {/* Optional Marketplace Channel Badges Strip (blinkit, amazon, Flipkart, Myntra) */}
        {showChannels && (
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mt-1.5 pt-1 border-t border-neutral-300 w-full">
            <span className="font-black text-[10px] lowercase tracking-tight text-black">blinkit</span>
            <span className="font-bold text-[10.5px] lowercase tracking-tighter text-black">amazon</span>
            <span className="font-extrabold text-[10px] italic tracking-tight text-blue-900">Flipkart</span>
            <span className="font-black text-[10px] tracking-tight text-pink-700 flex items-center gap-0.5">
              <span className="font-extrabold">M</span>
              <span className="text-[8px] font-semibold uppercase tracking-normal">Myntra</span>
            </span>
          </div>
        )}
      </div>

      {/* 📊 BARCODE (FOR INVENTORY SALE) & QR (FOR E-REVIEW) SECTION */}
      <div className="my-1 text-center flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-full gap-2">
          {/* 1. Barcode: Inventory & Retail POS Sale */}
          <div className={`${showQR ? 'flex-1 pr-1' : 'w-full'} flex flex-col items-center justify-center`}>
            <Barcode128
              value={barcodeValue}
              width={showQR ? 1.05 : 1.35}
              height={showQR ? 32 : 40}
              fontSize={0}
              displayValue={false}
              className="max-w-full"
            />
            <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-black -mt-0.5">
              *{barcodeValue}*
            </p>
            <span className="text-[7px] font-sans font-bold uppercase tracking-wider text-neutral-600">
              Inventory & Sale SKU
            </span>
          </div>

          {/* 2. QR Code: Customer e-Review & Authenticity Reward */}
          {showQR && (
            <div className="pl-2 border-l border-neutral-300 flex flex-col items-center justify-center shrink-0">
              <div className="bg-white p-1 rounded-md border border-neutral-200 shadow-inner">
                <QRCodeSVG
                  value={reviewUrl}
                  size={46}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <span className="text-[7px] font-bold tracking-tight text-black uppercase mt-0.5 text-center leading-tight">
                Scan for<br /><span className="text-[#1B5E20] font-black">e-Review</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 🏷️ PRODUCT DETAILS & DESCRIPTOR */}
      <div className="text-center px-1">
        <p className="font-bold text-[10.5px] sm:text-[11px] uppercase tracking-tight text-black leading-tight line-clamp-2">
          {formattedTitle}
        </p>
        <p className="font-mono font-bold text-[8.5px] tracking-tight text-neutral-800 uppercase mt-0.5 truncate">
          {pricingCode}
        </p>
      </div>

      {/* 💰 MRP, DISCOUNT % & OFFER PRICE SECTION */}
      <div className="text-center pt-1 border-t border-neutral-300">
        {hasDiscount ? (
          <div>
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <span className="text-[10.5px] font-bold text-neutral-500 line-through">
                MRP {formattedOriginalPrice}
              </span>
              <span className="bg-black text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider">
                {discountPercent}% OFF
              </span>
            </div>
            <div className="font-black text-xl sm:text-2xl text-black tracking-tight leading-none">
              {formattedDiscountedPrice}
            </div>
            <p className="text-[7.5px] sm:text-[8px] font-medium text-neutral-700 mt-0.5">
              (Offer Price Inclusive of all Taxes)
            </p>
          </div>
        ) : (
          <div>
            <div className="font-black text-xl sm:text-2xl text-black tracking-tight leading-none">
              {formattedOriginalPrice}
            </div>
            <p className="text-[7.5px] sm:text-[8px] font-medium text-neutral-700 mt-0.5">
              (MRP is Inclusive of all Taxes)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
