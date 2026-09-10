import React from 'react';
import { motion } from 'framer-motion';

export default function JoriqueWaySection() {
  return (
    <section className="py-24 sm:py-32 lg:py-40 px-6 sm:px-10 lg:px-16 bg-[#FAF7F2] dark:bg-[#100E0D] text-primary dark:text-[#FCFAF7] relative overflow-hidden transition-colors duration-500 border-t border-b border-[#E8DFD3]/60 dark:border-[#2E2925]/60">
      {/* Subtle Warm Glow in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-radial from-[#C6A96B]/8 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        {/* Editorial Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C6A96B]/30 bg-[#F5EDE3]/60 dark:bg-white/5 backdrop-blur-xs text-[#8A847D] dark:text-[#C6A96B] text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase"
        >
          <span>✦</span>
          <span>THE JORIQUE WAY</span>
          <span>✦</span>
        </motion.div>

        {/* Quiet Philosophy Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-primary dark:text-white leading-[1.2] max-w-3xl mx-auto"
        >
          Comfort is a feeling.{' '}
          <span className="italic block mt-1 text-[#8A847D] dark:text-[#C6A96B]">
            And a better way of living.
          </span>
        </motion.h2>

        {/* Restrained Editorial Accent Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-[1px] w-20 sm:w-28 bg-[#C6A96B] mx-auto"
        />

        {/* Thoughtful Editorial Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sans text-xs sm:text-sm md:text-base text-secondary dark:text-white/75 font-normal max-w-2xl mx-auto leading-relaxed px-4"
        >
          Thoughtfully designed textiles for homes, journeys and spaces that bring people together.
        </motion.p>
      </div>
    </section>
  );
}
