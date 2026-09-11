import React from 'react';

interface HandcraftedFloralBackgroundProps {
  className?: string;
  variant?: 'full' | 'subtle';
  showFloatingPetals?: boolean;
}

/**
 * 🌸 Handcrafted Royal Indian Heritage Background
 * Featuring transparent Indian royal elephants and paisleys, visible at a pleasant,
 * balanced lightness on the page background while remaining strictly behind content (z-0).
 */
export default function HandcraftedFloralBackground({
  className = '',
  variant = 'full',
  showFloatingPetals = false,
}: HandcraftedFloralBackgroundProps) {
  // Background images and elephant watermarks removed per user request
  return null;
}

/**
 * 🌺 Handcrafted Floral & Royal Paisley Section Divider
 */
export function HandcraftedFloralDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center my-6 sm:my-8 px-6 ${className}`} aria-hidden="true">
      <div className="w-full max-w-2xl flex items-center justify-center text-[#C6A96B] dark:text-[#D4AF37] opacity-60">
        <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#C6A96B]/30 to-[#C6A96B]/60" />
        <div className="mx-4 shrink-0 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#C6A96B]" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
            <path d="M12 2 C10 6, 6 10, 2 12 C6 14, 10 18, 12 22 C14 18, 18 14, 22 12 C18 10, 14 6, 12 2 Z" />
          </svg>
          <span className="w-1 h-1 rounded-full bg-[#C6A96B]" />
        </div>
        <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#C6A96B]/30 to-[#C6A96B]/60" />
      </div>
    </div>
  );
}
