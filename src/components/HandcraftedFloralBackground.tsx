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
  const isSubtle = variant === 'subtle';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700 ${className}`}
      aria-hidden="true"
    >
      {/* ── 0. DARK MODE REFINED MINIMALIST SMOKED WALNUT TEXTURE ── */}
      <div className="absolute inset-0 hidden dark:block pointer-events-none transition-opacity duration-700">
        {/* Soft, diffuse warm timber glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(95, 58, 35, 0.16) 0%, rgba(45, 28, 18, 0.22) 50%, rgba(20, 16, 13, 0.85) 90%, #14100D 100%)',
          }}
        />
        {/* Ultra-subtle, clean organic timber lines (minimal & unobtrusive) */}
        <svg
          className="absolute inset-0 w-full h-full text-[#A47148] opacity-[0.035] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="jorique-dark-woodgrain"
              width="360"
              height="600"
              patternUnits="userSpaceOnUse"
            >
              <path d="M60 0 Q66 200, 58 400 T62 600" stroke="currentColor" strokeWidth="0.6" fill="none" />
              <path d="M180 0 Q170 250, 186 450 T178 600" stroke="currentColor" strokeWidth="0.7" fill="none" />
              <path d="M300 0 Q310 180, 294 380 T304 600" stroke="currentColor" strokeWidth="0.6" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#jorique-dark-woodgrain)" />
        </svg>
      </div>

      {/* ── 1. TRANSPARENT HAND-CRAFTED ROYAL ELEPHANT & PAISLEY WALLPAPER ── */}
      {/* Light Mode: Warm antique bronze & gold transparent elephant and paisley figures visible delicately */}
      <div
        className={`absolute inset-0 dark:hidden pointer-events-none mix-blend-multiply transition-opacity duration-700 ${
          isSubtle ? 'opacity-[0.03] sm:opacity-[0.04]' : 'opacity-[0.05] sm:opacity-[0.06]'
        }`}
        style={{
          backgroundImage: 'url(/images/transparent-elephant-light.png)',
          backgroundSize: '460px 460px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Dark Mode: Understated gilded gold watermark */}
      <div
        className={`absolute inset-0 hidden dark:block pointer-events-none mix-blend-screen transition-opacity duration-700 ${
          isSubtle ? 'opacity-[0.02] sm:opacity-[0.025]' : 'opacity-[0.035] sm:opacity-[0.045]'
        }`}
        style={{
          backgroundImage: 'url(/images/transparent-elephant-dark.png)',
          backgroundSize: '460px 460px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* ── 2. DELICATE FLORAL TRELLIS ACCENT (Light Mode Only - hidden in Dark to prevent clutter) ── */}
      <svg
        className={`absolute inset-0 w-full h-full text-[#8C6D37] dark:hidden transition-opacity duration-700 ${
          isSubtle ? 'opacity-[0.02]' : 'opacity-[0.035]'
        }`}
      >
        <defs>
          <pattern
            id="jorique-subtle-trellis"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            {/* Center Tiny Floret */}
            <circle cx="80" cy="80" r="3" fill="currentColor" opacity="0.6" />
            <path d="M80 73 Q83 77, 87 80 Q83 83, 80 87 Q77 83, 73 80 Q77 77, 80 73 Z" fill="currentColor" opacity="0.4" />
            
            {/* Subtle Diagonal Lines */}
            <line x1="0" y1="0" x2="160" y2="160" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.35" />
            <line x1="160" y1="0" x2="0" y2="160" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.35" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#jorique-subtle-trellis)" />
      </svg>

      {/* ── 2. OPTIONAL FLOATING ARTISANAL PETALS ── */}
      {showFloatingPetals && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { left: '12%', top: '15%', size: 14, delay: 0, dur: '12s' },
            { left: '85%', top: '22%', size: 18, delay: 2, dur: '15s' },
            { left: '28%', top: '65%', size: 12, delay: 4, dur: '14s' },
            { left: '72%', top: '78%', size: 16, delay: 1.5, dur: '16s' },
            { left: '48%', top: '40%', size: 15, delay: 3, dur: '13s' },
          ].map((petal, i) => (
            <div
              key={i}
              className="absolute text-[#D4AF37]/25 dark:text-[#C6A96B]/20 animate-pulse"
              style={{
                left: petal.left,
                top: petal.top,
                animationDelay: `${petal.delay}s`,
                animationDuration: petal.dur,
              }}
            >
              <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 C10 6, 6 10, 2 12 C6 14, 10 18, 12 22 C14 18, 18 14, 22 12 C18 10, 14 6, 12 2 Z" />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
