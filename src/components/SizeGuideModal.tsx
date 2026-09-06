import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function SizeGuideModal({ isOpen, onClose, category = 'Comforter' }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'inch' | 'cm'>('inch');

  if (!isOpen) return null;

  const isBedsheet = category.toLowerCase().includes('sheet');

  const comforterData = [
    {
      size: 'Single Comforter',
      inch: '90" x 60"',
      cm: '228 cm x 152 cm',
      mattress: 'Single / Twin Bed (36" x 75")',
      includes: '1 Single Comforter',
    },
    {
      size: 'Double Comforter',
      inch: '100" x 90"',
      cm: '254 cm x 228 cm',
      mattress: 'Queen / Standard Double (60" x 78")',
      includes: '1 Double Comforter',
    },
    {
      size: 'King Comforter',
      inch: '108" x 100"',
      cm: '274 cm x 254 cm',
      mattress: 'King / Master Bed (72" x 78" or 78" x 84")',
      includes: '1 King Size Comforter',
    },
  ];

  const bedsheetData = [
    {
      size: 'Single Bed Sheet',
      inch: '90" x 60" + 1 Pillow Cover (18" x 27")',
      cm: '228 cm x 152 cm + 1 Pillow Cover (45 cm x 68 cm)',
      mattress: 'Single Bed (up to 8" mattress depth)',
      includes: '1 Fitted/Flat Sheet + 1 Pillow Sham',
    },
    {
      size: 'Double Bed Sheet',
      inch: '100" x 90" + 2 Pillow Covers (18" x 27")',
      cm: '254 cm x 228 cm + 2 Pillow Covers (45 cm x 68 cm)',
      mattress: 'Queen Bed (up to 10" mattress depth)',
      includes: '1 Fitted/Flat Sheet + 2 Pillow Shams',
    },
    {
      size: 'King Bed Sheet',
      inch: '108" x 108" + 2 Pillow Covers (18" x 27")',
      cm: '274 cm x 274 cm + 2 Pillow Covers (45 cm x 68 cm)',
      mattress: 'King Bed (up to 12" mattress depth)',
      includes: '1 Fitted/Flat Sheet + 2 Pillow Shams',
    },
  ];

  const tableRows = isBedsheet ? bedsheetData : comforterData;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-3xl bg-warm-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-border/80 dark:border-[#2E2925] bg-cream/40 dark:bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-[#D4AF37]/20 flex items-center justify-center text-primary dark:text-[#D4AF37]">
                <Ruler size={18} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-serif font-semibold text-primary dark:text-white tracking-wide">
                  Luxury Size & Fit Guide
                </h3>
                <p className="text-[11px] text-secondary dark:text-white/60 font-sans">
                  Crafted for generous drape and effortless elegance
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white transition-colors"
              aria-label="Close size guide"
            >
              <X size={18} />
            </button>
          </div>

          {/* Unit Toggle & Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Unit Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70">
                Measurement Unit:
              </span>
              <div className="inline-flex p-1 rounded-full bg-cream dark:bg-black/40 border border-border dark:border-[#2E2925]">
                <button
                  type="button"
                  onClick={() => setUnit('inch')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    unit === 'inch'
                      ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black shadow-sm'
                      : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  Inches (")
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    unit === 'cm'
                      ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black shadow-sm'
                      : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            {/* Size Table */}
            <div className="overflow-x-auto rounded-2xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#12100E] shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 dark:border-[#2E2925] bg-cream/30 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-white/70">
                    <th className="py-3 px-4">Size Option</th>
                    <th className="py-3 px-4">Dimensions</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Recommended Bed</th>
                    <th className="py-3 px-4">Package Contents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-[#2E2925] text-xs">
                  {tableRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-cream/20 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-primary dark:text-white whitespace-nowrap">
                        {row.size}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-primary dark:text-[#D4AF37]">
                        {unit === 'inch' ? row.inch : row.cm}
                      </td>
                      <td className="py-3.5 px-4 text-secondary dark:text-white/70 hidden sm:table-cell">
                        {row.mattress}
                      </td>
                      <td className="py-3.5 px-4 text-secondary dark:text-white/80">
                        {row.includes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pro Drape & Fit Tips */}
            <div className="p-4 rounded-2xl bg-cream/40 dark:bg-[#12100E] border border-border/80 dark:border-[#2E2925] space-y-2.5">
              <div className="flex items-center gap-2 text-primary dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>The Jorique Drape Advantage</span>
              </div>
              <ul className="text-xs text-secondary dark:text-white/70 space-y-1.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Generous Side Drop:</strong> Engineered with an extra 8–10 inches of lateral overhang for a five-star hotel aesthetic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Tuck & Fold Allowance:</strong> Ample lengthwise margin allowing effortless turnover fold under duvet corners.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-6 sm:px-8 py-4 border-t border-border/80 dark:border-[#2E2925] bg-cream/20 dark:bg-black/20 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-primary dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm"
            >
              Got It
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
