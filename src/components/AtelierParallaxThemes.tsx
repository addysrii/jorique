import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Sparkles,
  Compass,
  ArrowRight,
  ShoppingBag,
  Check,
  Sun,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface ParallaxTheme {
  id: string;
  name: string;
  subtitle: string;
  collection: string;
  tagline: string;
  description: string;
  lightingTemp: string;
  lightingIcon: 'candle' | 'sun' | 'moon' | 'breeze';
  accentColor: string;
  accentSecondary: string;
  bgGradientLight: string;
  bgGradientDark: string;
  image: string;
  price: number;
  originalPrice: number;
  sku: string;
  swatches: { name: string; hex: string }[];
  specs: { label: string; value: string }[];
  hotspots: {
    id: string;
    title: string;
    desc: string;
    top: string;
    left: string;
  }[];
}

const PARALLAX_THEMES: ParallaxTheme[] = [
  {
    id: 'imperial-royale',
    name: 'The Imperial Royale',
    subtitle: 'Midnight Obsidian & 24K Champagne Gold',
    collection: 'Heritage Atelier',
    tagline: 'Deep velvet shadows and warm candlelight glow for heirloom master bedrooms.',
    description:
      'Engineered with an 800-thread count calendered sateen weave that catches ambient chandelier light, delivering zero-friction contact and regal drape.',
    lightingTemp: '2400K Candlelit Amber',
    lightingIcon: 'candle',
    accentColor: '#D4AF37',
    accentSecondary: '#0B5F61',
    bgGradientLight: 'from-[#FAF6EF] via-[#F4EDE1] to-[#EFE4D2]',
    bgGradientDark: 'from-[#141210] via-[#1B1815] to-[#0D0C0B]',
    image: '/Products/1.jpg',
    price: 3499,
    originalPrice: 4999,
    sku: 'JRQ-ROYAL-800',
    swatches: [
      { name: 'Obsidian Black', hex: '#1C1917' },
      { name: 'Imperial Gold', hex: '#D4AF37' },
      { name: 'Deep Crimson', hex: '#0B5F61' },
    ],
    specs: [
      { label: 'Weave', value: 'Liquid Sateen' },
      { label: 'Thread Count', value: '800 TC' },
      { label: 'Fiber', value: 'Giza Long-Staple' },
      { label: 'Friction', value: '-65% Facial Drag' },
    ],
    hotspots: [
      {
        id: 'hs-1',
        title: 'Calendered Luster Finish',
        desc: 'Hot-pressed cylinders compress threads for a mirror-smooth liquid sheen.',
        top: '32%',
        left: '42%',
      },
      {
        id: 'hs-2',
        title: 'Snug-Grip 18" Pockets',
        desc: 'Custom continuous elastic band keeps fitted sheet taut without bunching.',
        top: '72%',
        left: '26%',
      },
      {
        id: 'hs-3',
        title: 'Airflow Micropores',
        desc: 'Active thermoregulation channels balance body heat throughout the night.',
        top: '48%',
        left: '68%',
      },
    ],
  },
  {
    id: 'aegean-sanctuary',
    name: 'The Aegean Villa',
    subtitle: 'Santorini Crisp Ivory & Soft Sea-Foam',
    collection: 'Mediterranean Pure',
    tagline: 'Sun-drenched morning light, coastal breezes, and pure breathable serenity.',
    description:
      'Woven from 100% certified organic long-staple cotton fibers that breathe freely, keeping you cool during warm summer nights with crisp, cloud-soft tactile drape.',
    lightingTemp: '5000K Natural Daylight',
    lightingIcon: 'sun',
    accentColor: '#38BDF8',
    accentSecondary: '#C4A482',
    bgGradientLight: 'from-[#F0F9FF] via-[#E6F4FE] to-[#F8FAFC]',
    bgGradientDark: 'from-[#0B1520] via-[#111E2E] to-[#0A1017]',
    image: '/Products/2.jpg',
    price: 2999,
    originalPrice: 4299,
    sku: 'JRQ-AEGEAN-600',
    swatches: [
      { name: 'Pure Chalk Ivory', hex: '#F8FAFC' },
      { name: 'Aegean Azure', hex: '#38BDF8' },
      { name: 'Warm Dune', hex: '#C4A482' },
    ],
    specs: [
      { label: 'Weave', value: 'Crisp Percale' },
      { label: 'Thread Count', value: '600 TC' },
      { label: 'Airflow', value: '+40% Breathability' },
      { label: 'Touch', value: 'Matte Cool' },
    ],
    hotspots: [
      {
        id: 'hs-4',
        title: 'Micro-Airflow Weave',
        desc: 'Open grid percale construction dissipates body heat 40% faster.',
        top: '36%',
        left: '52%',
      },
      {
        id: 'hs-5',
        title: 'Hypoallergenic Organic Cotton',
        desc: 'GOTS certified zero chemical defoliants, suitable for sensitive skin.',
        top: '64%',
        left: '38%',
      },
    ],
  },
  {
    id: 'kyoto-pavilion',
    name: 'The Kyoto Zen Pavilion',
    subtitle: 'Wabi-Sabi Cedar Taupe & Moss Olive',
    collection: 'Nature & Solitude',
    tagline: 'Filtered shoji daylight, earthy organic tranquility, and restorative slumber.',
    description:
      'Inspired by timeless Japanese wabi-sabi architecture. Warm cedar hues and rich organic textures foster deep sensory relaxation and mindfulness.',
    lightingTemp: '3200K Filtered Shoji Warmth',
    lightingIcon: 'moon',
    accentColor: '#10B981',
    accentSecondary: '#A89F91',
    bgGradientLight: 'from-[#F5F7F2] via-[#EBEFE6] to-[#E3E8DC]',
    bgGradientDark: 'from-[#0E1511] via-[#141E18] to-[#0B100D]',
    image: '/Products/3.jpg',
    price: 3299,
    originalPrice: 4599,
    sku: 'JRQ-KYOTO-700',
    swatches: [
      { name: 'Moss Olive', hex: '#2E4C38' },
      { name: 'Cedar Taupe', hex: '#A89F91' },
      { name: 'Smoked Oat', hex: '#D7CEC2' },
    ],
    specs: [
      { label: 'Weave', value: 'Washed Botanical' },
      { label: 'Thread Count', value: '700 TC' },
      { label: 'Dyes', value: 'Low-Impact Eco' },
      { label: 'Texture', value: 'Relaxed Velvet' },
    ],
    hotspots: [
      {
        id: 'hs-6',
        title: 'Botanical Garment Wash',
        desc: 'Softened with pure natural plant extracts for unmatched broken-in comfort.',
        top: '40%',
        left: '48%',
      },
      {
        id: 'hs-7',
        title: 'Twin Reinforced Hem',
        desc: 'Double-needle heirloom stitch detail protects edges from wear across decades.',
        top: '76%',
        left: '58%',
      },
    ],
  },
  {
    id: 'haussmann-atelier',
    name: 'The Parisian Haussmann',
    subtitle: 'Classical Plaster & Twilight Rose',
    collection: 'Old World Grandeur',
    tagline: 'Sunset twilight over zinc rooftops, vintage brass, and soft romantic drape.',
    description:
      'Tailored with Parisian architectural restraint. Subtle dusty rose tones harmonize with vintage carved wood and modern minimalist apartments.',
    lightingTemp: '2800K Paris Twilight',
    lightingIcon: 'breeze',
    accentColor: '#F472B6',
    accentSecondary: '#C6A96B',
    bgGradientLight: 'from-[#FDF4F5] via-[#FAEBED] to-[#F5E1E4]',
    bgGradientDark: 'from-[#1A1215] via-[#24171D] to-[#130D10]',
    image: '/Products/5.jpg',
    price: 3699,
    originalPrice: 5199,
    sku: 'JRQ-HAUSSMANN-800',
    swatches: [
      { name: 'Twilight Rose', hex: '#E0A899' },
      { name: 'Plaster White', hex: '#FDFCFA' },
      { name: 'Parisian Gilt', hex: '#C6A96B' },
    ],
    specs: [
      { label: 'Weave', value: 'French Calendered' },
      { label: 'Thread Count', value: '800 TC' },
      { label: 'Touch', value: 'Cashmere-Soft' },
      { label: 'Finish', value: 'Silken Drape' },
    ],
    hotspots: [
      {
        id: 'hs-8',
        title: 'Cashmere-Touch Finish',
        desc: 'Exclusive mechanical brushing gives Egyptian cotton an ultra-plush velvet nap.',
        top: '35%',
        left: '44%',
      },
      {
        id: 'hs-9',
        title: 'Mitered Luxury Borders',
        desc: 'Hand-sewn mitered flange gives pillows and top sheets a bespoke tailored drape.',
        top: '68%',
        left: '72%',
      },
    ],
  },
];

