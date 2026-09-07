import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  Layers,
  Video,
  Feather,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ArrowRight,
  Droplets,
  Wind,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CraftPillar {
  id: string;
  icon: JSX.Element;
  metric: string;
  metricLabel: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  highlights: string[];
  gradient: string;
}

const CRAFT_PILLARS: CraftPillar[] = [
  {
    id: 'fibers',
    icon: <Feather className="w-6 h-6 text-[#C6A96B]" />,
    metric: '100%',
    metricLabel: 'Extra-Long Staple Organic',
    title: 'Certified Giza & Mulberry Fibers',
    subtitle: 'Zero Synthetic Blends • Chemical-Free Sizing',
    tag: 'Fiber Provenance',
    description:
      'We exclusively harvest long-staple Egyptian cotton and grade-A Mulberry silk. Unlike mass-market sheets treated with artificial wax softeners, our fibers breathe naturally, soften with every wash cycle, and remain friction-free on skin.',
    highlights: [
      'Extra-long staple yarn resists pilling for generations',
      'Hypoallergenic and dermatologist-gentle contact',
      'Zero toxic formaldehyde or harsh sizing starches',
    ],
    gradient: 'from-[#C6A96B]/10 via-[#F5EDE3]/40 to-transparent dark:from-[#C6A96B]/10 dark:via-[#1A1816] dark:to-transparent',
  },
  {
    id: 'threadcount',
    icon: <Layers className="w-6 h-6 text-[#0B5F61] dark:text-[#52C798]" />,
    metric: '1000 TC',
    metricLabel: 'Single-Ply True Thread Density',
    title: 'Architectural Sateen Weave',
    subtitle: 'Calendered Luster • All-Season Porosity',
    tag: 'Weave Engineering',
    description:
      'Many brands inflate thread counts using multi-ply threads twisted together. JORIQUE insists on true single-ply weave architecture up to 1000 thread count, compressed under heated calender cylinders to create a luminous natural drape that breathes through hot summers and crisp winters.',
    highlights: [
      'Single-ply weave guarantees true structural durability',
      'Micro-porous weave wicks moisture throughout REM sleep',
      'Natural silk-like shimmer with zero synthetic coatings',
    ],
    gradient: 'from-[#0B5F61]/10 via-[#F5EDE3]/40 to-transparent dark:from-[#0B5F61]/15 dark:via-[#1A1816] dark:to-transparent',
  },
  {
    id: 'inspection',
    icon: <ShieldCheck className="w-6 h-6 text-[#851C25] dark:text-[#F87171]" />,
    metric: '48 HRS',
    metricLabel: 'Priority Video Claim Verification',
    title: 'Pre-Dispatch Inspection & Video Guarantee',
    subtitle: '100% Photographic Logged • Sealed Deliveries',
    tag: 'Quality Assurance',
    description:
      'Every single JORIQUE product is meticulously hand-inspected under high-intensity inspection light and photographed before being sealed for shipment. If your parcel arrives damaged or defective, our mandatory 360° unboxing video protocol ensures immediate white-glove replacement.',
    highlights: [
      'Every parcel recorded & logged in the atelier registry',
      'Tamper-evident luxury boutique security seal',
      'Dedicated concierge replacement within 48 hours of claim',
    ],
    gradient: 'from-[#851C25]/10 via-[#F5EDE3]/40 to-transparent dark:from-[#851C25]/15 dark:via-[#1A1816] dark:to-transparent',
  },
  {
    id: 'tailoring',
    icon: <Award className="w-6 h-6 text-[#D4AF37]" />,
    metric: '100%',
    metricLabel: 'Artisanal Atelier Finished',
    title: 'Hand-Corded Borders & French Seams',
    subtitle: 'Antique Jacquard Looms • Bespoke Tailoring',
    tag: 'Master Craft',
    description:
      'From custom-dyed piped borders on our cushions to French-seamed corners that never unravel, our pieces are tailored by third-generation master craftsmen. We unite classical artisanal handiwork with clean modern architectural minimalism.',
    highlights: [
      'Double-stitched French seams prevent fraying indefinitely',
      'Hand-sewn corded velvet piping and delicate flange trims',
      'Small-batch atelier productions with bespoke serial tracking',
    ],
    gradient: 'from-[#D4AF37]/10 via-[#F5EDE3]/40 to-transparent dark:from-[#D4AF37]/15 dark:via-[#1A1816] dark:to-transparent',
  },
];

