import React, { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from 'framer-motion';

// ─── Brand Palette ────────────────────────────────────────────────────────────
const B = {
  ivory:     '#F5EDE3',
  black:     '#1A1A1A',
  charcoal:  '#2B2825',
  gold:      '#C6A96B',
  teal:      '#0B5F61',
  stone:     '#8A847D',
  blushWarm: '#D4956A',
  blushShy:  '#E8A898',
  white:     '#FCFAF7',
  pureWhite: '#FFFFFF',
  mouthBg:   '#1A1412',
  tongue:    '#D88579',
};

// ─── Synchronized Idle Float CSS ──────────────────────────────────────────────
const FLOAT_CSS = `
@keyframes joriqueSyncFloat {
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-10px); }
}`;
let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = FLOAT_CSS;
  document.head.appendChild(s);
  cssInjected = true;
}

// ─── Spring Physics ───────────────────────────────────────────────────────────
const BODY_SPR  = { stiffness: 60, damping: 14, mass: 1.1 };
const EYE_SPR   = { stiffness: 160, damping: 20 };
const MOUTH_SPR = { stiffness: 140, damping: 18 };
const SPR_REACT = { type: 'spring', stiffness: 280, damping: 16, mass: 1.1 } as const;
const SPR_PEEK  = { type: 'spring', stiffness: 380, damping: 20 }           as const;
const SPR_BACK  = { type: 'spring', stiffness: 140, damping: 18 }           as const;

type Emotion = 'neutral' | 'happy' | 'talking' | 'nervous' | 'shocked' | 'shy';

// ─── Eyebrow ─────────────────────────────────────────────────────────────────
function Brow({
  x, y, emotion, side, sw = 5, eyeOffY
}: {
  x: number; y: number; emotion: Emotion; side: 'left' | 'right'; sw?: number;
  eyeOffY: MotionValue<number>;
}) {
  const L = side === 'left';
  const browShiftY = useTransform(eyeOffY, yVal => y + yVal * 0.45);

  let d: string;
  let color = B.black;
  switch (emotion) {
    case 'nervous':
    case 'shy':
      d = L ? 'M -14 5 Q 0 -4 14 -7' : 'M -14 -7 Q 0 -4 14 5';
      break;
    case 'shocked':
      d = 'M -16 2 Q 0 -14 16 2';
      break;
    case 'talking':
    case 'happy':
      d = L ? 'M -14 -2 Q 0 -10 14 -4' : 'M -14 -4 Q 0 -10 14 -2';
      break;
    default:
      d = 'M -14 0 Q 0 -6 14 0';
      color = B.charcoal;
  }

  return (
    <motion.path
      d={d}
      style={{ x, y: browShiftY }}
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
    />
  );
}

// ─── Blush Cheeks ─────────────────────────────────────────────────────────────
function Blush({
  x, y, rx = 20, ry = 11, color = B.blushWarm, opacity = 0.32
}: {
  x: number; y: number; rx?: number; ry?: number; color?: string; opacity?: number;
}) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={color} opacity={opacity} />;
}

// ─── Synchronized Googly Pupil Pair ──────────────────────────────────────────
// Clean, glossy, perfectly synchronized eyes. NO flat squint rectangles!
interface PupilPairProps {
  leftClip: string;
  rightClip: string;
  lCx: number; lCy: number;
  rCx: number; rCy: number;
  socketR: number;
  pupilR: number;
  hlR: number;
  eyeOffX: MotionValue<number>;
  eyeOffY: MotionValue<number>;
  blinkMV: MotionValue<number>;
  overrideX?: number;
  overrideY?: number;
}

