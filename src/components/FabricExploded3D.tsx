import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Sparkles, Layers, Compass, CheckCircle2, ChevronRight, Wind, ShieldCheck, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayerInfo {
  id: string;
  name: string;
  subtitle: string;
  depthLabel: string;
  metric: string;
  description: string;
  color: string;
  bgGradientLight: string;
  bgGradientDark: string;
  icon: JSX.Element;
  specs: string[];
}

const FABRIC_LAYERS: LayerInfo[] = [
  {
    id: 'layer-1',
    name: 'Liquid Sateen Calendered Sheen',
    subtitle: 'Surface Contact Layer',
    depthLabel: 'Top Surface (+180px)',
    metric: '4x Luster Finish',
    description: 'Hot-calendered cylinders compress organic fibers at microscopic precision to produce an ultra-smooth, silk-like drape that reduces facial friction.',
    color: '#D4AF37',
    bgGradientLight: 'from-[#D4AF37]/20 via-[#F7F3EB] to-white',
    bgGradientDark: 'from-[#D4AF37]/30 via-[#2A241F] to-[#181615]',
    icon: <Sparkles size={18} className="text-[#D4AF37]" />,
    specs: ['Silk-touch friction reduction', 'Hypoallergenic natural luster', 'Anti-pilling finish'],
  },
  {
    id: 'layer-2',
    name: '800-Count Single-Ply Grid',
    subtitle: 'Structural Weave Architecture',
    depthLabel: 'Middle Weave (+120px)',
    metric: '800 TC / sq. inch',
    description: 'Unmatched thread density spun from single-ply long-staple yarns for heirloom durability without stiff heaviness.',
    color: '#C4A482',
    bgGradientLight: 'from-[#C4A482]/20 via-[#F4EFEA] to-white',
    bgGradientDark: 'from-[#C4A482]/25 via-[#23201D] to-[#181615]',
    icon: <Layers size={18} className="text-[#C4A482]" />,
    specs: ['Single-ply durability', 'Zero artificial starches', 'Heirloom stitch density'],
  },
  {
    id: 'layer-3',
    name: 'Micro-Airflow Thermal Barrier',
    subtitle: 'Thermal Regulation Core',
    depthLabel: 'Core Insulation (+60px)',
    metric: 'Dynamic Thermoregulation',
    description: 'Natural micropores wick away perspiration and balance body temperature between deep REM cycles.',
    color: '#34D399',
    bgGradientLight: 'from-emerald-500/15 via-[#EDF7F2] to-white',
    bgGradientDark: 'from-emerald-500/20 via-[#1C1F1D] to-[#181615]',
    icon: <Wind size={18} className="text-emerald-500 dark:text-emerald-400" />,
    specs: ['Active humidity dissipation', 'Cooling sleep equilibrium', '360° breathability'],
  },
  {
    id: 'layer-4',
    name: '100% Giza Organic Long-Staple Cotton',
    subtitle: 'Pure Fiber Foundation',
    depthLabel: 'Base Foundation (0px)',
    metric: '100% GOTS Certified',
    description: 'Harvested by hand along the Nile delta to preserve maximum staple length, resulting in unbreakable softness that gets softer with every wash.',
    color: '#A89F91',
    bgGradientLight: 'from-amber-100/40 via-[#F9F7F4] to-white',
    bgGradientDark: 'from-white/15 via-[#201D1A] to-[#181615]',
    icon: <ShieldCheck size={18} className="text-primary dark:text-white/80" />,
    specs: ['Zero chemical defoliants', '42mm extra-long staple length', 'Ethically sourced in Portugal'],
  },
];

