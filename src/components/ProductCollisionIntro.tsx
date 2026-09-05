/**
 * ProductCollisionIntro
 *
 * Phase 1 — ENTERING:  Each product type flies in from its corner/edge
 * Phase 2 — HOLDING:   Products hold their letter formation spelling JORIQUE
 *                       (Pillows=J, Bedsheet=I, Curtain-fabric=Q, etc.)
 * Phase 3 — CONVERGING: All dots collapse to viewport center
 * Phase 4 — LOGO:       JORIQUE wordmark explodes into view
 * Phase 5 — EXIT:       Fade out on "Enter Sanctuary" click
 */
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Letter bitmaps: 5 cols × 7 rows ─────────────────────────────────────────
const MAPS: Record<string, number[][]> = {
  J: [
    [0, 0, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  O: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  R: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  I: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  Q: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0],
    [0, 1, 1, 0, 1],
  ],
  U: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
};

// ─── Layout constants ─────────────────────────────────────────────────────────
const CELL = 28;       // px per grid cell
const GAP  = 16;       // px gap between letter columns
const COLS = 5;
const ROWS = 7;
// SLOT = width of one letter + gap
const SLOT    = COLS * CELL + GAP;       // 156
const BLOCK_W = 7 * COLS * CELL + 6 * GAP; // 1076
const BLOCK_H = ROWS * CELL;            // 196

// ─── Product → Letter mapping ─────────────────────────────────────────────────
// J  = Pillows      (fly from top-left)
// O  = Blanket roll (fly from top)
// R  = Blanket      (fly from top-right)
// I  = Bedsheet     (fly from right)   — user said "bedsheet form I"
// Q  = Fabric/Drape (fly from bottom-right) — user said "curtains form Q"
// U  = Suit         (fly from bottom)
// E  = Cream Pillow (fly from left)
type Corner = 'tl' | 't' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l';

const LETTER_CFG: Record<string, { src: string; label: string; corner: Corner; color: string }> = {
  J: { src: '/JORIQUE/cutouts/floral-pillow.png',  label: 'Pillows',   corner: 'tl', color: '#e8c4a0' },
  O: { src: '/JORIQUE/cutouts/rolled-blanket.png', label: 'Blankets',  corner: 't',  color: '#c9b99a' },
  R: { src: '/JORIQUE/cutouts/blanket.png',        label: 'Throws',    corner: 'tr', color: '#bfb09a' },
  I: { src: '/JORIQUE/cutouts/bedsheet-set.png',   label: 'Bedsheets', corner: 'r',  color: '#d4c4a8' },
  Q: { src: '/JORIQUE/cutouts/pink-pillow.png',    label: 'Drapes',    corner: 'br', color: '#d4a4b0' },
  U: { src: '/JORIQUE/cutouts/suit.png',           label: 'Suits',     corner: 'b',  color: '#a0a8b8' },
  E: { src: '/JORIQUE/cutouts/cream-pillow.png',   label: 'Cushions',  corner: 'l',  color: '#d8c8a4' },
};

const WORD = 'JORIQUE';