const COMPARISON_ROWS = [
  {
    criterion: 'Fiber Composition',
    massMarket: 'Synthetic polyester blends or short-staple cotton coated in chemical softening waxes.',
    jorique: '100% Certified Extra-Long Staple Organic Giza Cotton & Pure Mulberry Silk.',
    winner: true,
  },
  {
    criterion: 'Thread Count Reality',
    massMarket: 'Inflated multi-ply counts (cheap 200TC twisted 4x to falsely claim "800TC"). Stiff & traps heat.',
    jorique: 'Authentic single-ply 400 to 1000 TC. Ultra-breathable, silky, and featherweight.',
    winner: true,
  },
  {
    criterion: 'Inspection Standards',
    massMarket: 'Random sample check (less than 1 in 100 inspected). Frequent sewing defects.',
    jorique: '100% Pre-Dispatch Inspection. Every single piece is photographed & logged before sealing.',
    winner: true,
  },
  {
    criterion: 'Defect Protection',
    massMarket: 'Vague dispute timelines, return rejection, or weeks of frustrating back-and-forth.',
    jorique: 'Mandatory 360° Unboxing Video protocol — zero debate, immediate 48h priority replacement.',
    winner: true,
  },
  {
    criterion: 'Longevity & Feel',
    massMarket: 'Pills, fades, and coarsens after 3 to 5 washes as artificial silicone wash washes out.',
    jorique: 'Naturally softens and gains heirloom character with every wash, lasting years.',
    winner: true,
  },
];