function PupilPair({
  leftClip, rightClip,
  lCx, lCy, rCx, rCy,
  socketR, pupilR, hlR,
  eyeOffX, eyeOffY,
  blinkMV,
  overrideX, overrideY,
}: PupilPairProps) {
  const isOverridden = overrideX !== undefined && overrideY !== undefined;

  // Compute compositor-level positions
  const lx  = useTransform(eyeOffX, x => lCx + (isOverridden ? overrideX! : x));
  const ly  = useTransform(eyeOffY, y => lCy + (isOverridden ? overrideY! : y));
  const rx_ = useTransform(eyeOffX, x => rCx + (isOverridden ? overrideX! : x));
  const ry_ = useTransform(eyeOffY, y => rCy + (isOverridden ? overrideY! : y));

  // Specular primary highlight offset (top-left of pupil)
  const lhx = useTransform(lx,  x => x - pupilR * 0.32);
  const lhy = useTransform(ly,  y => y - pupilR * 0.32);
  const rhx = useTransform(rx_, x => x - pupilR * 0.32);
  const rhy = useTransform(ry_, y => y - pupilR * 0.32);

  // Secondary ambient reflection (bottom-right)
  const lhx2 = useTransform(lx,  x => x + pupilR * 0.28);
  const lhy2 = useTransform(ly,  y => y + pupilR * 0.28);
  const rhx2 = useTransform(rx_, x => x + pupilR * 0.28);
  const rhy2 = useTransform(ry_, y => y + pupilR * 0.28);

  const lidH = socketR * 2 + 10;
  const lidW = socketR * 2 + 12;

  return (
    <>
      {/* ── LEFT EYE ── */}
      <g clipPath={`url(#${leftClip})`}>
        {/* Main glossy pupil */}
        <motion.circle
          cx={lx}
          cy={ly}
          r={pupilR}
          fill={B.black}
        />
        {/* Primary bright specular highlight */}
        <motion.circle
          cx={lhx}
          cy={lhy}
          r={hlR}
          fill={B.pureWhite}
          opacity={0.96}
        />
        {/* Secondary soft ambient reflection */}
        <motion.circle
          cx={lhx2}
          cy={lhy2}
          r={hlR * 0.45}
          fill={B.pureWhite}
          opacity={0.45}
        />
        {/* Eyelid for Blink */}
        <motion.rect
          x={lCx - socketR - 6}
          y={lCy - socketR - 5}
          width={lidW}
          height={lidH}
          fill={B.ivory}
          style={{
            scaleY: blinkMV,
            transformOrigin: `${lCx}px ${lCy - socketR}px`,
          }}
        />
      </g>

      {/* ── RIGHT EYE ── */}
      <g clipPath={`url(#${rightClip})`}>
        {/* Main glossy pupil */}
        <motion.circle
          cx={rx_}
          cy={ry_}
          r={pupilR}
          fill={B.black}
        />
        {/* Primary bright specular highlight */}
        <motion.circle
          cx={rhx}
          cy={rhy}
          r={hlR}
          fill={B.pureWhite}
          opacity={0.96}
        />
        {/* Secondary soft ambient reflection */}
        <motion.circle
          cx={rhx2}
          cy={rhy2}
          r={hlR * 0.45}
          fill={B.pureWhite}
          opacity={0.45}
        />
        {/* Eyelid for Blink */}
        <motion.rect
          x={rCx - socketR - 6}
          y={rCy - socketR - 5}
          width={lidW}
          height={lidH}
          fill={B.ivory}
          style={{
            scaleY: blinkMV,
            transformOrigin: `${rCx}px ${rCy - socketR}px`,
          }}
        />
      </g>
    </>
  );
}

// ─── Dynamic Animated Mouth with Full Movement ────────────────────────────────
interface AnimatedMouthProps {
  cx: number;
  cy: number;
  w: number;
  h: number;
  emotion: Emotion;
  mouthOffX: MotionValue<number>;
  mouthOffY: MotionValue<number>;
  cursorControlY: MotionValue<number>;
  styleType?: 'smile' | 'wide-smile' | 'round-o' | 'subtle-smile';
}

