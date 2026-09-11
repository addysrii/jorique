import React from 'react';
import Barcode128 from './Barcode128';
import { QRCodeSVG } from 'qrcode.react';

export interface ProductPackagingLabelProps {
  productName: string;
  sku?: string;
  serialNumber?: string;
  price?: number;
  cost?: number;
  discountPrice?: number;
  badge?: string;
  category?: string;
  subcategory?: string;
  size?: string;
  tags?: string[] | string;
  brandName?: string;
  tagline?: string;
  showQR?: boolean;
  className?: string;
}

export default function ProductPackagingLabel({
  productName = 'DESIGNER RAW SILK UNSTITCHED SUIT - ROYAL NAVY BLUE',
  sku = 'JR-LUX-WU-001-0001',
  serialNumber,
  price = 3799,
  discountPrice,
  badge = 'LUXURY ATELIER',
  category = 'Suits',
  subcategory = 'Unstitched Suit',
  size,
  tags = [],
  brandName = 'JORIQUE',
  tagline = 'WHERE COMFORT MEETS DESIGN.',
  showQR = true,
  className = '',
}: ProductPackagingLabelProps) {
  const unitSku = (serialNumber || sku || 'JR-LUX-WU-001-0001').toUpperCase();
  const effectivePrice = Number(discountPrice || price || 0);
  const formattedPrice = effectivePrice.toLocaleString('en-IN', {
    minimumFractionDigits: effectivePrice % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  const cleanBadge = (badge || '').replace(/[★*✦•]/g, '').trim();

  const scanUrl = `${
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://jorique.in'
  }/scan?serial=${encodeURIComponent(unitSku)}`;

  return (
    <div
      className={`relative w-full max-w-[560px] mx-auto select-none rounded-[24px] p-2 sm:p-2.5 border border-[#C5AE82] shadow-xl bg-[#F5EDE3] text-[#11312D] print:shadow-none print:m-0 print:break-inside-avoid ${className}`}
      style={{
        boxShadow: '0 12px 35px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Inner Inset Fine Gold Frame ── */}
      <div className="relative border border-[#D0BD97] rounded-[18px] overflow-hidden bg-[#F5EDE3] flex flex-col justify-between">
        
        {/* ── Main Content Area ── */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          
          {/* 1. Header: Brand Logo & Tagline */}
          <div className="text-center">
            <h1 className="font-serif font-normal text-3xl sm:text-4xl tracking-[0.20em] uppercase text-[#11312D] leading-none">
              {brandName}
            </h1>

            {/* Gold Separator Line under Logo */}
            <div className="w-full max-w-[340px] mx-auto h-[1px] bg-[#CBB58F] mt-2 mb-1.5" />

            {/* Tagline (Pure Black) */}
            <p className="font-sans text-[9px] sm:text-[10px] font-semibold tracking-[0.26em] text-black uppercase">
              {tagline}
            </p>

            {/* Optional Badge without stars */}
            {cleanBadge && (
              <div className="flex justify-center mt-2">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[8.5px] sm:text-[9px] font-bold tracking-[0.18em] uppercase bg-[#EFE7D8] border border-[#C5AE82] text-[#8E7345] shadow-xs">
                  <span>{cleanBadge}</span>
                </span>
              </div>
            )}

            {/* 2. Product Name */}
            <h2 className="font-sans font-bold text-base sm:text-lg tracking-[0.12em] uppercase text-[#11312D] mt-2 mb-1 px-2 leading-snug">
              {productName}
            </h2>
          </div>

          {/* Clean Dotted Divider (No Central Diamond) */}
          <div className="my-2.5 border-t border-dotted border-[#CBB58F]" />

          {/* 3. Category, Subcategory & Size Box */}
          <div className={`grid ${size ? 'grid-cols-3' : 'grid-cols-2'} gap-2 text-center my-1`}>
            <div className="border border-[#D9C8A8] rounded-xl p-2 bg-[#F6F0E6]/60">
              <span className="block text-[8px] sm:text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#9E8254] font-sans">
                CATEGORY
              </span>
              <span className="block text-xs sm:text-[13px] font-semibold text-[#11312D] mt-0.5 capitalize truncate">
                {category}
              </span>
            </div>

            <div className="border border-[#D9C8A8] rounded-xl p-2 bg-[#F6F0E6]/60">
              <span className="block text-[8px] sm:text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#9E8254] font-sans">
                SUBCATEGORY
              </span>
              <span className="block text-xs sm:text-[13px] font-semibold text-[#11312D] mt-0.5 capitalize truncate">
                {subcategory || category}
              </span>
            </div>

            {size && (
              <div className="border border-[#D9C8A8] rounded-xl p-2 bg-[#F6F0E6]/60">
                <span className="block text-[8px] sm:text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#9E8254] font-sans">
                  SIZE
                </span>
                <span className="block text-xs sm:text-[13px] font-bold text-[#11312D] mt-0.5 uppercase tracking-wider truncate">
                  {size}
                </span>
              </div>
            )}
          </div>

          {/* Clean Dotted Divider (No Central Diamond) */}
          <div className="my-2.5 border-t border-dotted border-[#CBB58F]" />

          {/* 5. Perfectly Placed Price & Barcode/QR Section */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-stretch">
            
            {/* Price Box - Dedicated & Spacious (No Overflow!) */}
            <div className="sm:col-span-5 border border-[#CBB58F] rounded-xl p-3 bg-[#F5EDE3] shadow-xs flex flex-col items-center justify-center text-center">
              <span className="block text-[8px] sm:text-[8.5px] font-bold uppercase tracking-[0.18em] font-sans text-[#9E8254]">
                MAXIMUM RETAIL PRICE
              </span>
              <div className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#11312D] my-1 leading-none">
                ₹ {formattedPrice}
              </div>
              <span className="block text-[7px] sm:text-[7.5px] font-sans text-[#7A746C]">
                (Inclusive of all taxes)
              </span>
            </div>

            {/* Barcode & SKU Box */}
            <div className="sm:col-span-7 flex flex-col items-center justify-center bg-white rounded-xl p-2.5 border border-black/10 shadow-xs">
              <div className="w-full flex items-center justify-center gap-3">
                <div className="flex-1 flex flex-col items-center overflow-hidden">
                  <Barcode128
                    value={unitSku}
                    width={1.25}
                    height={38}
                    fontSize={0}
                    displayValue={false}
                    className="max-w-full"
                  />
                </div>
                {showQR && (
                  <div className="shrink-0 p-1 border border-black/10 rounded-lg bg-white flex flex-col items-center shadow-xs">
                    <QRCodeSVG
                      value={scanUrl}
                      size={40}
                      level="M"
                    />
                    <span className="text-[5.5px] font-bold uppercase tracking-wider text-black/60 mt-0.5">
                      SCAN
                    </span>
                  </div>
                )}
              </div>
              <p className="font-sans text-[8px] sm:text-[8.5px] font-semibold tracking-[0.18em] text-[#9E8254] mt-1.5 uppercase text-center leading-none">
                SCAN BARCODE FOR DETAILS
              </p>
            </div>

          </div>

        </div>

        {/* ════════ BOTTOM FOOTER STRIP ════════ */}
        <div className="py-2.5 px-4 flex items-center justify-center border-t border-[#CDBA96] bg-[#0E2E2A] text-[#D4C3A3] rounded-b-[17px]">
          {/* Center Brand Philosophy & URL */}
          <div className="flex items-center gap-2 text-center">
            <span className="font-sans font-semibold tracking-[0.24em] text-[8px] sm:text-[9px] uppercase">
              CRAFTED FOR BEAUTIFUL LIVING.
            </span>
            <span className="opacity-60 text-xs">|</span>
            <span className="font-sans font-medium tracking-[0.16em] text-[7.5px] sm:text-[8.5px] lowercase opacity-95">
              www.jorique.in
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