export default function CraftsmanshipHeritageSection() {
  const [activeTab, setActiveTab] = useState<'pillars' | 'comparison' | 'guarantee'>('pillars');

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2]/85 dark:bg-[#12100E]/90 backdrop-blur-xs border-t border-border/80 dark:border-[#2E2925] transition-colors duration-300 relative overflow-hidden">
      {/* Subtle Ambient Brand Glows */}
      <div
        className="absolute top-1/4 -left-40 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #C6A96B 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full pointer-events-none opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #0B5F61 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-white/5 border border-border dark:border-[#2E2925] text-secondary dark:text-[#C6A96B] text-[11px] font-semibold tracking-[0.3em] uppercase mb-4 shadow-xs">
            <Sparkles size={13} className="text-[#C6A96B]" />
            <span>The Atelier Benchmark</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-primary dark:text-white tracking-tight uppercase leading-tight mb-4">
            Why Maison JORIQUE
          </h2>

          <p className="text-sm sm:text-base text-secondary/90 dark:text-white/70 font-sans leading-relaxed">
            Where comfort meets design. Discover the architectural thread densities, pure certified organic fibers, and
            transparent inspection standards that distinguish our creations from ordinary home textiles.
          </p>

          {/* Interactive Mode Tabs */}
          <div className="inline-flex rounded-2xl bg-white dark:bg-[#1A1816] p-1.5 border border-border/80 dark:border-white/10 mt-8 shadow-sm">
            <button
              onClick={() => setActiveTab('pillars')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'pillars'
                  ? 'bg-primary text-white dark:bg-[#C6A96B] dark:text-black shadow-sm'
                  : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
              }`}
            >
              4 Craft Pillars
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'comparison'
                  ? 'bg-primary text-white dark:bg-[#C6A96B] dark:text-black shadow-sm'
                  : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
              }`}
            >
              Benchmark Comparison
            </button>
            <button
              onClick={() => setActiveTab('guarantee')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'guarantee'
                  ? 'bg-primary text-white dark:bg-[#C6A96B] dark:text-black shadow-sm'
                  : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
              }`}
            >
              48-Hr Video Guarantee
            </button>
          </div>
        </div>

        {/* TAB 1: 4 CRAFT PILLARS */}
        {activeTab === 'pillars' && (
          <motion.div
            key="pillars"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {CRAFT_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="rounded-[32px] p-8 sm:p-10 bg-white dark:bg-[#1A1816] border border-border/80 dark:border-white/10 hover:border-[#C6A96B]/50 dark:hover:border-[#C6A96B]/50 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
              >
                {/* Subtle Card Header Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} pointer-events-none opacity-70`} />

                <div className="relative z-10 space-y-6">
                  {/* Top Bar: Icon + Metric Counter */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5EDE3] dark:bg-white/5 border border-border/70 dark:border-white/10 flex items-center justify-center shadow-xs">
                      {pillar.icon}
                    </div>

                    <div className="text-right">
                      <span className="font-times text-2xl sm:text-3xl font-bold text-primary dark:text-[#C6A96B] tabular-nums block">
                        {pillar.metric}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-secondary/80 dark:text-white/50 block font-sans">
                        {pillar.metricLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title & Tag */}
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-cream dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-secondary dark:text-[#C6A96B] border border-border/60 dark:border-white/10 mb-2 font-sans">
                      {pillar.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary dark:text-white tracking-tight uppercase">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-semibold tracking-wide text-secondary/70 dark:text-white/50 mt-1 font-sans">
                      {pillar.subtitle}
                    </p>
                  </div>

                  {/* Narrative Body */}
                  <p className="text-xs sm:text-sm text-secondary/90 dark:text-white/70 leading-relaxed font-sans">
                    {pillar.description}
                  </p>

                  {/* Key Highlights Checklist */}
                  <ul className="space-y-2 pt-2 border-t border-border/50 dark:border-white/5">
                    {pillar.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-primary/90 dark:text-white/80 font-sans">
                        <CheckCircle2 size={14} className="text-[#C6A96B] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TAB 2: BENCHMARK COMPARISON TABLE */}
        {activeTab === 'comparison' && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-[32px] bg-white dark:bg-[#1A1816] border border-border/80 dark:border-white/10 shadow-xl overflow-hidden p-6 sm:p-10"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-border/80 dark:border-white/10 pb-4">
                    <th className="py-4 px-4 text-xs font-bold tracking-widest uppercase text-secondary dark:text-white/60 font-sans w-1/4">
                      Engineering Standard
                    </th>
                    <th className="py-4 px-4 text-xs font-bold tracking-widest uppercase text-secondary/70 dark:text-white/40 font-sans w-3/8">
                      Conventional Commercial Bedding
                    </th>
                    <th className="py-4 px-4 text-xs font-bold tracking-widest uppercase text-[#C6A96B] font-sans w-3/8">
                      ✨ Maison JORIQUE Atelier
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 dark:divide-white/5 text-xs sm:text-sm">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F5EDE3]/30 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-semibold text-primary dark:text-white font-serif">
                        {row.criterion}
                      </td>
                      <td className="py-4 px-4 text-secondary dark:text-white/60 font-sans leading-relaxed">
                        <div className="flex items-start gap-2">
                          <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                          <span>{row.massMarket}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-primary dark:text-[#FCFAF7] font-sans leading-relaxed font-medium bg-[#C6A96B]/5 dark:bg-[#C6A96B]/10 rounded-xl">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="text-[#C6A96B] shrink-0 mt-0.5" />
                          <span>{row.jorique}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary dark:text-white/60">
              <p>Every piece is certified under the strict JORIQUE Authenticity Standard.</p>
              <Link
                to="/return-policy"
                className="font-bold text-primary dark:text-[#C6A96B] hover:underline inline-flex items-center gap-1.5"
              >
                <span>Read Full Official Return & Inspection Policy</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* TAB 3: 48-HOUR VIDEO GUARANTEE PROTOCOL */}
        {activeTab === 'guarantee' && (
          <motion.div
            key="guarantee"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-[32px] bg-white dark:bg-[#1A1816] border border-border/80 dark:border-white/10 shadow-xl p-8 sm:p-12 relative overflow-hidden"
          >
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Highlight Header */}
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-sm">
                  <Video size={28} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary dark:text-white uppercase tracking-tight">
                  Mandatory 360° Unboxing Video Policy
                </h3>
                <p className="text-xs sm:text-sm text-secondary dark:text-white/70 font-sans max-w-xl mx-auto leading-relaxed">
                  Because every JORIQUE parcel undergoes rigorous pre-dispatch photographic documentation before being sealed,
                  video evidence from before opening the courier bag guarantees zero hassle for approved claims.
                </p>
              </div>

              {/* 4 Steps Protocol */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {[
                  {
                    step: '01',
                    title: 'Pre-Dispatch Registry',
                    desc: 'Our quality team inspects every seam and stamps the package logged in the registry.',
                  },
                  {
                    step: '02',
                    title: 'Inspect Before Cutting',
                    desc: 'Start recording showing all 4 intact sides and the clear shipping label on the package.',
                  },
                  {
                    step: '03',
                    title: 'Continuous 360° Video',
                    desc: 'Keep the camera recording without pauses or cuts while unboxing the textile for the first time.',
                  },
                  {
                    step: '04',
                    title: '48-Hour Priority Swap',
                    desc: 'Report any transit defect on WhatsApp or email within 48 hours for immediate replacement.',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#201D1B] border border-border/70 dark:border-white/10 space-y-2 relative"
                  >
                    <span className="font-times text-2xl font-bold text-[#C6A96B] block">
                      {item.step}
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white font-sans">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-secondary dark:text-white/60 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Banner */}
              <div className="p-6 rounded-2xl bg-cream/50 dark:bg-white/5 border border-[#C6A96B]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-primary dark:text-white font-sans">
                  <span className="font-bold block text-sm mb-0.5">Need concierge claim assistance?</span>
                  <span className="text-secondary dark:text-white/70">
                    Our WhatsApp concierge team responds directly to video submissions.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/return-policy"
                    className="px-5 py-2.5 rounded-full border border-primary dark:border-white text-xs font-semibold tracking-wider uppercase text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                  >
                    Policy Details
                  </Link>
                  <Link
                    to="/connect"
                    className="px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#1EBE5D] transition-all shadow-sm"
                  >
                    WhatsApp Care
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom Trust Metrics Strip */}
        <div className="mt-14 pt-10 border-t border-border/80 dark:border-[#2E2925] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="font-times text-3xl sm:text-4xl font-bold text-primary dark:text-[#C6A96B] tabular-nums block">
              100%
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/60 font-sans mt-1 block">
              Certified Organic Cotton
            </span>
          </div>
          <div>
            <span className="font-times text-3xl sm:text-4xl font-bold text-primary dark:text-[#C6A96B] tabular-nums block">
              1000 TC
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/60 font-sans mt-1 block">
              Single-Ply True Density
            </span>
          </div>
          <div>
            <span className="font-times text-3xl sm:text-4xl font-bold text-primary dark:text-[#C6A96B] tabular-nums block">
              48 Hours
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/60 font-sans mt-1 block">
              Direct Claim Resolution
            </span>
          </div>
          <div>
            <span className="font-times text-3xl sm:text-4xl font-bold text-primary dark:text-[#C6A96B] tabular-nums block">
              0%
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/60 font-sans mt-1 block">
              Synthetic Chemical Waxes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
