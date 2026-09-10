import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JoriqueExperienceSection() {
  return (
    <section 
      id="experience"
      className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] dark:bg-[#100E0D] text-primary dark:text-[#FCFAF7] relative overflow-hidden transition-colors duration-500 border-t border-[#E8DFD3] dark:border-[#2E2925]"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Editorial Narrative Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#C6A96B]/30 text-[#851C25] dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase shadow-xs"
          >
            <Sparkles size={11} className="text-[#C6A96B]" />
            <span>THE JORIQUE EXPERIENCE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-primary dark:text-white leading-[1.15]"
          >
            Comfort isn't something you simply buy.{' '}
            <span className="italic block text-[#851C25] dark:text-[#C6A96B]">
              It's something you live with.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base text-secondary dark:text-white/75 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Show JORIQUE in real moments — slow mornings, thoughtful hosting, restful evenings and beautifully considered spaces.
          </motion.p>
        </div>

        {/* High-Resolution Experiential Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl lg:rounded-[40px] overflow-hidden shadow-2xl border-2 border-[#E8DFD3] dark:border-[#332922] bg-[#F5EDE3] dark:bg-[#1C1613] group"
        >
          {/* Exact high-res spec photography from page 7 */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] w-full overflow-hidden">
            <img
              src="/images/jorique-experience.jpg"
              alt="The JORIQUE Experience living sanctuary"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-1000 select-none"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* In-Picture Editorial Card */}
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 max-w-md p-6 sm:p-8 rounded-3xl bg-black/45 backdrop-blur-md border border-white/20 text-white space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-[#C6A96B] uppercase block">
                Sanctuary Living
              </span>
              <p className="font-serif text-lg sm:text-2xl font-light leading-snug">
                Sensory textures crafted for the spaces that shelter your most intimate moments.
              </p>
              <Link to="/about" className="inline-block pt-2">
                <button className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#FCFAF7] hover:text-[#C6A96B] transition-colors cursor-pointer">
                  <span>Explore The World of JORIQUE</span>
                  <ArrowRight size={13} />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* CTA Bar */}
        <div className="text-center pt-4">
          <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full bg-[#1A1A1A] hover:bg-[#851C25] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black font-semibold text-xs uppercase tracking-[0.25em] transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>DISCOVER THE JORIQUE EXPERIENCE</span>
              <ArrowRight size={14} />
            </motion.button>
          </Link>
        </div>

      </div>
    </section>
  );
}
