import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

export default function JoriqueWaySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  // Subtle parallax on the background strip
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  const words = ['Crafted', 'for', 'beautiful', 'living'];

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
    >
      {/* ── Full-bleed warm linen strip ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-[#EDE4D8] dark:bg-[#16110E] transition-colors duration-500"
      />

      {/* Fine diagonal texture */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #8D867F 0px,
            #8D867F 1px,
            transparent 1px,
            transparent 18px
          )`,
        }}
      />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-32">

        {/* ── Top eyebrow row ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12 lg:mb-16"
        >
          <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#0B5F61] dark:text-[#D4AF37]">
            The Jorique Way
          </span>
          <div className="flex-1 h-px bg-[#C6A96B]/40 dark:bg-[#D4AF37]/25" />

        </motion.div>

        {/* ── Staggered word-by-word serif headline ── */}
        <div className="mb-12 lg:mb-16 overflow-hidden">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ y: '110%', opacity: 0 }}
                animate={isInView ? { y: '0%', opacity: 1 } : {}}
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.08 + i * 0.1,
                }}
                className={`font-serif leading-[1.08] tracking-tight text-[#1A1A1A] dark:text-white inline-block ${i === 0
                    ? 'text-5xl sm:text-7xl lg:text-8xl'
                    : i === 1
                      ? 'text-5xl sm:text-7xl lg:text-8xl italic text-[#8A8177] dark:text-white/40'
                      : 'text-5xl sm:text-7xl lg:text-8xl'
                  }`}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>

        {/* ── Body + CTA row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-end"
        >
          <p className="text-[#6B6259] dark:text-white/55 text-base sm:text-lg font-light leading-relaxed max-w-lg">
            At JORIQUE, we believe the things we live with should feel as
            beautiful as they look. Thoughtfully designed textiles, made for
            everyday rituals, meaningful moments, and spaces that feel like
            home.
          </p>

          <div className="flex lg:justify-end">
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#0B5F61] dark:text-[#D4AF37]"
            >
              <span className="relative">
                Discover the Jorique Way
                <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px bg-[#0B5F61] dark:bg-[#D4AF37] transition-all duration-300" />
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-250" />
            </Link>
          </div>
        </motion.div>

        {/* ── Bottom thin rule with accent dot ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="mt-14 lg:mt-16 flex items-center gap-4 origin-left"
        >

          <div className="flex-1 h-px bg-[#C6A96B]/40 dark:bg-[#D4AF37]/20" />
        </motion.div>

      </div>
    </section>
  );
}
