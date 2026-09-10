import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BeyondLivingSection() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-12 bg-[#F5EDE3] dark:bg-[#14100D] text-primary dark:text-[#FCFAF7] transition-colors duration-500 border-t border-[#E8DFD3] dark:border-[#2E2925]">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-secondary dark:text-[#C6A96B] block">
            07 — BEYOND EVERYDAY LIVING
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-primary dark:text-white">
            Gifting, Travel & Professional Spaces
          </h2>
          <p className="text-xs sm:text-sm text-secondary dark:text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
            Souvenir and Hospitality extend the same JORIQUE philosophy into gifting, travel and professional sanctuaries.
          </p>
        </div>

        {/* 2-Column Split: Souvenir & Hospitality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Card 1: JORIQUE Souvenir */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-[#FCFAF7] dark:bg-[#1C1613] border border-[#E8DFD3] dark:border-[#332922] shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            {/* Top Accent Strip */}
            <div className="h-1.5 w-full bg-[#B9787D]" />

            <div className="p-6 sm:p-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#B9787D] font-semibold block">
                    JORIQUE
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-primary dark:text-white">
                    Souvenir
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#B9787D]/10 flex items-center justify-center text-[#B9787D]">
                  <Gift size={20} />
                </div>
              </div>

              <h4 className="font-serif text-lg sm:text-xl font-medium text-[#B9787D]">
                Thoughtful pieces for meaningful moments.
              </h4>

              <p className="text-xs sm:text-sm text-secondary dark:text-white/70 font-light leading-relaxed">
                Keepsakes, gifting solutions and travel-friendly textiles — made to carry comfort wherever life takes you.
              </p>
            </div>

            {/* Visual Frame */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8DFD3]/40 dark:bg-[#14100D]">
              <img
                src="/images/jorique-souvenir.jpg"
                alt="JORIQUE Souvenir curated gift collections"
                className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 select-none"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>

            {/* Bottom Button */}
            <div className="p-6 sm:p-8 border-t border-[#E8DFD3] dark:border-[#332922] bg-white/40 dark:bg-white/[0.02]">
              <Link to="/gift" className="block">
                <button className="w-full py-3.5 px-6 rounded-2xl flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 border border-[#B9787D] text-[#B9787D] hover:bg-[#B9787D] hover:text-white cursor-pointer shadow-xs hover:shadow-md">
                  <span>EXPLORE SOUVENIR</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Card 2: JORIQUE Hospitality */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-[#FCFAF7] dark:bg-[#1C1613] border border-[#E8DFD3] dark:border-[#332922] shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            {/* Top Accent Strip */}
            <div className="h-1.5 w-full bg-[#4B5563]" />

            <div className="p-6 sm:p-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#4B5563] dark:text-white/60 font-semibold block">
                    JORIQUE
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-primary dark:text-white">
                    Hospitality
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#4B5563]/10 dark:bg-white/10 flex items-center justify-center text-[#4B5563] dark:text-white">
                  <Building2 size={20} />
                </div>
              </div>

              <h4 className="font-serif text-lg sm:text-xl font-medium text-[#4B5563] dark:text-[#C6A96B]">
                Designed for spaces that welcome.
              </h4>

              <p className="text-xs sm:text-sm text-secondary dark:text-white/70 font-light leading-relaxed">
                Premium textile solutions for hotels, resorts and hospitality spaces. Durable, elegant and made to leave a lasting impression.
              </p>
            </div>

            {/* Visual Frame */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8DFD3]/40 dark:bg-[#14100D]">
              <img
                src="/images/jorique-hospitality.jpg"
                alt="JORIQUE Hospitality luxury resort suite"
                className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 select-none"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>

            {/* Bottom Button */}
            <div className="p-6 sm:p-8 border-t border-[#E8DFD3] dark:border-[#332922] bg-white/40 dark:bg-white/[0.02]">
              <Link to="/connect" className="block">
                <button className="w-full py-3.5 px-6 rounded-2xl flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 border border-[#4B5563] text-[#4B5563] dark:text-white hover:bg-[#4B5563] hover:text-white cursor-pointer shadow-xs hover:shadow-md">
                  <span>EXPLORE HOSPITALITY</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