function AnimatedMouth({
  cx, cy, w, h, emotion,
  mouthOffX, mouthOffY,
  cursorControlY,
  styleType = 'smile',
}: AnimatedMouthProps) {
  // Parallax translation: mouth follows cursor horizontally and vertically
  // All hooks MUST be declared unconditionally at top of component
  const curX = useTransform(mouthOffX, x => cx + x);
  const curY = useTransform(mouthOffY, y => cy + y);
  const smileD = useTransform(cursorControlY, ctrlY => `M ${-w * 0.85} 0 Q 0 ${ctrlY} ${w * 0.85} 0 Z`);
  const tongueCy = useTransform(cursorControlY, ctrlY => ctrlY * 0.55);

  // 1. NERVOUS MOUTH (Password hidden): anxious wavy embroidery
  if (emotion === 'nervous' || emotion === 'shy') {
    return (
      <motion.g style={{ x: curX, y: curY }}>
        <motion.path
          d={`M ${-w * 0.8} 0 Q ${-w * 0.4} 5 0 0 Q ${w * 0.4} -5 ${w * 0.8} 0`}
          fill="none"
          stroke={B.black}
          strokeWidth={Math.max(4, w * 0.12)}
          strokeLinecap="round"
          animate={{
            d: [
              `M ${-w * 0.8} 0 Q ${-w * 0.4} 5 0 0 Q ${w * 0.4} -5 ${w * 0.8} 0`,
              `M ${-w * 0.8} 2 Q ${-w * 0.4} -4 0 2 Q ${w * 0.4} 6 ${w * 0.8} 1`,
              `M ${-w * 0.8} 0 Q ${-w * 0.4} 5 0 0 Q ${w * 0.4} -5 ${w * 0.8} 0`,
            ],
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
    );
  }

  // 2. SHOCKED / PEEK MOUTH (Password revealed): surprised open mouth gasp!
  if (emotion === 'shocked') {
    return (
      <motion.g
        style={{ x: curX, y: curY }}
        initial={{ scale: 0.8 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
      >
        <ellipse
          cx={0}
          cy={0}
          rx={w * 0.42}
          ry={h * 0.65}
          fill={B.mouthBg}
          stroke={B.black}
          strokeWidth={3.5}
        />
        {/* Upper cute tooth */}
        <rect x={-w * 0.18} y={-h * 0.6} width={w * 0.36} height={h * 0.32} rx={3} fill={B.pureWhite} />
        {/* Soft pink tongue */}
        <ellipse cx={0} cy={h * 0.38} rx={w * 0.28} ry={h * 0.25} fill={B.tongue} />
      </motion.g>
    );
  }

  // 3. TALKING / CHATTERING MOUTH (Email input focused): lively talking animation!
  if (emotion === 'talking') {
    return (
      <motion.g
        style={{ x: curX, y: curY }}
        animate={{
          scaleY: [0.7, 1.35, 0.8, 1.25, 0.7],
          scaleX: [1.05, 0.95, 1.02, 0.96, 1.05],
        }}
        transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Mouth cavity */}
        <path
          d={`M ${-w * 0.85} 0 Q 0 ${h * 1.3} ${w * 0.85} 0 Z`}
          fill={B.mouthBg}
          stroke={B.black}
          strokeWidth={3.5}
        />
        {/* Two front teeth */}
        <rect x={-w * 0.32} y={0} width={w * 0.28} height={h * 0.38} rx={2} fill={B.pureWhite} />
        <rect x={w * 0.04}  y={0} width={w * 0.28} height={h * 0.38} rx={2} fill={B.pureWhite} />
        {/* Tongue */}
        <ellipse cx={0} cy={h * 0.65} rx={w * 0.4} ry={h * 0.35} fill={B.tongue} />
      </motion.g>
    );
  }

  // 4. ROUND-O MOUTH (for Cushion / whimsical characters):
  if (styleType === 'round-o') {
    return (
      <motion.g
        style={{ x: curX, y: curY }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse
          cx={0}
          cy={0}
          rx={w * 0.42}
          ry={h * 0.52}
          fill={B.mouthBg}
          stroke={B.black}
          strokeWidth={4}
        />
        {/* Cute white tooth detail */}
        <rect x={-w * 0.16} y={-h * 0.48} width={w * 0.32} height={h * 0.28} rx={2.5} fill={B.pureWhite} />
        {/* Inner shadow/tongue */}
        <ellipse cx={0} cy={h * 0.24} rx={w * 0.25} ry={h * 0.2} fill={B.tongue} />
      </motion.g>
    );
  }

  // 5. HAPPY / NEUTRAL OPEN EMBROIDERED SMILE (Kurta, Pillow, Comforter):
  // Dynamically widens and deepens as cursor Y changes!
  return (
    <motion.g style={{ x: curX, y: curY }}>
      {/* Outer mouth cavity */}
      <motion.path
        d={smileD}
        fill={B.mouthBg}
        stroke={B.black}
        strokeWidth={3.5}
      />
      {/* Two front teeth */}
      <rect x={-w * 0.32} y={0} width={w * 0.28} height={h * 0.36} rx={2} fill={B.pureWhite} />
      <rect x={w * 0.04}  y={0} width={w * 0.28} height={h * 0.36} rx={2} fill={B.pureWhite} />
      {/* Tongue */}
      <motion.ellipse
        cx={0}
        cy={tongueCy}
        rx={w * 0.4}
        ry={h * 0.32}
        fill={B.tongue}
      />
    </motion.g>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface InteractiveLoginCharactersProps {
  focusedField: 'none' | 'email' | 'password';
  showPassword?: boolean;
  emailLength?: number;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InteractiveLoginCharacters({
  focusedField,
  showPassword = false,
  emailLength = 0,
}: InteractiveLoginCharactersProps) {
  useEffect(() => { injectCSS(); }, []);

  // ── 1. Cursor Tracking Springs ──────────────────────────────────────────────
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const bodyX    = useSpring(rawX, BODY_SPR);
  const bodyY    = useSpring(rawY, BODY_SPR);
  const eyeSprX  = useSpring(rawX, EYE_SPR);
  const eyeSprY  = useSpring(rawY, EYE_SPR);
  const mouthSprX = useSpring(rawX, MOUTH_SPR);
  const mouthSprY = useSpring(rawY, MOUTH_SPR);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Normalize to 0 (top-left) ... 1 (bottom-right)
      rawX.set(Math.max(0, Math.min(1, e.clientX / window.innerWidth)));
      rawY.set(Math.max(0, Math.min(1, e.clientY / window.innerHeight)));
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [rawX, rawY]);

  // ── 2. Synchronized Blink ───────────────────────────────────────────────────
  const blinkMV = useMotionValue(0);
  useEffect(() => {
    let t: NodeJS.Timeout;
    const triggerBlink = () => {
      blinkMV.set(1);
      setTimeout(() => {
        blinkMV.set(0);
        t = setTimeout(triggerBlink, 3000 + Math.random() * 2500);
      }, 130);
    };
    t = setTimeout(triggerBlink, 2200);
    return () => clearTimeout(t);
  }, [blinkMV]);

  // ── 3. Interaction States ───────────────────────────────────────────────────
  const isIdle      = focusedField === 'none';
  const isEmail     = focusedField === 'email';
  const isPwdHidden = focusedField === 'password' && !showPassword;
  const isPwdShown  = focusedField === 'password' && showPassword;
  const isCursorDriven = isIdle || isEmail;

  // Emotions: all 4 are in HARMONY!
  const currentEmotion: Emotion = isPwdHidden
    ? 'nervous'
    : isPwdShown
    ? 'shocked'
    : isEmail
    ? 'talking'
    : 'happy';

  // ── 4. Unified Body Tilt & Float ────────────────────────────────────────────
  // Smooth subtle tilt following cursor, matching user request
  const sharedBodyRot = useTransform(bodyX, [0, 1], [-8, 8]);
  const sharedBodyY   = useTransform(bodyY, [0, 1], [-8, 5]);

  // ── 5. Harmonized Eye Offsets ───────────────────────────────────────────────
  // Proportional offsets scaled by character eye socket size:
  // Kurta: socketR=22 -> offset [-8, 8]
  const kEyeOffX = useTransform(eyeSprX, [0, 1], [-8, 8]);
  const kEyeOffY = useTransform(eyeSprY, [0, 1], [-7, 7]);

  // Pillow: socketR=42 -> offset [-15, 15]
  const pEyeOffX = useTransform(eyeSprX, [0, 1], [-15, 15]);
  const pEyeOffY = useTransform(eyeSprY, [0, 1], [-13, 13]);

  // Comforter: socketR=44 -> offset [-15, 15]
  const cEyeOffX = useTransform(eyeSprX, [0, 1], [-15, 15]);
  const cEyeOffY = useTransform(eyeSprY, [0, 1], [-13, 13]);

  // Cushion: socketR=46 -> offset [-16, 16]
  const cuEyeOffX = useTransform(eyeSprX, [0, 1], [-16, 16]);
  const cuEyeOffY = useTransform(eyeSprY, [0, 1], [-13, 13]);

  // ── 6. Dynamic Mouth Offsets (Parallax movement with cursor) ────────────────
  const kMouthOffX = useTransform(mouthSprX, [0, 1], [-6, 6]);
  const kMouthOffY = useTransform(mouthSprY, [0, 1], [-5, 5]);

  const pMouthOffX = useTransform(mouthSprX, [0, 1], [-10, 10]);
  const pMouthOffY = useTransform(mouthSprY, [0, 1], [-7, 7]);

  const cMouthOffX = useTransform(mouthSprX, [0, 1], [-12, 12]);
  const cMouthOffY = useTransform(mouthSprY, [0, 1], [-8, 8]);

  const cuMouthOffX = useTransform(mouthSprX, [0, 1], [-10, 10]);
  const cuMouthOffY = useTransform(mouthSprY, [0, 1], [-7, 7]);

  // Smile control point depth (cursor Y determines smile fullness)
  const kSmileCtrl  = useTransform(eyeSprY, [0, 1], [18, 10]);
  const pSmileCtrl  = useTransform(eyeSprY, [0, 1], [32, 18]);
  const cSmileCtrl  = useTransform(eyeSprY, [0, 1], [40, 22]);
  const cuSmileCtrl = useTransform(eyeSprY, [0, 1], [28, 16]);

  // ── 7. Password Animation Overrides (From Reference Video) ───────────────────
  type Anim = { rotate?: number; y?: number; x?: number; scale?: number };
  const getAnimate = (c: 'k' | 'p' | 'co' | 'cu'): Anim | undefined => {
    if (isCursorDriven) return undefined;
    if (isPwdHidden) {
      return {
        k:  { rotate: -18, y: -16, x: -6 },
        p:  { rotate: 0,   y: 185 },                // Black Pillar ducking completely!
        co: { rotate: -4,  y: 12,  scale: 0.94 },    // Orange Dome squishes down
        cu: { rotate: 16,  y: 6,   x: 8 },           // Yellow Capsule looks away to ceiling
      }[c];
    }
    if (isPwdShown) {
      return {
        k:  { rotate: 8,  y: -12, x: 4 },
        p:  { rotate: 0,  y: -14 },                 // Pops back up!
        co: { rotate: 5,  y: -8,  scale: 1.05 },
        cu: { rotate: -6, y: -10 },
      }[c];
    }
    return undefined;
  };
  const getTransition = () => (isPwdHidden ? SPR_REACT : isPwdShown ? SPR_PEEK : SPR_BACK);

  // Pupil static overrides for password states
  const kPupilOv  = isPwdHidden ? { x: -6, y: 5 }   : isPwdShown ? { x: 8,  y: -2 } : {};
  const pPupilOv  = isPwdHidden ? { x: 0,  y: 10 }  : isPwdShown ? { x: 12, y: 0 }  : {};
  const cPupilOv  = isPwdHidden ? { x: -10, y: 8 }  : isPwdShown ? { x: 12, y: -2 } : {};
  const cuPupilOv = isPwdHidden ? { x: 14, y: -14 } : isPwdShown ? { x: 10, y: 0 }  : {};

  const bodyMotionStyle = (origin = '50% 95%') =>
    isCursorDriven
      ? { rotate: sharedBodyRot, y: sharedBodyY, transformOrigin: origin }
      : { transformOrigin: origin };

  // All characters share the SAME float keyframe animation for perfect vertical sync
  const floatStyle: React.CSSProperties = {
    animation: 'joriqueSyncFloat 3.2s ease-in-out infinite',
  };

  return (
    <div className="relative w-full aspect-square max-w-[540px] select-none flex items-end justify-center overflow-visible">

      {/* ═════════════════════════════════════════════════════════════════════
          1. THE ATELIER KURTA (Back-Left Pillar Role)
          ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ ...floatStyle, position: 'absolute', left: '6%', bottom: '26%', width: '42%', zIndex: 5 }}>
        <motion.div
          animate={getAnimate('k')}
          style={bodyMotionStyle('50% 95%')}
          transition={getTransition()}
          className="pointer-events-none select-none w-full"
        >
          <div className="relative w-full h-auto">
            <img
              src="/images/characters/kurta_clean.png?v=5"
              alt="JORIQUE Atelier Kurta"
              className="w-full h-auto block select-none pointer-events-none drop-shadow-xl"
            />
            <svg viewBox="0 0 896 1200" className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <clipPath id="k-left-eye"><circle cx="497.5" cy="413.5" r="22" /></clipPath>
                <clipPath id="k-right-eye"><circle cx="549.5" cy="413.5" r="22" /></clipPath>
              </defs>

              {/* Eyebrows */}
              <Brow x={497.5} y={386} emotion={currentEmotion} side="left"  sw={4} eyeOffY={kEyeOffY} />
              <Brow x={549.5} y={386} emotion={currentEmotion} side="right" sw={4} eyeOffY={kEyeOffY} />

              {/* Synchronized Pupils */}
              <PupilPair
                leftClip="k-left-eye"
                rightClip="k-right-eye"
                lCx={497.5} lCy={413.5}
                rCx={549.5} rCy={413.5}
                socketR={22}
                pupilR={12.5}
                hlR={4.5}
                eyeOffX={kEyeOffX}
                eyeOffY={kEyeOffY}
                blinkMV={blinkMV}
                overrideX={kPupilOv.x}
                overrideY={kPupilOv.y}
              />

              {/* Dynamic Animated Mouth with Parallax Movement */}
              <AnimatedMouth
                cx={522}
                cy={451}
                w={22}
                h={15}
                emotion={currentEmotion}
                mouthOffX={kMouthOffX}
                mouthOffY={kMouthOffY}
                cursorControlY={kSmileCtrl}
                styleType="smile"
              />

              {/* Shy / Nervous Cheek Blush */}
              {currentEmotion === 'nervous' && (
                <>
                  <Blush x={476} y={434} rx={14} ry={8} color={B.blushShy} opacity={0.4} />
                  <Blush x={570} y={434} rx={14} ry={8} color={B.blushShy} opacity={0.4} />
                </>
              )}
            </svg>
          </div>
        </motion.div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          2. THE LINEN PILLOW (Middle Pillar / Ducking Role)
          ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ ...floatStyle, position: 'absolute', left: '36%', bottom: '18%', width: '46%', zIndex: 7 }}>
        <motion.div
          animate={getAnimate('p')}
          style={bodyMotionStyle('50% 95%')}
          transition={getTransition()}
          className="pointer-events-none select-none w-full"
        >
          <div className="relative w-full h-auto">
            <img
              src="/images/characters/pillow_clean.png?v=5"
              alt="JORIQUE Botanical Pillow"
              className="w-full h-auto block select-none pointer-events-none drop-shadow-2xl"
            />
            <svg viewBox="0 0 1200 896" className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <clipPath id="p-left-eye"><circle cx="535.0" cy="429.0" r="42" /></clipPath>
                <clipPath id="p-right-eye"><circle cx="666.0" cy="428.5" r="42" /></clipPath>
              </defs>

              {/* Eyebrows */}
              <Brow x={535.0} y={374} emotion={currentEmotion} side="left"  sw={7} eyeOffY={pEyeOffY} />
              <Brow x={666.0} y={374} emotion={currentEmotion} side="right" sw={7} eyeOffY={pEyeOffY} />

              {/* Synchronized Pupils */}
              <PupilPair
                leftClip="p-left-eye"
                rightClip="p-right-eye"
                lCx={535.0} lCy={429.0}
                rCx={666.0} rCy={428.5}
                socketR={42}
                pupilR={25}
                hlR={8.5}
                eyeOffX={pEyeOffX}
                eyeOffY={pEyeOffY}
                blinkMV={blinkMV}
                overrideX={pPupilOv.x}
                overrideY={pPupilOv.y}
              />

              {/* Dynamic Animated Mouth with Parallax Movement */}
              <AnimatedMouth
                cx={600}
                cy={520}
                w={44}
                h={28}
                emotion={currentEmotion}
                mouthOffX={pMouthOffX}
                mouthOffY={pMouthOffY}
                cursorControlY={pSmileCtrl}
                styleType="smile"
              />

              {/* Soft Atelier Cheeks */}
              <Blush x={495} y={476} rx={26} ry={14} color={B.blushWarm} opacity={0.24} />
              <Blush x={705} y={476} rx={26} ry={14} color={B.blushWarm} opacity={0.24} />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          3. THE CLOUD COMFORTER (Front-Left Dome Role)
          ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ ...floatStyle, position: 'absolute', left: '-4%', bottom: '0%', width: '50%', zIndex: 15 }}>
        <motion.div
          animate={getAnimate('co')}
          style={bodyMotionStyle('50% 100%')}
          transition={getTransition()}
          className="pointer-events-none select-none w-full"
        >
          <div className="relative w-full h-auto">
            <img
              src="/images/characters/comforter_clean.png?v=5"
              alt="JORIQUE Cloud Comforter"
              className="w-full h-auto block select-none pointer-events-none drop-shadow-2xl"
            />
            <svg viewBox="0 0 1200 896" className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <clipPath id="co-left-eye"><circle cx="727.5" cy="407.0" r="44" /></clipPath>
                <clipPath id="co-right-eye"><circle cx="847.0" cy="397.0" r="44" /></clipPath>
              </defs>

              {/* Eyebrows */}
              <Brow x={727.5} y={350} emotion={currentEmotion} side="left"  sw={8} eyeOffY={cEyeOffY} />
              <Brow x={847.0} y={340} emotion={currentEmotion} side="right" sw={8} eyeOffY={cEyeOffY} />

              {/* Synchronized Pupils */}
              <PupilPair
                leftClip="co-left-eye"
                rightClip="co-right-eye"
                lCx={727.5} lCy={407.0}
                rCx={847.0} rCy={397.0}
                socketR={44}
                pupilR={26.5}
                hlR={9.0}
                eyeOffX={cEyeOffX}
                eyeOffY={cEyeOffY}
                blinkMV={blinkMV}
                overrideX={cPupilOv.x}
                overrideY={cPupilOv.y}
              />

              {/* Dynamic Animated Mouth with Parallax Movement */}
              <AnimatedMouth
                cx={784}
                cy={498}
                w={50}
                h={34}
                emotion={currentEmotion}
                mouthOffX={cMouthOffX}
                mouthOffY={cMouthOffY}
                cursorControlY={cSmileCtrl}
                styleType="wide-smile"
              />

              {/* Warm Rosy Cheeks */}
              <Blush x={692} y={466} rx={30} ry={16} color={B.blushWarm} opacity={0.32} />
              <Blush x={882} y={456} rx={30} ry={16} color={B.blushWarm} opacity={0.32} />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          4. THE FLANGE CUSHION (Front-Right Capsule Role)
          ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ ...floatStyle, position: 'absolute', left: '44%', bottom: '0%', width: '38%', zIndex: 18 }}>
        <motion.div
          animate={getAnimate('cu')}
          style={bodyMotionStyle('50% 95%')}
          transition={getTransition()}
          className="pointer-events-none select-none w-full"
        >
          <div className="relative w-full h-auto">
            <img
              src="/images/characters/cushion_clean.png?v=5"
              alt="JORIQUE Flange Cushion"
              className="w-full h-auto block select-none pointer-events-none drop-shadow-2xl"
            />
            <svg viewBox="0 0 1024 1024" className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <clipPath id="cu-left-eye"><circle cx="442.0" cy="448.5" r="46" /></clipPath>
                <clipPath id="cu-right-eye"><circle cx="583.0" cy="448.0" r="46" /></clipPath>
              </defs>

              {/* Eyebrows */}
              <Brow x={442.0} y={390} emotion={currentEmotion} side="left"  sw={7.5} eyeOffY={cuEyeOffY} />
              <Brow x={583.0} y={390} emotion={currentEmotion} side="right" sw={7.5} eyeOffY={cuEyeOffY} />

              {/* Synchronized Pupils */}
              <PupilPair
                leftClip="cu-left-eye"
                rightClip="cu-right-eye"
                lCx={442.0} lCy={448.5}
                rCx={583.0} rCy={448.0}
                socketR={46}
                pupilR={28}
                hlR={9.5}
                eyeOffX={cuEyeOffX}
                eyeOffY={cuEyeOffY}
                blinkMV={blinkMV}
                overrideX={cuPupilOv.x}
                overrideY={cuPupilOv.y}
              />

              {/* Dynamic Animated Mouth with Parallax Movement */}
              <AnimatedMouth
                cx={512}
                cy={555}
                w={36}
                h={36}
                emotion={currentEmotion}
                mouthOffX={cuMouthOffX}
                mouthOffY={cuMouthOffY}
                cursorControlY={cuSmileCtrl}
                styleType="round-o"
              />

              {/* Cute Cheek Highlights */}
              <Blush x={402} y={504} rx={26} ry={14} color={B.blushWarm} opacity={0.22} />
              <Blush x={622} y={504} rx={26} ry={14} color={B.blushWarm} opacity={0.22} />
            </svg>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
