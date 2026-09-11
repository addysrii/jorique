import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FlagshipDuoBeyond() {
  return (
    <div className="w-full bg-[#F5EDE3] dark:bg-[#100E0D] text-primary dark:text-[#FCFAF7] transition-colors duration-500 overflow-hidden">

      {/* ─────────────────────────────────────────────────────────────
          1. TWO SIDE-BY-SIDE PANELS: SOUVENIR & HOSPITALITY
          (Exact replica of the user design mockup)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/20 dark:divide-[#332922]">

        {/* Panel 1: JORIQUE Souvenir */}
        <div className="group relative w-full h-[520px] sm:h-[560px] lg:h-[62vh] lg:min-h-[500px] lg:max-h-[640px] overflow-hidden flex flex-col justify-between">
          {/* Background image */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            <img
              src="/images/jorique-souvenir.jpg"
              alt="JORIQUE Souvenir curated gifting solutions"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out select-none"
              loading="lazy"
            />
            {/* Dusty Rose / Terracotta Tint Gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, rgba(160, 95, 100, 0.95) 0%, rgba(160, 95, 100, 0.82) 36%, rgba(160, 95, 100, 0.35) 65%, transparent 90%)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Left Narrative Block */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-md space-y-2">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-white/75 uppercase block">
              JORIQUE
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-none">
              Souvenir
            </h2>

            <div className="pt-2 space-y-0.5">
              <p className="font-serif text-base sm:text-lg lg:text-xl font-semibold brand-tagline text-white/95 leading-tight">
                Thoughtful pieces
              </p>
              <p className="font-serif text-base sm:text-lg lg:text-xl font-semibold brand-tagline text-white/95 leading-tight">
                for meaningful moments.
              </p>
            </div>

            <p className="font-sans text-xs sm:text-[13px] text-white/80 font-normal leading-relaxed max-w-sm pt-2">
              Keepsakes, gifting solutions and travel-friendly textiles — made to carry comfort wherever life takes you.
            </p>

            {/* Action Button */}
            <div className="pt-4">
              <Link to="/gift">
                <button className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/60 bg-white/10 hover:bg-white hover:text-black backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-lg cursor-pointer">
                  <span>EXPLORE SOUVENIR</span>
                  <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Bottom Left Index */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 pointer-events-none">
          
          </div>
        </div>

        {/* Panel 2: JORIQUE Hospitality */}
        <div className="group relative w-full h-[520px] sm:h-[560px] lg:h-[62vh] lg:min-h-[500px] lg:max-h-[640px] overflow-hidden flex flex-col justify-between">
          {/* Background image */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            <img
              src="/images/jorique-hospitality.jpg"
              alt="JORIQUE Hospitality hotel resort suite"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out select-none"
              loading="lazy"
            />
            {/* Charcoal Slate Tint Gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, rgba(50, 58, 68, 0.95) 0%, rgba(50, 58, 68, 0.82) 36%, rgba(50, 58, 68, 0.35) 65%, transparent 90%)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Left Narrative Block */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-md space-y-2">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-white/75 uppercase block">
              JORIQUE
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-none">
              Hospitality
            </h2>

            <div className="pt-2 space-y-0.5">
              <p className="font-serif text-base sm:text-lg lg:text-xl font-semibold brand-tagline text-white/95 leading-tight">
                Designed for spaces
              </p>
              <p className="font-serif text-base sm:text-lg lg:text-xl font-semibold brand-tagline text-white/95 leading-tight">
                that welcome.
              </p>
            </div>

            <p className="font-sans text-xs sm:text-[13px] text-white/80 font-normal leading-relaxed max-w-sm pt-2">
              Premium textile solutions for hotels, resorts and hospitality spaces. Durable, elegant and made to leave a lasting impression.
            </p>

            {/* Action Button */}
            <div className="pt-4">
              <Link to="/connect">
                <button className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/60 bg-white/10 hover:bg-white hover:text-black backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-lg cursor-pointer">
                  <span>EXPLORE HOSPITALITY</span>
                  <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Bottom Right Corner Tag: SPACES PEOPLE REMEMBER */}
          {/* <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex items-end justify-between">
            

            <div className="text-right">
              {['SPACES', 'PEOPLE', 'REMEMBER'].map((word, wIdx) => (
                <span
                  key={wIdx}
                  className="block text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-white/75 uppercase leading-tight font-medium"
                >
                  {word}
                </span>
              ))}
            </div>
          </div> */}
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SIGNATURE BRAND STRIP (Immediately beneath the 2 panels)
          JORIQUE — Where Comfort Meets Design | Socials | A MORE CONSCIOUS TOMORROW —
      ───────────────────────────────────────────────────────────── */}
      {/* <div className="w-full border-t border-b border-[#E8DFD3] dark:border-[#2E2925] bg-[#F5EDE3] dark:bg-[#100E0D] px-6 sm:px-10 lg:px-16 py-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">


          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <Link
              to="/"
              className="font-serif text-xl sm:text-2xl font-normal tracking-[0.18em] uppercase text-primary dark:text-[#FCFAF7]"
            >
              JORIQUE
            </Link>
            <span className="w-8 h-[1px] bg-[#8A847D]/50 dark:bg-[#C6A96B]/50" />
            <span className="font-serif text-xs sm:text-sm text-[#8A847D] dark:text-white/70 tracking-wide">
              Where Comfort Meets Design
            </span>
          </div>


          <div className="flex items-center gap-5 sm:gap-6 flex-wrap justify-center">


            <div className="flex items-center gap-3 text-secondary dark:text-white/70">
              <a
                href="https://www.instagram.com/thejorique"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-primary dark:hover:text-[#C6A96B] transition-colors"
              >
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="hover:text-primary dark:hover:text-[#C6A96B] transition-colors text-xs font-serif font-bold"
              >
                P
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-primary dark:hover:text-[#C6A96B] transition-colors"
              >
                <Linkedin size={16} strokeWidth={1.5} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-primary dark:hover:text-[#C6A96B] transition-colors"
              >
                <Youtube size={16} strokeWidth={1.5} />
              </a>
            </div>


            <span className="hidden sm:inline h-4 w-[1px] bg-secondary/30 dark:bg-white/20" />


            <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#8A847D] dark:text-white/60 uppercase">
              <span>A MORE CONSCIOUS TOMORROW</span>
              <span className="w-8 h-[1px] bg-[#8A847D]/50 dark:bg-[#C6A96B]/50" />
            </div>

          </div>

        </div>
      </div> */}

    </div>
  );
}