export default function AtelierParallaxThemes() {
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const theme = PARALLAX_THEMES[activeThemeIndex];

  // Mouse tilt physics for spatial depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 120, damping: 18, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax layers transform
  const bgTranslateX = useTransform(smoothX, [-0.5, 0.5], ['-24px', '24px']);
  const bgTranslateY = useTransform(smoothY, [-0.5, 0.5], ['-24px', '24px']);
  const stageRotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const stageRotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const specularX = useTransform(smoothX, [-0.5, 0.5], ['10%', '90%']);
  const specularY = useTransform(smoothY, [-0.5, 0.5], ['10%', '90%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Close hotspot when clicking elsewhere
  useEffect(() => {
    const handleDocumentClick = () => setActiveHotspotId(null);
    window.addEventListener('click', handleDocumentClick);
    return () => window.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleAddCurrentToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dummyProduct: Product = {
      id: theme.id,
      sku: theme.sku,
      name: `${theme.name} Luxury Set`,
      description: theme.description,
      price: theme.originalPrice,
      discount_price: theme.price,
      images: [theme.image],
      category: theme.collection,
      featured: true,
      in_stock: true,
    };
    addToCart(dummyProduct, 1);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-24 lg:py-36 overflow-hidden select-none border-b border-border/80 dark:border-[#2E2925] transition-colors duration-700 bg-background dark:bg-[#0E0D0C]"
    >
      {/* ── REAL-TIME THEMED ATMOSPHERE AURA ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-b ${theme.bgGradientLight} dark:${theme.bgGradientDark} transition-all duration-700 pointer-events-none`}
        >
          {/* Subtle Ambient Vignette & Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.75)_100%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-15 dark:opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Floating dynamic color glow orb */}
          <motion.div
            style={{
              x: bgTranslateX,
              y: bgTranslateY,
              backgroundColor: theme.accentColor,
            }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] rounded-full blur-[140px] pointer-events-none opacity-45 dark:opacity-30"
          />
        </motion.div>
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* ── HEADER & THEME SWITCHER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 lg:mb-16">
          <div className="max-w-2xl space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 dark:bg-white/10 border border-border dark:border-white/15 backdrop-blur-md shadow-2xs text-[11px] font-bold tracking-[0.25em] uppercase text-primary dark:text-[#D4AF37]"
            >
              <Sparkles size={13} style={{ color: theme.accentColor }} />
              <span>Interactive 3D Parallax Themes</span>
            </motion.div>

            <h2 className="text-3xl sm:text-5xl font-serif font-light text-primary dark:text-white tracking-wide leading-tight">
              Architectural Living Spaces
            </h2>

            <p className="text-xs sm:text-sm text-secondary dark:text-white/70 font-sans leading-relaxed max-w-xl">
              Experience our luxury beddings inside 4 meticulously curated architectural atmospheres.
              Hover and tilt to explore light refractions and fabric drape.
            </p>
          </div>

          {/* ── THEME SELECTOR PILL TABS ── */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/60 dark:bg-[#1A1816]/80 backdrop-blur-xl border border-border/80 dark:border-[#2E2925] shadow-md">
            {PARALLAX_THEMES.map((item, index) => {
              const isSelected = index === activeThemeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveThemeIndex(index);
                    setActiveHotspotId(null);
                  }}
                  className={`relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                    isSelected
                      ? 'text-white shadow-lg scale-100'
                      : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                  }`}
                  style={{
                    backgroundColor: isSelected ? theme.accentColor : 'transparent',
                    color: isSelected ? (theme.id === 'aegean-sanctuary' ? '#0F172A' : '#FFFFFF') : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-white/50"
                    style={{ backgroundColor: item.accentColor }}
                  />
                  <span>{item.name.replace('The ', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3D PARALLAX STAGE & EDITORIAL DETAILS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ── LEFT: 3D INTERACTIVE TILT BEDROOM STAGE (lg:col-span-7) ── */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              style={{ perspective: '1400px' }}
              className="w-full max-w-xl aspect-[4/3] sm:aspect-[16/11] relative"
            >
              <motion.div
                style={{
                  rotateX: stageRotateX,
                  rotateY: stageRotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="w-full h-full relative rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.25)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.7)] border-2 border-white/80 dark:border-white/15 bg-black"
              >
                {/* Product Theme Image with Smooth Crossfade */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme.id}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <img
                      src={theme.image}
                      alt={theme.name}
                      className="w-full h-full object-cover select-none"
                    />

                    {/* Specular Light Flare Reflection that follows mouse */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                      style={{
                        background: useTransform(
                          [specularX, specularY],
                          ([x, y]) =>
                            `radial-gradient(circle 350px at ${x} ${y}, rgba(255,255,255,0.7) 0%, transparent 70%)`
                        ),
                      }}
                    />

                    {/* Architectural Ambient Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* ── INTERACTIVE HOTSPOTS (Pins with radar pulse) ── */}
                {theme.hotspots.map((hs) => {
                  const isActive = activeHotspotId === hs.id;
                  return (
                    <div
                      key={hs.id}
                      style={{ top: hs.top, left: hs.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspotId(isActive ? null : hs.id);
                      }}
                    >
                      {/* Pulse ring */}
                      <span
                        className="absolute -inset-2 rounded-full animate-ping opacity-60 pointer-events-none"
                        style={{ backgroundColor: theme.accentColor }}
                      />

                      {/* Center Pin Button */}
                      <button
                        className="relative w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xl backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 border-2 border-white"
                        style={{ backgroundColor: theme.accentColor }}
                        aria-label={hs.title}
                      >
                        <Sparkles size={13} className="text-white" />
                      </button>

                      {/* Glassmorphic Hotspot Card Popover */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute bottom-9 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/20 text-white shadow-2xl z-40 space-y-1.5"
                          >
                            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-[#D4AF37]">
                              <Check size={11} />
                              <span>Verified Feature</span>
                            </div>
                            <h4 className="text-xs font-bold font-serif text-white">{hs.title}</h4>
                            <p className="text-[11px] text-white/80 leading-relaxed font-sans">{hs.desc}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Bottom Overlay Info Tag */}
                <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-xs">
                    <Sun size={13} style={{ color: theme.accentColor }} />
                    <span className="font-mono text-[11px]">{theme.lightingTemp}</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-xs">
                    <span className="font-semibold text-[11px] uppercase tracking-wider">{theme.collection}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Micro Helper Note */}
            <p className="text-[11px] text-secondary/70 dark:text-white/50 text-center mt-4 italic flex items-center gap-1.5">
              <Compass size={12} className="text-[#D4AF37]" />
              <span>Hover & tilt cursor for multi-axis 3D perspective. Click pulsing pins to inspect fabric engineering.</span>
            </p>
          </div>

          {/* ── RIGHT: CURATED EDITORIAL & QUICK CONVERSION (lg:col-span-5) ── */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                <div>
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.25em] block mb-1.5"
                    style={{ color: theme.accentColor }}
                  >
                    {theme.subtitle}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-serif font-light text-primary dark:text-white leading-tight">
                    {theme.name}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-secondary dark:text-white/80 leading-relaxed font-sans">
                  {theme.description}
                </p>

                {/* 4 Technical Specs Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {theme.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/70 dark:bg-[#1A1816] border border-border/80 dark:border-[#2E2925] shadow-2xs"
                    >
                      <p className="text-[10px] uppercase tracking-wider font-medium text-secondary/70 dark:text-white/50">
                        {spec.label}
                      </p>
                      <p className="text-xs font-bold text-primary dark:text-white mt-0.5">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Color Swatches */}
                <div className="pt-2 space-y-2">
                  <p className="text-[11px] uppercase tracking-widest font-semibold text-secondary dark:text-white/60">
                    Curated Color Palette:
                  </p>
                  <div className="flex items-center gap-3">
                    {theme.swatches.map((swatch, idx) => (
                      <div key={idx} className="flex items-center gap-2 group">
                        <span
                          className="w-5 h-5 rounded-full border border-black/20 dark:border-white/30 shadow-xs"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-xs text-primary dark:text-white/80 font-medium">
                          {swatch.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and Instant Actions with Stoa Paris Times Numbers */}
                <div className="p-4 rounded-2xl bg-cream/40 dark:bg-[#1A1816] border border-border/80 dark:border-[#2E2925] flex items-center justify-between gap-4 pt-4">
                  <div>
                    <div className="flex items-baseline gap-2 font-times tabular-nums">
                      <span className="text-2xl font-bold text-primary dark:text-[#D4AF37]">
                        ₹{theme.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-secondary/60 dark:text-white/40 line-through">
                        ₹{theme.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Instant 10% Off via UPI/Cards
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddCurrentToCart}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md active:scale-95"
                    >
                      <ShoppingBag size={14} />
                      <span>Add to Bag</span>
                    </button>
                    <Link to="/shop">
                      <button className="p-3 rounded-xl border border-border dark:border-white/20 hover:bg-white dark:hover:bg-white/10 transition-all text-primary dark:text-white">
                        <ArrowRight size={15} />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
