import React from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Sparkles, 
  Heart, 
  Flame, 
  Package, 
  ArrowRight,
  Sparkle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JoriqueSouvenirSection() {
  const pillars = [
    {
      icon: <Package className="w-5 h-5 text-[#C6A96B]" />,
      title: 'Handcrafted Keepsake Boxes',
      desc: 'Rigid presentation cases featuring hot-stamped gold foil embossing, magnetic closures, and archival tissue lining.',
    },
    {
      icon: <Heart className="w-5 h-5 text-[#C6A96B]" />,
      title: 'Wedding & Celebration Favors',
      desc: 'Commemorate milestones with custom couple monograms, auspicious dates, and tailored colorways that delight wedding guests.',
    },
    {
      icon: <Flame className="w-5 h-5 text-[#C6A96B]" />,
      title: 'Sensory Candle & Fragrance Pairing',
      desc: 'Infuse unboxing moments with hand-poured botanical amber candles and gentle fabric mists formulated for fine cottons.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#C6A96B]" />,
      title: 'Corporate & Executive Prestige',
      desc: 'Elevated client appreciation gift sets with custom brand bands, personalized handwritten calligraphy, and multi-address fulfillment.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-10 bg-[#F5EDE3]/60 dark:bg-[#12100E] text-primary dark:text-[#FCFAF7] relative overflow-hidden border-t border-[#E8DFD3] dark:border-[#2E2925] transition-colors duration-500">
      {/* Delicate Filigree Accents */}
      <div className="absolute top-8 left-8 text-[#C6A96B] text-xl opacity-30 font-serif pointer-events-none select-none">
        ✦
      </div>
      <div className="absolute bottom-8 right-8 text-[#C6A96B] text-xl opacity-30 font-serif pointer-events-none select-none">
        ✦
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12 sm:space-y-16">
        
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#E8DFD3] dark:border-[#332922] pb-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 dark:bg-white/5 border border-[#C6A96B]/30 text-[#0B5F61] dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase shadow-xs">
              <Gift size={12} className="text-[#C6A96B]" />
              The Gifting & Keepsake Atelier
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-primary dark:text-white tracking-tight leading-tight">
              JORIQUE Souvenir
            </h2>

            <p className="font-serif italic text-base sm:text-lg text-[#0B5F61] dark:text-[#C6A96B] font-light">
              “Artisanal gift editions and keepsake bespoke treasures.”
            </p>

            <p className="text-xs sm:text-sm text-secondary dark:text-white/75 font-light leading-relaxed max-w-xl">
              Gift-giving is an art of intimacy and gratitude. JORIQUE Souvenir curates heirloom home textiles, 
              monogrammed cushion pairs, and scented candle harmonies presented in collector-grade keepsake cases.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/gift">
              <button className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1A1A1A] hover:bg-[#0B5F61] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
                <Gift size={14} />
                <span>Explore Gifting Atelier</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/connect">
              <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#E8DFD3] dark:border-[#332922] hover:border-[#C6A96B] bg-white/50 dark:bg-white/5 text-primary dark:text-white font-semibold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer">
                <span>Custom Order Inquiry</span>
              </button>
            </Link>
          </div>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-[#1C1613]/80 border border-[#E8DFD3] dark:border-[#332922] hover:border-[#C6A96B]/50 transition-all duration-300 space-y-4 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cream/60 dark:bg-white/5 border border-[#E8DFD3] dark:border-white/10 flex items-center justify-center text-[#C6A96B]">
                  {pillar.icon}
                </div>
                <h3 className="font-serif text-lg font-normal text-primary dark:text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs text-secondary dark:text-white/70 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8DFD3] dark:border-[#332922] flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#0B5F61] dark:text-[#C6A96B]">
                <Sparkle size={10} />
                <span>Heirloom Keepsake</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-secondary dark:text-white/80">
          <div className="space-y-1">
            <span className="font-semibold text-primary dark:text-white block">Wedding & Festive Bulk Consultations:</span>
            <span className="text-secondary dark:text-white/60 font-light">
              Connect with our master gifting curator for bespoke ribbons, custom seals, and bespoke fragrance creation.
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#0B5F61] dark:text-[#C6A96B] uppercase tracking-widest shrink-0 font-medium">
            Handcrafted With Care
          </span>
        </div>

      </div>
    </section>
  );
}