// ─── Helper: off-screen corner start position ────────────────────────────────
function cornerOffset(c: Corner, W: number, H: number) {
  const ox = W * 0.68, oy = H * 0.68;
  switch (c) {
    case 'tl': return { x: -ox,       y: -oy };
    case 't':  return { x: 0,         y: -oy * 1.1 };
    case 'tr': return { x: ox,        y: -oy };
    case 'r':  return { x: ox * 1.15, y: 0 };
    case 'br': return { x: ox,        y: oy };
    case 'b':  return { x: 0,         y: oy * 1.1 };
    case 'bl': return { x: -ox,       y: oy };
    case 'l':  return { x: -ox * 1.15, y: 0 };
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Dot {
  id: string;
  letter: string;
  src: string;
  tx: number; ty: number;   // target (unscaled, relative to viewport center)
  sx: number; sy: number;   // start (off-screen, relative to viewport center)
  delay: number;
}

type Phase = 'entering' | 'holding' | 'converging' | 'logo' | 'exit';

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductCollisionIntro({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<Phase>('entering');
  const [mounted, setMounted] = useState(true);
  const [scale, setScale]   = useState(1);
  const [vp,    setVp]      = useState({ w: 1440, h: 900 });

  // Responsive scale so formation fits the screen
  useEffect(() => {
    const recalc = () => {
      const w = window.innerWidth, h = window.innerHeight;
      setVp({ w, h });
      setScale(Math.min(1, (w * 0.88) / BLOCK_W));
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, []);

  // Phase timeline
  useEffect(() => {
    // All products finish entering by ~2.6s; hold until 5.1s; converge 0.8s; logo at 5.9s
    const t = [
      setTimeout(() => setPhase('holding'),    2700),
      setTimeout(() => setPhase('converging'), 5200),
      setTimeout(() => setPhase('logo'),       5950),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  // Pre-compute all dots
  const dots = useMemo<Dot[]>(() => {
    const result: Dot[] = [];
    WORD.split('').forEach((letter, li) => {
      const cfg = LETTER_CFG[letter];
      const start = cornerOffset(cfg.corner, vp.w, vp.h);
      let dotIdx = 0;

      MAPS[letter].forEach((row, ri) =>
        row.forEach((filled, ci) => {
          if (!filled) return;

          // Target: center of cell, relative to viewport center
          const tx = -BLOCK_W / 2 + li * SLOT + ci * CELL + CELL / 2;
          const ty = -BLOCK_H / 2 + ri * CELL + CELL / 2;

          // Start: near corner with individual jitter
          const jx = (Math.random() - 0.5) * 80;
          const jy = (Math.random() - 0.5) * 80;

          result.push({
            id: `${letter}-${ri}-${ci}`,
            letter,
            src: cfg.src,
            tx, ty,
            sx: start.x + jx,
            sy: start.y + jy,
            // Stagger: letter index × 0.13s + dot index × 0.022s
            delay: li * 0.13 + dotIdx * 0.022,
          });
          dotIdx++;
        })
      );
    });
    return result;
  }, [vp]);

  const handleEnter = () => {
    setPhase('exit');
    setTimeout(() => { setMounted(false); onComplete?.(); }, 700);
  };

  const handleSkip = () => {
    setPhase('exit');
    setTimeout(() => { setMounted(false); onComplete?.(); }, 380);
  };

  if (!mounted) return null;

  const converging = phase === 'converging' || phase === 'logo' || phase === 'exit';
  const showLogo   = phase === 'logo'        || phase === 'exit';

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#060509] overflow-hidden select-none"
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* ── Ambient golden pulse ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: converging
            ? 'radial-gradient(circle 1000px at 50% 50%, rgba(198,169,107,0.22) 0%, transparent 65%)'
            : 'radial-gradient(circle 350px at 50% 50%, rgba(198,169,107,0.05) 0%, transparent 70%)',
        }}
        transition={{ duration: 0.9 }}
      />

      {/* ── Skip button ── */}
      <AnimatePresence>
        {!showLogo && (
          <motion.button
            key="skip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
            onClick={handleSkip}
            className="absolute top-7 right-8 z-50 px-4 py-1.5 rounded-full border border-white/12 text-[11px] font-medium uppercase tracking-[0.22em] text-white/45 hover:text-[#C6A96B] hover:border-[#C6A96B]/35 transition-all duration-300"
          >
            Skip →
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Legend: product labels per letter (visible during 'holding') ── */}
      <AnimatePresence>
        {phase === 'holding' && (
          <motion.div
            key="legend"
            className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 pointer-events-none"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {WORD.split('').map((l) => (
              <div key={l} className="flex flex-col items-center gap-1">
                <span
                  className="font-serif text-base font-light"
                  style={{ color: LETTER_CFG[l].color }}
                >
                  {l}
                </span>
                <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-white/40">
                  {LETTER_CFG[l].label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PRODUCT DOTS ── */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute pointer-events-none"
          style={{
            left:       '50%',
            top:        '50%',
            width:      CELL - 2,
            height:     CELL - 2,
            marginLeft: -(CELL - 2) / 2,
            marginTop:  -(CELL - 2) / 2,
          }}
          initial={{ x: dot.sx, y: dot.sy, opacity: 0, scale: 1.8 }}
          animate={
            converging
              ? { x: 0, y: 0, scale: 0.04, opacity: 0 }
              : {
                  x: dot.tx * scale,
                  y: dot.ty * scale,
                  opacity: 1,
                  scale: 1,
                }
          }
          transition={
            converging
              ? {
                  duration: 0.52,
                  ease: [0.62, 0, 0.98, 0.35],
                }
              : {
                  x:       { delay: dot.delay, duration: 0.88, ease: [0.22, 1, 0.36, 1] },
                  y:       { delay: dot.delay, duration: 0.88, ease: [0.22, 1, 0.36, 1] },
                  opacity: { delay: dot.delay, duration: 0.35 },
                  scale:   { delay: dot.delay, duration: 0.65, ease: 'backOut' },
                }
          }
        >
          <img
            src={dot.src}
            alt=""
            draggable={false}
            className="w-full h-full object-contain"
            style={{
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.95)) drop-shadow(0 0 4px rgba(198,169,107,0.18))',
            }}
          />
        </motion.div>
      ))}

      {/* ── Phase caption ── */}
      <AnimatePresence mode="wait">
        {!showLogo && (
          <motion.p
            key={phase}
            className="absolute bottom-10 inset-x-0 text-center text-[10px] font-mono uppercase tracking-[0.32em] text-[#C6A96B]/50 pointer-events-none z-30"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {phase === 'entering'
              ? '— Introducing the Collection —'
              : phase === 'holding'
              ? '— JORIQUE Maison —'
              : '— One Vision —'}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Shockwave ring on convergence ── */}
      <AnimatePresence>
        {phase === 'converging' && (
          <motion.div
            key="shock"
            className="absolute rounded-full border-2 border-[#C6A96B]/55 pointer-events-none"
            style={{ left: '50%', top: '50%', translateX: '-50%', translateY: '-50%' }}
            initial={{ width: 8, height: 8, opacity: 1 }}
            animate={{ width: 1400, height: 1400, opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* ── LOGO REVEAL ── */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            key="logo"
            className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Gold burst particles — outer ring */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`p-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width:      i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
                  height:     i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
                  background: i % 2 === 0 ? '#C6A96B' : 'rgba(255,230,150,0.6)',
                  left: '50%', top: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: Math.cos((i / 20) * Math.PI * 2) * (120 + i * 5),
                  y: Math.sin((i / 20) * Math.PI * 2) * (120 + i * 5),
                  opacity: 0,
                  scale: [0, 2, 0],
                }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: i * 0.024 }}
              />
            ))}

            {/* Inner ring */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`q-${i}`}
                className="absolute rounded-full bg-white/35 pointer-events-none"
                style={{ width: 2, height: 2, left: '50%', top: '50%' }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 10) * Math.PI * 2 + 0.3) * 55,
                  y: Math.sin((i / 10) * Math.PI * 2 + 0.3) * 55,
                  opacity: 0,
                }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.06 + i * 0.03 }}
              />
            ))}

            {/* Expanding ripple */}
            <motion.div
              className="absolute rounded-full border border-[#C6A96B]/30 pointer-events-none"
              style={{ left: '50%', top: '50%', translateX: '-50%', translateY: '-50%' }}
              initial={{ width: 20, height: 20, opacity: 0.9 }}
              animate={{ width: 800, height: 800, opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            />

            {/* J Emblem */}
            <motion.div
              initial={{ scale: 0, rotate: -120 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 290, damping: 20 }}
              className="w-20 h-20 rounded-2xl border border-[#C6A96B] bg-[#0C0A08] flex items-center justify-center mb-5"
              style={{ boxShadow: '0 0 70px rgba(198,169,107,0.45), inset 0 0 28px rgba(198,169,107,0.07)' }}
            >
              <span className="font-serif text-4xl text-[#C6A96B] font-light">J</span>
            </motion.div>

            {/* Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 32, letterSpacing: '0.7em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.22em' }}
              transition={{ delay: 0.18, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl sm:text-7xl md:text-8xl font-light uppercase text-white"
              style={{ textShadow: '0 0 120px rgba(198,169,107,0.55), 0 0 40px rgba(198,169,107,0.22)' }}
            >
              JORIQUE
            </motion.h1>

            {/* Gold rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.38, duration: 1.0 }}
              className="h-[1.5px] w-36 sm:w-60 bg-gradient-to-r from-transparent via-[#C6A96B] to-transparent my-5"
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.8 }}
              className="font-serif text-base sm:text-xl text-white/88 font-light tracking-[0.18em] uppercase mb-9"
            >
              Where Comfort Meets Design.
            </motion.p>

            {/* Enter CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.68, duration: 0.7, type: 'spring' }}
              whileHover={{ scale: 1.07, boxShadow: '0 0 60px rgba(198,169,107,0.6)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleEnter}
              className="px-12 py-4 rounded-xl bg-[#C6A96B] text-black font-sans text-xs font-bold uppercase tracking-[0.26em] hover:bg-[#d9bf7e] transition-all shadow-2xl"
            >
              Enter Sanctuary
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
