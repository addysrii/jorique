import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300 overflow-hidden">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-[#2E2925] text-secondary dark:text-[#D4AF37] text-[11px] font-semibold tracking-[0.3em] uppercase mb-3">
            <Sparkles size={12} className="text-[#D4AF37]" />
            Heritage & Craft
          </div>
          <h1 className="text-3xl lg:text-5xl font-light text-primary dark:text-white tracking-wide">
            The World of JORIQUE
          </h1>
          <p className="text-secondary dark:text-white/60 text-sm font-mono pt-2">
            Content to be added
          </p>
        </motion.div>
      </section>

      {/* Brand Story */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-secondary dark:text-[#D4AF37] mb-3">
              The JORIQUE Philosophy
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-primary dark:text-white mb-6">
              Crafted for Modern Living
            </h2>
          </div>
          <div className="p-8 rounded-3xl bg-cream/35 dark:bg-white/5 border border-border/70 dark:border-[#2E2925] text-xs text-secondary dark:text-white/60 text-center">
            Content to be added
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="pb-28 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-secondary dark:text-[#D4AF37] mb-3">
              What We Stand For
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-primary dark:text-white mb-6">
              Our Core Pillars
            </h2>
          </div>
          <div className="p-8 rounded-3xl bg-cream/35 dark:bg-white/5 border border-border/70 dark:border-[#2E2925] text-xs text-secondary dark:text-white/60 text-center">
            Content to be added
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center border-t border-border dark:border-[#2E2925]">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl lg:text-3xl font-light text-primary dark:text-white">
            Experience JORIQUE
          </h2>
          <p className="text-secondary dark:text-white/60 text-xs">
            Content to be added
          </p>
          <div className="pt-4">
            <Link to="/shop">
              <button className="inline-flex items-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all shadow-md">
                Shop the Collection
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
