import React from 'react';
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
  description?: string;
  size?: string;
  fabric?: string;
  threadCount?: string;
  priceCategory?: string;
  showChannels?: boolean;
  showQR?: boolean;
  className?: string;
}

export default function ProductPackagingLabel({
  productName = 'HERITAGE ROYAL BED SHEET',
  sku = 'JR-BS-400-01',
  serialNumber,
  price = 1899,
  discountPrice,
  category = 'Double Bedsheet',
  brandName = 'JORIQUE',
  tagline = 'WHERE COMFORT MEETS DESIGN.',
  description = 'Handcrafted from 100% certified organic long-staple cotton, offering unrivaled softness and timeless elegance for your sanctuary.',
  size = '274 x 274 cm / 108 x 108 in',
  fabric = '100% Cotton',
  threadCount = '400 TC',
  priceCategory = 'Standard Retail',
  className = '',
}: ProductPackagingLabelProps) {
  const effectiveSku = sku || serialNumber || 'JR-BS-400-01';
  const barcodeValue = effectiveSku.toUpperCase();
  const displayPrice = Number(discountPrice || price).toFixed(2);

  return (
    <div
      className={`relative w-full max-w-[700px] mx-auto bg-[#FAF6F0] text-[#1A1A1A] select-none rounded-[26px] p-2.5 sm:p-3 border-[1.5px] border-[#C6A96B]/60 shadow-xl overflow-hidden print:shadow-none print:m-0 print:break-inside-avoid ${className}`}
      style={{
        boxShadow: '0 12px 35px rgba(0,0,0,0.06), 0 2px 6px rgba(198,169,107,0.15)',
      }}
    >
      {/* ── Inner Inset Fine Gold Border Line ── */}
      <div className="relative border border-[#C6A96B]/40 rounded-[20px] bg-[#FCFAF7] overflow-hidden flex flex-col justify-between">
        
        {/* ── Main Two-Column Content Grid ── */}
        <div className="grid grid-cols-12 gap-0">
          
          {/* ════════ LEFT COLUMN (65%) ════════ */}
          <div className="col-span-12 md:col-span-8 p-4 sm:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#C6A96B]/30">
            
            {/* Top Brand Block */}
            <div className="text-center pb-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-[0.20em] uppercase text-[#1A1A1A] leading-none mb-1">
                {brandName}
              </h1>
              
              <div className="flex items-center justify-center gap-2 my-1">
                <span className="h-[0.75px] w-8 sm:w-14 bg-[#C6A96B]/70" />
                <p className="font-serif text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] text-[#8A847D] uppercase">
                  {tagline}
                </p>
                <span className="h-[0.75px] w-8 sm:w-14 bg-[#C6A96B]/70" />
              </div>

              {/* Product Name */}
              <h2 className="font-serif text-base sm:text-lg font-bold tracking-[0.14em] uppercase text-[#1A1A1A] mt-2.5">
                {productName}
              </h2>

              {/* Product Description */}
              <div className="mt-1.5 px-2">
                <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-[#C6A96B] mb-0.5 font-sans">
                  PRODUCT DESCRIPTION
                </span>
                <p className="font-serif italic text-[11px] sm:text-[12px] leading-snug text-[#4A453E] max-w-md mx-auto">
                  {description}
                </p>
              </div>
            </div>

            {/* Dotted Decorative Divider with Central Diamond */}
            <div className="relative my-2.5 flex items-center justify-center">
              <div className="w-full border-t border-dotted border-[#C6A96B]/60" />
              <div className="absolute px-2 bg-[#FCFAF7] text-[#C6A96B] text-[9px]">
                ❖
              </div>
            </div>

            {/* 4-Column Technical Specification Grid */}
            <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center my-1">
              
              {/* 1. Size */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 flex items-center justify-center text-[#C6A96B] mb-1">
                  {/* Tape measure icon */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.2]">
                    <rect x="2" y="5" width="20" height="14" rx="3" />
                    <line x1="6" y1="5" x2="6" y2="10" />
                    <line x1="10" y1="5" x2="10" y2="8" />
                    <line x1="14" y1="5" x2="14" y2="10" />
                    <line x1="18" y1="5" x2="18" y2="8" />
                  </svg>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#8A847D] font-sans">SIZE</span>
                <span className="text-[9px] sm:text-[9.5px] font-medium text-[#1A1A1A] mt-0.5 leading-tight">{size}</span>
              </div>

              {/* 2. Fabric */}
              <div className="flex flex-col items-center border-l border-[#C6A96B]/25 pl-1">
                <div className="w-8 h-8 flex items-center justify-center text-[#C6A96B] mb-1">
                  {/* Weave icon */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.2]">
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                    <line x1="8" y1="4" x2="8" y2="20" />
                    <line x1="16" y1="4" x2="16" y2="20" />
                    <circle cx="8" cy="8" r="1.5" fill="#C6A96B" />
                    <circle cx="16" cy="16" r="1.5" fill="#C6A96B" />
                  </svg>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#8A847D] font-sans">FABRIC</span>
                <span className="text-[9px] sm:text-[9.5px] font-medium text-[#1A1A1A] mt-0.5 leading-tight">{fabric}</span>
              </div>

              {/* 3. Thread Count */}
              <div className="flex flex-col items-center border-l border-[#C6A96B]/25 pl-1">
                <div className="w-8 h-8 flex items-center justify-center text-[#C6A96B] mb-1">
                  {/* Spool icon */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.2]">
                    <ellipse cx="12" cy="5" rx="7" ry="2.5" />
                    <ellipse cx="12" cy="19" rx="7" ry="2.5" />
                    <line x1="5" y1="5" x2="5" y2="19" />
                    <line x1="19" y1="5" x2="19" y2="19" />
                    <line x1="5" y1="9" x2="19" y2="15" />
                    <line x1="5" y1="13" x2="19" y2="19" />
                    <line x1="5" y1="5" x2="19" y2="11" />
                  </svg>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#8A847D] font-sans">THREAD COUNT</span>
                <span className="text-[9px] sm:text-[9.5px] font-medium text-[#1A1A1A] mt-0.5 leading-tight">{threadCount}</span>
              </div>

              {/* 4. Category */}
              <div className="flex flex-col items-center border-l border-[#C6A96B]/25 pl-1">
                <div className="w-8 h-8 flex items-center justify-center text-[#C6A96B] mb-1">
                  {/* Box / package icon */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.2]">
                    <path d="M12 3 L20 7.5 L12 12 L4 7.5 Z" />
                    <path d="M4 7.5 L4 16.5 L12 21 L12 12" />
                    <path d="M20 7.5 L20 16.5 L12 21 L12 12" />
                  </svg>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#8A847D] font-sans">CATEGORY</span>
                <span className="text-[9px] sm:text-[9.5px] font-medium text-[#1A1A1A] mt-0.5 leading-tight">{category}</span>
              </div>
            </div>

            {/* Bottom Left: Price Box + Barcode Strip */}
            <div className="mt-3 pt-2.5 grid grid-cols-12 gap-3 items-center border-t border-[#C6A96B]/30">
              
              {/* Price Card */}
              <div className="col-span-5 border border-[#C6A96B]/60 rounded-xl bg-[#F8F4EC]/60 p-2 text-center shadow-sm">
                <span className="block text-[8px] font-bold uppercase tracking-wider text-[#8A847D] font-sans">
                  {priceCategory}
                </span>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight leading-tight my-0.5">
                  ₹ {displayPrice}
                </div>
                <span className="block text-[7px] text-[#8A847D] font-sans">
                  (Inclusive of all taxes)
                </span>
              </div>

              {/* Barcode & SKU */}
              <div className="col-span-7 flex flex-col items-center justify-center">
                <div className="w-full flex justify-center overflow-hidden px-1">
                  <Barcode128
                    value={barcodeValue}
                    width={1.2}
                    height={38}
                    fontSize={0}
                    displayValue={false}
                    className="max-w-full"
                  />
                </div>
                <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-[#1A1A1A] mt-0.5 uppercase">
                  SKU: {effectiveSku}
                </p>
              </div>
            </div>

          </div>

          {/* ════════ RIGHT COLUMN (35%) ════════ */}
          <div className="col-span-12 md:col-span-4 p-4 sm:p-5 flex flex-col justify-between bg-[#FBF8F3]/50">
            
            {/* 4 Feature Badges with Circular Gold Line Icons */}
            <div className="flex flex-col gap-2.5">
              
              {/* 1. Premium Quality */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[#C6A96B] flex items-center justify-center shrink-0 text-[#C6A96B] bg-[#FCFAF7] shadow-sm">
                  {/* Cotton flower icon */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-[1.2]">
                    <path d="M12 7 C10 4 7 5 7 8 C4 8 4 12 6 14 C4 16 6 19 9 19 C10 21 14 21 15 19 C18 19 20 16 18 14 C20 12 20 8 17 8 C17 5 14 4 12 7 Z" />
                    <circle cx="12" cy="13" r="1.5" fill="#C6A96B" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-sans text-[9px] sm:text-[9.5px] font-bold tracking-[0.08em] uppercase text-[#1A1A1A] leading-tight">
                    PREMIUM<br />QUALITY
                  </h4>
                </div>
              </div>

              {/* 2. Soft & Comfortable */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[#C6A96B] flex items-center justify-center shrink-0 text-[#C6A96B] bg-[#FCFAF7] shadow-sm">
                  {/* Feather / leaf icon */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-[1.2]">
                    <path d="M20 4 C14 4 8 10 6 16 L4 20 L8 18 C14 16 20 10 20 4 Z" />
                    <line x1="6" y1="16" x2="16" y2="6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-sans text-[9px] sm:text-[9.5px] font-bold tracking-[0.08em] uppercase text-[#1A1A1A] leading-tight">
                    SOFT &<br />COMFORTABLE
                  </h4>
                </div>
              </div>

              {/* 3. Durable & Long Lasting */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[#C6A96B] flex items-center justify-center shrink-0 text-[#C6A96B] bg-[#FCFAF7] shadow-sm">
                  {/* Shield check icon */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-[1.2]">
                    <path d="M12 3 L4 7 V12 C4 17 7.5 20.5 12 21.5 C16.5 20.5 20 17 20 12 V7 Z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-sans text-[9px] sm:text-[9.5px] font-bold tracking-[0.08em] uppercase text-[#1A1A1A] leading-tight">
                    DURABLE &<br />LONG LASTING
                  </h4>
                </div>
              </div>

              {/* 4. Perfect For Every Home */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[#C6A96B] flex items-center justify-center shrink-0 text-[#C6A96B] bg-[#FCFAF7] shadow-sm">
                  {/* Gift box icon */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-[1.2]">
                    <rect x="3" y="8" width="18" height="13" rx="2" />
                    <path d="M3 8 L21 8" />
                    <path d="M12 8 L12 21" />
                    <path d="M12 8 C12 5 9 3 7.5 5 C6 7 9 8 12 8 Z" />
                    <path d="M12 8 C12 5 15 3 16.5 5 C18 7 15 8 12 8 Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-sans text-[9px] sm:text-[9.5px] font-bold tracking-[0.08em] uppercase text-[#1A1A1A] leading-tight">
                    PERFECT FOR<br />EVERY HOME
                  </h4>
                </div>
              </div>

            </div>

            {/* Care Instructions Divider */}
            <div className="mt-3 pt-2 border-t border-[#C6A96B]/30 text-center">
              <span className="block font-sans text-[8px] font-bold uppercase tracking-[0.2em] text-[#8A847D] mb-1">
                CARE INSTRUCTIONS
              </span>
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="h-[0.5px] w-6 bg-[#C6A96B]/60" />
                <span className="text-[#C6A96B] text-[7.5px]">❖</span>
                <span className="h-[0.5px] w-6 bg-[#C6A96B]/60" />
              </div>

              {/* 4 Care Icons Strip */}
              <div className="grid grid-cols-4 gap-1 text-center">
                
                {/* 1. Machine Wash */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 border border-[#1A1A1A]/60 rounded flex items-center justify-center text-[7px] font-bold mb-0.5">
                    30°
                  </div>
                  <span className="text-[6.5px] font-bold text-[#4A453E] uppercase leading-tight font-sans">
                    MACHINE<br />WASH
                  </span>
                </div>

                {/* 2. Do Not Bleach */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 flex items-center justify-center mb-0.5 text-[#1A1A1A]">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-[1.4]">
                      <polygon points="12,3 22,21 2,21" />
                      <line x1="6" y1="7" x2="18" y2="19" />
                    </svg>
                  </div>
                  <span className="text-[6.5px] font-bold text-[#4A453E] uppercase leading-tight font-sans">
                    DO NOT<br />BLEACH
                  </span>
                </div>

                {/* 3. Tumble Dry Low */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 border border-[#1A1A1A]/60 rounded flex items-center justify-center mb-0.5">
                    <circle cx="12" cy="12" r="4.5" className="stroke-[#1A1A1A] fill-none stroke-[1.2]" />
                    <circle cx="12" cy="12" r="1.2" fill="#1A1A1A" />
                  </div>
                  <span className="text-[6.5px] font-bold text-[#4A453E] uppercase leading-tight font-sans">
                    TUMBLE DRY<br />LOW
                  </span>
                </div>

                {/* 4. Warm Iron */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 flex items-center justify-center mb-0.5 text-[#1A1A1A]">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-[1.4]">
                      <path d="M4 16 L20 16 C20 16 19 10 13 10 L6 10 C4.5 10 4 12 4 16 Z" />
                      <circle cx="10" cy="13" r="0.9" fill="#1A1A1A" />
                      <circle cx="13" cy="13" r="0.9" fill="#1A1A1A" />
                    </svg>
                  </div>
                  <span className="text-[6.5px] font-bold text-[#4A453E] uppercase leading-tight font-sans">
                    WARM<br />IRON
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ════════ BOTTOM DEEP TEAL BRAND STRIP (5% ACCENT) ════════ */}
        <div className="bg-[#0B5F61] text-[#F5EDE3] py-2 px-4 flex items-center justify-between border-t border-[#C6A96B]/50">
          
          {/* Left Botanical Flourish */}
          <div className="text-[#C6A96B] flex items-center opacity-85">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2 C13 5 15 7 19 7 C16 9 14 11 14 14 C12 11 10 11 7 12 C9 10 10 8 9 5 C10 5 11 4 12 2 Z" />
              <path d="M5 14 C7 14 9 16 9 19 C7 18 5 17 5 14 Z" opacity="0.8" />
            </svg>
          </div>

          {/* Center Brand Philosophy & URL */}
          <div className="flex items-center gap-2 sm:gap-3 text-center">
            <span className="font-serif font-semibold tracking-[0.22em] text-[8.5px] sm:text-[9.5px] uppercase">
              CRAFTED FOR BEAUTIFUL LIVING.
            </span>
            <span className="text-[#C6A96B] font-serif">|</span>
            <span className="font-sans font-medium tracking-[0.14em] text-[8px] sm:text-[9px] text-[#F5EDE3]/90 lowercase">
              www.jorique.in
            </span>
          </div>

          {/* Right Botanical Flourish */}
          <div className="text-[#C6A96B] flex items-center opacity-85 scale-x-[-1]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2 C13 5 15 7 19 7 C16 9 14 11 14 14 C12 11 10 11 7 12 C9 10 10 8 9 5 C10 5 11 4 12 2 Z" />
              <path d="M5 14 C7 14 9 16 9 19 C7 18 5 17 5 14 Z" opacity="0.8" />
            </svg>
          </div>

        </div>

      </div>
    </div>
  );
}
