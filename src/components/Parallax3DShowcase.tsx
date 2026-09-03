import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Compass, Eye, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Parallax3DCard from './Parallax3DCard';
import { productService } from '../lib/api/products';

interface Hotspot {
  id: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  title: string;
  subtitle: string;
  description: string;
  metric: string;
  depthZ: number; // z-elevation in px
}

interface LookbookScene {
  id: string;
  title: string;
  subtitle: string;
  roomName: string;
  material: string;
  feel: string;
  price: string;
  image: string;
  swatchImage: string;
  tagline: string;
  hotspots: Hotspot[];
}

export default function Parallax3DShowcase() {
  const [scenes, setScenes] = useState<LookbookScene[]>([]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  useEffect(() => {
    async function loadScenes() {
      try {
        const prods = await productService.getProducts();
        if (prods && prods.length > 0) {
          const generated: LookbookScene[] = prods.slice(0, 4).map((p, idx) => ({
            id: p.id,
            title: p.name,
            subtitle: `${p.category || 'Artisanal'}`,
            roomName: p.category || `Collection 0${idx + 1}`,
            material: p.tags && p.tags.length > 0 ? p.tags.join(', ') : '100% Certified Long-Staple Organic Cotton',
            feel: 'Silky, breathable, luxury tactile drape',
            price: `₹${(p.discount_price || p.price).toLocaleString('en-IN')}`,
            image: p.images[0] || '/Products/1.jpg',
            swatchImage: p.images[0] || '/Products/1.jpg',
            tagline: p.description || 'Engineered for optimal sleep thermoregulation and heirloom quality durability.',
            hotspots: [
              {
                id: `hs-${idx}-1`,
                x: 48,
                y: 42,
                title: 'High-Density Weave',
                subtitle: 'Micro-Structure',
                description: 'Single-ply combed yarns woven at peak density for a liquid silk sheen that softens with every wash.',
                metric: 'Certified Organic',
                depthZ: 45,
              },
              {
                id: `hs-${idx}-2`,
                x: 72,
                y: 65,
                title: 'Calendered Luster Finish',
                subtitle: 'Tactile Engineering',
                description: 'Heated mechanical rollers align fibers to maximize skin glide and hypoallergenic smoothness.',
                metric: 'OEKO-TEX Standard 100',
                depthZ: 60,
              },
            ],
          }));
          setScenes(generated);
        }
      } catch (err) {
        console.error('Parallax3DShowcase API load error:', err);
      }
    }

    loadScenes();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const backgroundOrbY1 = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const backgroundOrbY2 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  if (scenes.length === 0) return null;
  const scene = scenes[activeSceneIndex] || scenes[0];

  return (
    <section
      ref={containerRef}
      className="relative py-24 lg:py-36 bg-white dark:bg-[#181615] text-primary dark:text-white border-y border-border/80 dark:border-[#2E2925] overflow-hidden select-none transition-colors duration-300"
    >
      {/* Background Ambience & Grid Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-15 pointer-events-none bg-[radial-gradient(#8D867F_1px,transparent_1px)] [background-size:28px_28px]" />
      
      {/* Parallax Gradient Orbs */}
      <motion.div
        style={{ y: backgroundOrbY1 }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-[#8D867F]/10 dark:bg-[#8D867F]/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: backgroundOrbY2 }}
        className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-[#C4A482]/10 dark:bg-[#C4A482]/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 lg:mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border dark:border-white/15 bg-cream dark:bg-white/5 backdrop-blur-md mb-4 shadow-sm"
            >
              <Sparkles size={13} className="text-[#D4AF37]" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-primary dark:text-white/80">
                Interactive 3D Lookbook
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-primary dark:text-white"
            >
              Dimensional Living Experience
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-secondary dark:text-white/60 text-sm sm:text-base font-light max-w-xl mt-3 leading-relaxed"
            >
              Interact in real-time 3D space. Move your cursor or tilt your screen to examine the multi-layered craftsmanship and tactile architecture of our collections.
            </motion.p>
          </div>

          {/* Lookbook Scene Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3 bg-cream/60 dark:bg-white/5 p-1.5 rounded-2xl border border-border dark:border-white/10 backdrop-blur-md">
            {scenes.map((s, idx) => {
              const isActive = idx === activeSceneIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSceneIndex(idx);
                    setActiveHotspot(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative ${
                    isActive
                      ? 'text-white dark:text-[#181615] shadow-lg'
                      : 'text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeLookbookTab"
                      className="absolute inset-0 bg-primary dark:bg-white rounded-xl"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{s.roomName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lookbook Main Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 3D Stage with Interactive Radar Hotspots */}
          <div className="lg:col-span-8 relative">
            <Parallax3DCard
              maxRotation={14}
              perspective={1400}
              glareEffect={true}
              scaleOnHover={1.02}
              className="w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-border dark:border-white/15"
            >
              <div className="w-full h-full relative rounded-3xl overflow-hidden transform-style-3d bg-[#141211]">
                
                {/* Background Layer: High-Res Scene Visual */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={scene.id}
                    src={scene.image}
                    alt={scene.title}
                    className="w-full h-full object-cover brightness-[0.88] dark:brightness-[0.82] contrast-[1.08] will-change-transform"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transform: 'translateZ(0px)' }}
                  />
                </AnimatePresence>

                {/* Subtle vignette gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                {/* Layer 2: 3D Interactive Hotspot Beacons */}
                <div className="absolute inset-0 pointer-events-auto transform-style-3d">
                  {scene.hotspots.map((hotspot) => {
                    const isSelected = activeHotspot?.id === hotspot.id;

                    return (
                      <div
                        key={hotspot.id}
                        style={{
                          left: `${hotspot.x}%`,
                          top: `${hotspot.y}%`,
                          transform: `translate3d(-50%, -50%, ${hotspot.depthZ}px)`,
                        }}
                        className="absolute transform-style-3d z-30"
                      >
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHotspot(isSelected ? null : hotspot);
                          }}
                          whileHover={{ scale: 1.25 }}
                          whileTap={{ scale: 0.9 }}
                          className="relative group/pin p-2 focus:outline-none"
                        >
                          {/* Pulsing Radar Ring */}
                          <span className="absolute inset-0 rounded-full bg-white/30 animate-ping [animation-duration:2.5s]" />
                          <span
                            className={`relative flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md border shadow-xl transition-all duration-300 ${
                              isSelected
                                ? 'bg-white text-black border-white ring-4 ring-white/30 scale-110'
                                : 'bg-black/70 text-white border-white/40 hover:bg-white hover:text-black hover:border-white'
                            }`}
                          >
                            <Sparkles size={14} />
                          </span>

                          {/* Hotspot Floating Tooltip */}
                          <div
                            className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-48 p-3 rounded-xl bg-black/85 backdrop-blur-lg border border-white/20 text-left shadow-2xl pointer-events-none transition-all duration-300 ${
                              isSelected
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-2 group-hover/pin:opacity-100 group-hover/pin:translate-y-0 group-hover/pin:scale-100'
                            }`}
                            style={{ transform: 'translateZ(20px)' }}
                          >
                            <p className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-0.5">
                              {hotspot.subtitle}
                            </p>
                            <p className="text-xs font-medium text-white line-clamp-1">
                              {hotspot.title}
                            </p>
                            <p className="text-[11px] text-white/70 mt-1 leading-snug">
                              {hotspot.metric}
                            </p>
                          </div>
                        </motion.button>
                      </div>
                    );
                  })}
                </div>

                {/* Layer 4: Floating Foreground Luxury Tag (Depth: 55px) */}
                <div
                  className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none transform-style-3d"
                  style={{ transform: 'translateZ(55px)' }}
                >
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-1">
                        {scene.subtitle}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-light text-white tracking-wide drop-shadow-md">
                        {scene.title}
                      </h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-xl text-right hidden sm:block">
                      <span className="text-[10px] text-white/70 uppercase tracking-widest block">Standard Set</span>
                      <span className="text-base font-semibold text-white">{scene.price}</span>
                    </div>
                  </div>
                </div>

              </div>
            </Parallax3DCard>

            {/* Floating 3D Companion Mini-Swatch Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -right-4 sm:-right-8 w-32 sm:w-44 bg-white/95 dark:bg-black/90 backdrop-blur-xl border border-border dark:border-white/20 rounded-2xl p-3 shadow-2xl z-30 hidden sm:block"
              style={{ transform: 'translateZ(60px)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={scene.swatchImage}
                  alt="Fabric texture swatch"
                  className="w-8 h-8 rounded-lg object-cover border border-border dark:border-white/20"
                />
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">
                    Live Swatch
                  </span>
                  <span className="text-[11px] text-primary dark:text-white/90 font-medium truncate block max-w-[90px]">
                    {scene.material.split(' ')[0]} Fiber
                  </span>
                </div>
              </div>
              <div className="h-1 w-full bg-cream dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#D4AF37] w-4/5 rounded-full" />
              </div>
            </motion.div>

          </div>

          {/* Right Column: Deep-Dive Material Anatomy & Specs */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Scene summary card */}
                <div className="bg-cream/40 dark:bg-white/[0.04] border border-border dark:border-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase text-secondary dark:text-white/50">Look #{activeSceneIndex + 1} of 3</span>
                    <span className="text-xs text-[#D4AF37] font-semibold tracking-wider uppercase flex items-center gap-1">
                      <CheckCircle2 size={12} /> Certified Organic
                    </span>
                  </div>

                  <p className="text-sm text-secondary dark:text-white/80 leading-relaxed font-light mb-6">
                    {scene.tagline}
                  </p>

                  {/* Material Specs Matrix */}
                  <div className="space-y-3.5 border-t border-border/80 dark:border-white/10 pt-5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-secondary dark:text-white/50 uppercase tracking-wider">Composition</span>
                      <span className="text-primary dark:text-white font-medium">{scene.material}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-secondary dark:text-white/50 uppercase tracking-wider">Tactile Sensation</span>
                      <span className="text-primary dark:text-white font-medium">{scene.feel}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-secondary dark:text-white/50 uppercase tracking-wider">Weave Origin</span>
                      <span className="text-primary dark:text-white font-medium">Guimarães, Portugal</span>
                    </div>
                  </div>
                </div>

                {/* Active Hotspot Inspector details */}
                {activeHotspot ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-white/15 dark:to-white/5 border border-border dark:border-white/20 shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-widest">
                        Inspected Spec
                      </span>
                      <button
                        onClick={() => setActiveHotspot(null)}
                        className="text-xs text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white"
                      >
                        Close
                      </button>
                    </div>
                    <h4 className="text-base font-medium text-primary dark:text-white mb-1.5">{activeHotspot.title}</h4>
                    <p className="text-xs text-secondary dark:text-white/70 leading-relaxed">{activeHotspot.description}</p>
                  </motion.div>
                ) : (
                  <div className="p-4 rounded-2xl bg-cream/30 dark:bg-white/[0.02] border border-dashed border-border dark:border-white/10 text-center">
                    <p className="text-xs text-secondary dark:text-white/50 inline-flex items-center gap-1.5">
                      <Eye size={13} /> Click any floating 3D beacon to inspect fiber properties
                    </p>
                  </div>
                )}

                {/* Call to Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link to="/shop" className="flex-1">
                    <button className="w-full bg-primary dark:bg-white text-white dark:text-[#181615] hover:bg-primary/90 dark:hover:bg-[#F0EDE8] py-3.5 px-6 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg">
                      <span>Order This Look</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