export default function FabricExploded3D() {
  const [explosionSpread, setExplosionSpread] = useState(1); // 0 (flat) to 1.5 (max explosion)
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tilt spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 180, damping: 22, mass: 0.7 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [22, -22]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-26, 26]);

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

  const activeLayer = FABRIC_LAYERS[activeLayerIndex];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-28 lg:py-40 bg-[#FAF9F6] dark:bg-[#121110] text-primary dark:text-white border-y border-border/70 dark:border-[#2E2925] overflow-hidden select-none transition-colors duration-300"
    >
      {/* Background Ambience and Grid */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none bg-[radial-gradient(#C4A482_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[45rem] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-white/15 backdrop-blur-md mb-4 shadow-sm"
          >
            <Sparkles size={13} className="text-[#D4AF37]" />
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary dark:text-white/90">
              Interactive 3D Deconstruction
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-light text-primary dark:text-white tracking-wide leading-tight"
          >
            The Anatomy of 800TC Luxury
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-secondary dark:text-white/60 text-sm sm:text-base font-light mt-4 leading-relaxed max-w-xl mx-auto"
          >
            Peel back the layers of microscopic textile engineering. Tilt your screen or drag the explosion slider to explore each stratum in true 3D perspective.
          </motion.p>
        </div>

        {/* 3D Exploded Stage and Specs Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: 3D Exploded Layer Canvas (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Interactive Control Pill */}
            <div className="w-full max-w-md bg-white dark:bg-white/5 backdrop-blur-xl border border-border dark:border-white/10 p-3.5 rounded-2xl mb-8 flex items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-2 text-xs text-primary dark:text-white/70 font-medium">
                <Compass size={15} className="text-[#D4AF37] animate-spin [animation-duration:10s]" />
                <span>Explosion Separation:</span>
              </div>
              
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="range"
                  min="0.2"
                  max="1.6"
                  step="0.05"
                  value={explosionSpread}
                  onChange={(e) => setExplosionSpread(parseFloat(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer h-1.5 bg-cream dark:bg-white/20 rounded-lg"
                />
                <span className="text-xs font-mono font-bold text-primary dark:text-[#D4AF37] w-12 text-right">
                  {Math.round(explosionSpread * 100)}%
                </span>
              </div>
            </div>

            {/* 3D Viewport Stage */}
            <div
              style={{ perspective: '1600px' }}
              className="w-full max-w-lg aspect-square relative flex items-center justify-center select-none"
            >
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="w-4/5 h-4/5 relative will-change-transform flex items-center justify-center"
              >
                {/* Render 4 Exploded Floating 3D Planes */}
                {FABRIC_LAYERS.map((layer, index) => {
                  const zOffset = (3 - index) * 65 * explosionSpread;
                  const isSelected = activeLayerIndex === index;

                  return (
                    <motion.div
                      key={layer.id}
                      onClick={() => setActiveLayerIndex(index)}
                      whileHover={{ scale: 1.04 }}
                      style={{
                        transform: `translate3d(0px, 0px, ${zOffset}px) rotateX(${15 * explosionSpread}deg) rotateZ(${-8 * explosionSpread}deg)`,
                        transformStyle: 'preserve-3d',
                      }}
                      className={`absolute inset-0 rounded-3xl border-2 shadow-2xl cursor-pointer transition-all duration-300 backdrop-blur-md p-6 flex flex-col justify-between overflow-hidden ${
                        isSelected
                          ? 'border-[#D4AF37] bg-gradient-to-br ' + layer.bgGradientLight + ' dark:' + layer.bgGradientDark + ' ring-4 ring-[#D4AF37]/25'
                          : 'border-border dark:border-white/20 bg-white/90 dark:bg-gradient-to-br dark:from-white/10 dark:via-black/60 dark:to-black/90 hover:border-primary/40 dark:hover:border-white/40'
                      }`}
                    >
                      {/* Subtle mesh pattern inside layer */}
                      <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[linear-gradient(45deg,#000_1px,transparent_1px),linear-gradient(-45deg,#000_1px,transparent_1px)] dark:bg-[linear-gradient(45deg,#fff_1px,transparent_1px),linear-gradient(-45deg,#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                      {/* Layer Header */}
                      <div className="relative z-10 flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-white dark:bg-black/50 border border-border dark:border-white/15 backdrop-blur-md shadow-sm">
                            {layer.icon}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary dark:text-[#D4AF37] block">
                              Layer 0{4 - index} • {layer.depthLabel}
                            </span>
                            <h4 className="text-sm font-semibold text-primary dark:text-white truncate max-w-[200px]">
                              {layer.name}
                            </h4>
                          </div>
                        </div>

                        <span className={`w-3 h-3 rounded-full border-2 transition-all ${
                          isSelected ? 'bg-[#D4AF37] border-white shadow-md' : 'border-border dark:border-white/40'
                        }`} />
                      </div>

                      {/* Layer Visual Center Badge */}
                      <div className="relative z-10 text-center py-4">
                        <span className="inline-block text-xs font-mono font-bold text-primary dark:text-white/90 px-3.5 py-1.5 rounded-full bg-white dark:bg-black/60 border border-border dark:border-white/20 backdrop-blur-md shadow-md">
                          {layer.metric}
                        </span>
                      </div>

                      {/* Layer Footer */}
                      <div className="relative z-10 flex items-center justify-between text-[11px] text-secondary dark:text-white/60 border-t border-border/80 dark:border-white/10 pt-3">
                        <span>{layer.subtitle}</span>
                        <span className="text-primary dark:text-white font-semibold hover:text-[#D4AF37] transition-colors">
                          Inspect Layer →
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            <p className="text-xs text-secondary dark:text-white/40 mt-4 inline-flex items-center gap-2">
              <Compass size={13} /> Click any floating layer in 3D space to inspect its molecular weave
            </p>
          </div>

          {/* Right Column: Deep-Dive Layer Inspector (lg:col-span-5) */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-white dark:bg-white/[0.04] border border-border dark:border-white/15 backdrop-blur-xl shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-border dark:border-white/10 pb-4">
                <div className="inline-flex items-center gap-2 text-xs text-primary dark:text-[#D4AF37] font-bold uppercase tracking-widest">
                  <Flame size={14} className="text-[#D4AF37]" /> Layer Anatomy Breakdown
                </div>
                <span className="text-xs font-mono text-secondary dark:text-white/50">0{activeLayerIndex + 1} / 04</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-secondary dark:text-white/50 uppercase tracking-widest block mb-1">
                  {activeLayer.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-light text-primary dark:text-white leading-snug">
                  {activeLayer.name}
                </h3>
              </div>

              <p className="text-sm text-secondary dark:text-white/70 font-light leading-relaxed">
                {activeLayer.description}
              </p>

              {/* Technical Specifications Checklist */}
              <div className="space-y-3 pt-2">
                {activeLayer.specs.map((spec) => (
                  <div key={spec} className="flex items-center gap-3 text-xs text-primary dark:text-white/90 font-medium">
                    <div className="w-5 h-5 rounded-full bg-cream dark:bg-[#D4AF37]/20 border border-border dark:border-[#D4AF37]/40 flex items-center justify-center shrink-0 text-primary dark:text-[#D4AF37]">
                      <CheckCircle2 size={12} />
                    </div>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              {/* Layer Switcher Pills */}
              <div className="pt-4 border-t border-border dark:border-white/10 flex gap-2">
                {FABRIC_LAYERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveLayerIndex(i)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeLayerIndex === i
                        ? 'bg-primary dark:bg-white text-white dark:text-black shadow-md'
                        : 'bg-cream/60 dark:bg-white/5 text-secondary dark:text-white/60 hover:bg-cream dark:hover:bg-white/10 hover:text-primary dark:hover:text-white'
                    }`}
                  >
                    L0{i + 1}
                  </button>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link to="/shop" className="block">
                  <button className="w-full py-4 bg-primary dark:bg-white text-white dark:text-primary rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 dark:hover:bg-cream transition-all duration-200 flex items-center justify-center gap-2 group shadow-xl">
                    <span>Shop 800TC Collection</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
