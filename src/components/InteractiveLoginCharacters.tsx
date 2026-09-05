import React, { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from 'framer-motion';

// ─── Brand Palette ────────────────────────────────────────────────────────────
const B = {
  ivory:      '#F5EDE3',
  black:      '#1A1A1A',
  charcoal:   '#2B2825',
  gold:       '#C6A96B',
  goldBright: '#DFBF79',
  teal:       '#0B5F61',
  stone:      '#8A847D',
  blushWarm:  '#D4956A',
  blushShy:   '#E89686',
  blushDeep:  '#F08080',
  white:      '#FCFAF7',
  pureWhite:  '#FFFFFF',
  mouthBg:    '#1A1412',
  tongue:     '#E57373',
  tongueDark: '#C62828',
};

// ─── Synchronized Idle Float & Shake CSS ──────────────────────────────────────
const FLOAT_CSS = `
@keyframes joriqueSyncFloat {
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-10px); }
}
@keyframes joriqueAngryShake {
  0%, 100% { transform: translateX(0px); }
  20%, 60% { transform: translateX(-3px) rotate(-1deg); }
  40%, 80% { transform: translateX(3px) rotate(1deg); }
}
`;
let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = FLOAT_CSS;
  document.head.appendChild(s);
  cssInjected = true;
}

// ─── Responsive Spring Physics ────────────────────────────────────────────────
const BODY_SPR  = { stiffness: 95, damping: 15, mass: 1.0 };
const EYE_SPR   = { stiffness: 320, damping: 20 };
const FACE_SPR  = { stiffness: 220, damping: 18 };
const SPR_REACT = { type: 'spring', stiffness: 280, damping: 16, mass: 1.1 } as const;
const SPR_PEEK  = { type: 'spring', stiffness: 380, damping: 20 }           as const;
const SPR_BACK  = { type: 'spring', stiffness: 140, damping: 18 }           as const;

export type Emotion =
  | 'neutral'
  | 'happy'
  | 'talking'
  | 'nervous'
  | 'shocked'
  | 'shy'
  | 'tease'
  | 'angry';

// ─── Distinct Eyebrows for Each Character Personality ─────────────────────────
function Brow({
  x, y, emotion, side, sw = 5, eyeOffY, browVariant = 'standard', yOffset = 0
}: {
  x: number; y: number; emotion: Emotion; side: 'left' | 'right'; sw?: number;
  eyeOffY: MotionValue<number>; browVariant?: 'refined' | 'expressive' | 'sleepy' | 'curious';
  yOffset?: number;
}) {
  const L = side === 'left';
  const browShiftY = useTransform(eyeOffY, yVal => y + yOffset + yVal * 0.45);

  let d: string;
  let color = B.black;

  if (browVariant === 'refined') {
    // Kurta: Fine, elegant, high-fashion arched needlework lines
    color = B.charcoal;
    switch (emotion) {
      case 'angry':
        // Stern furrowed V needlework slant
        d = L ? 'M -11 -6 L 11 4' : 'M -11 4 L 11 -6';
        break;
      case 'shy':
        // Bashful raised inner ends
        d = L ? 'M -11 3 Q 0 -3 11 -6' : 'M -11 -6 Q 0 -3 11 3';
        break;
      case 'tease':
        // Cheeky raised arch
        d = L ? 'M -11 -4 Q 0 -8 11 -2' : 'M -11 1 Q 0 -3 11 1';
        break;
      case 'nervous':
        d = L ? 'M -11 3 Q 0 -3 11 -5' : 'M -11 -5 Q 0 -3 11 3';
        break;
      case 'shocked':
        d = 'M -12 0 Q 0 -10 12 0';
        break;
      case 'talking':
      case 'happy':
        d = L ? 'M -11 -1 Q 0 -6 11 -3' : 'M -11 -3 Q 0 -6 11 -1';
        break;
      default:
        d = 'M -11 0 Q 0 -5 11 0';
    }
  } else if (browVariant === 'curious') {
    // Cushion: Inquisitive brows
    color = B.charcoal;
    switch (emotion) {
      case 'angry':
        // Little angry V scowl
        d = L ? 'M -15 -8 L 15 5' : 'M -15 5 L 15 -8';
        break;
      case 'shy':
        d = L ? 'M -15 5 Q 0 -3 15 -7' : 'M -15 -7 Q 0 -3 15 5';
        break;
      case 'tease':
        d = L ? 'M -15 -6 Q 0 -12 15 -3' : 'M -15 2 Q 0 -2 15 2';
        break;
      case 'nervous':
        d = L ? 'M -15 6 Q 0 -4 15 -8' : 'M -15 -8 Q 0 -4 15 6';
        break;
      case 'shocked':
        d = 'M -16 2 Q 0 -14 16 2';
        break;
      default:
        d = L ? 'M -15 -5 Q 0 -14 15 -2' : 'M -15 -1 Q 0 -5 15 2';
    }
  } else if (browVariant === 'sleepy') {
    // Comforter: Warm sleepy duvet brows
    color = '#382A20';
    switch (emotion) {
      case 'angry':
        // Furious grumpy V slant!
        d = L ? 'M -17 -8 L 17 6' : 'M -17 6 L 17 -8';
        break;
      case 'shy':
        d = L ? 'M -16 5 Q 0 -3 16 -6' : 'M -16 -6 Q 0 -3 16 5';
        break;
      case 'tease':
        d = L ? 'M -16 -4 Q 0 -9 16 -2' : 'M -16 -2 Q 0 -9 16 -4';
        break;
      case 'nervous':
        d = L ? 'M -16 4 Q 0 -4 16 -6' : 'M -16 -6 Q 0 -4 16 4';
        break;
      case 'shocked':
        d = 'M -17 2 Q 0 -13 17 2';
        break;
      default:
        // Relaxed downward curve
        d = L ? 'M -16 -4 Q 0 0 16 4' : 'M -16 4 Q 0 0 16 -4';
    }
  } else {
    // Pillow: Bold, energetic cartoon googly eyebrows
    switch (emotion) {
      case 'angry':
        // Bold furious cartoon V angles!
        d = L ? 'M -17 -10 L 17 7' : 'M -17 7 L 17 -10';
        break;
      case 'shy':
        d = L ? 'M -15 7 Q 0 -4 15 -9' : 'M -15 -9 Q 0 -4 15 7';
        break;
      case 'tease':
        // Highly animated playful wink brows
        d = L ? 'M -16 -7 Q 0 -16 16 -5' : 'M -15 2 Q 0 -4 15 2';
        break;
      case 'nervous':
        d = L ? 'M -15 6 Q 0 -5 15 -8' : 'M -15 -8 Q 0 -5 15 6';
        break;
      case 'shocked':
        d = 'M -18 3 Q 0 -16 18 3';
        break;
      case 'talking':
      case 'happy':
        d = L ? 'M -15 -4 Q 0 -12 15 -6' : 'M -15 -6 Q 0 -12 15 -4';
        break;
      default:
        d = 'M -16 0 Q 0 -9 16 0';
    }
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
  x, y, rx = 20, ry = 11, color = B.blushWarm, opacity = 0.32, hasStitch = false, isShy = false
}: {
  x: number; y: number; rx?: number; ry?: number; color?: string; opacity?: number; hasStitch?: boolean; isShy?: boolean;
}) {
  return (
    <motion.g
      animate={isShy ? { scale: [1, 1.25, 1], opacity: [opacity, opacity * 1.35, opacity] } : {}}
      transition={isShy ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : {}}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={color} opacity={opacity} />
      {hasStitch && (
        <path
          d={`M ${x - 4} ${y} L ${x + 4} ${y} M ${x} ${y - 4} L ${x} ${y + 4}`}
          stroke={B.gold}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.7}
        />
      )}
    </motion.g>
  );
}

// ─── Star Sparkle Path (for Kawaii Cushion Eyes) ──────────────────────────────
function StarSparkle({ cx, cy, size = 8 }: { cx: number; cy: number; size?: number }) {
  const s = size;
  return (
    <path
      d={`M ${cx} ${cy - s} Q ${cx} ${cy} ${cx + s} ${cy} Q ${cx} ${cy} ${cx} ${cy + s} Q ${cx} ${cy} ${cx - s} ${cy} Q ${cx} ${cy} ${cx} ${cy - s} Z`}
      fill={B.pureWhite}
      opacity={0.96}
    />
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface InteractiveLoginCharactersProps {
  focusedField: 'none' | 'email' | 'password';
  showPassword?: boolean;
  emailLength?: number;
  passwordLength?: number;
  hasError?: boolean;
  emptyAttempt?: boolean;
  hoverTarget?: 'none' | 'forgot' | 'submit';
  isLoading?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InteractiveLoginCharacters({
  focusedField,
  showPassword = false,
  emailLength = 0,
  passwordLength = 0,
  hasError = false,
  emptyAttempt = false,
  hoverTarget = 'none',
  isLoading = false,
}: InteractiveLoginCharactersProps) {
  useEffect(() => { injectCSS(); }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  // ── 1. High-Sensitivity Gaze Vector Springs ──────────────────────────────────
  const rawX = useMotionValue(0.25);
  const rawY = useMotionValue(0);

  const bodyX    = useSpring(rawX, BODY_SPR);
  const bodyY    = useSpring(rawY, BODY_SPR);
  const eyeSprX  = useSpring(rawX, EYE_SPR);
  const eyeSprY  = useSpring(rawY, EYE_SPR);
  const faceSprX = useSpring(rawX, FACE_SPR);
  const faceSprY = useSpring(rawY, FACE_SPR);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const stageCenterX = rect.left + rect.width * 0.46;
        const stageCenterY = rect.top + rect.height * 0.44;

        const dx = e.clientX - stageCenterX;
        const dy = e.clientY - stageCenterY;

        const normX = Math.max(-1, Math.min(1, dx / 180));
        const normY = Math.max(-1, Math.min(1, dy / 135));

        rawX.set(normX);
        rawY.set(normY);
      } else {
        const normX = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth - 0.3) * 3));
        const normY = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight - 0.5) * 2.5));
        rawX.set(normX);
        rawY.set(normY);
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [rawX, rawY]);

  // ── 2. Natural Synchronized Blink ───────────────────────────────────────────
  const blinkMV = useMotionValue(0);
  useEffect(() => {
    let t: NodeJS.Timeout;
    const triggerBlink = () => {
      blinkMV.set(1);
      setTimeout(() => {
        blinkMV.set(0);
        t = setTimeout(triggerBlink, 3200 + Math.random() * 2600);
      }, 120);
    };
    t = setTimeout(triggerBlink, 2400);
    return () => clearTimeout(t);
  }, [blinkMV]);

  // ── 3. Active Emotion Determination (Purely Driven by User Actions!) ─────────
  const isIdle      = focusedField === 'none';
  const isEmail     = focusedField === 'email';
  const isPwdHidden = focusedField === 'password' && !showPassword;
  const isPwdShown  = focusedField === 'password' && showPassword;
  const isCursorDriven = isIdle || isEmail;

  let currentEmotion: Emotion = 'happy';

  if (hasError) {
    // 1. WRONG PASSWORD / FAILED LOGIN -> THEY TEASE THE USER! 😜
    // Pillow winks tight and sticks big pink tongue out (:P) with teasing bounce!
    currentEmotion = 'tease';
  } else if (emptyAttempt) {
    // 2. USER TRIED TO SUBMIT WITH EMPTY FIELDS -> ANGER / GRUMPY SCOWL! 😡
    // "Hey! You didn't even enter anything!" -> Furrowed steep V brows and scowls!
    currentEmotion = 'angry';
  } else if (focusedField === 'password') {
    if (showPassword) {
      // 3. PASSWORD REVEALED (Eye icon clicked) -> SHOCKED PEEK!
      // "Wait, you're revealing your password?!" -> Wide eyes, peeking!
      currentEmotion = 'shocked';
    } else {
      // 4. TYPING PRIVATE PASSWORD -> SHYNESS & DISCRETION! 😳
      // Looking away coyly, deep coral-pink blush, Pillow ducks down shyly!
      currentEmotion = 'shy';
    }
  } else if (hoverTarget === 'forgot') {
    // 5. HOVERING "Forgot password?" -> Playful teasing ("Did you really forget? 😜")
    currentEmotion = 'tease';
  } else if (focusedField === 'email') {
    // 6. TYPING EMAIL -> TALKING / CHATTERING
    currentEmotion = 'talking';
  } else if (hoverTarget === 'submit' || isLoading) {
    // 7. HOVERING SUBMIT OR LOGGING IN -> Eager anticipation / cheerful
    currentEmotion = 'happy';
  }

  // ── 4. Unified Body Lean & Motion ───────────────────────────────────────────
  const sharedBodyRot = useTransform(bodyX, [-1, 1], [-8.5, 8.5]);
  const sharedBodyX   = useTransform(bodyX, [-1, 1], [-12, 12]);
  const sharedBodyY   = useTransform(bodyY, [-1, 1], [-7, 5]);

  // ── 5. 3D Face Parallax Shifts ──────────────────────────────────────────────
  const kFaceOffX  = useTransform(faceSprX, [-1, 1], [-14, 14]);
  const kFaceOffY  = useTransform(faceSprY, [-1, 1], [-9, 9]);

  const pFaceOffX  = useTransform(faceSprX, [-1, 1], [-18, 18]);
  const pFaceOffY  = useTransform(faceSprY, [-1, 1], [-11, 11]);

  const cFaceOffX  = useTransform(faceSprX, [-1, 1], [-18, 18]);
  const cFaceOffY  = useTransform(faceSprY, [-1, 1], [-11, 11]);

  const cuFaceOffX = useTransform(faceSprX, [-1, 1], [-18, 18]);
  const cuFaceOffY = useTransform(faceSprY, [-1, 1], [-11, 11]);

  // ── 6. Expanded Dynamic Pupil Travel Limits ─────────────────────────────────
  const kEyeOffX  = useTransform(eyeSprX, [-1, 1], [-15, 15]);
  const kEyeOffY  = useTransform(eyeSprY, [-1, 1], [-12, 12]);

  const pEyeOffX  = useTransform(eyeSprX, [-1, 1], [-26, 26]);
  const pEyeOffY  = useTransform(eyeSprY, [-1, 1], [-19, 19]);

  const cEyeOffX  = useTransform(eyeSprX, [-1, 1], [-25, 25]);
  const cEyeOffY  = useTransform(eyeSprY, [-1, 1], [-18, 18]);

  const cuEyeOffX = useTransform(eyeSprX, [-1, 1], [-28, 28]);
  const cuEyeOffY = useTransform(eyeSprY, [-1, 1], [-20, 20]);

  // ── 7. Password & Emotion Animation Overrides ────────────────────────────────
  type Anim = { rotate?: any; y?: any; x?: any; scale?: any };
  const getAnimate = (c: 'k' | 'p' | 'co' | 'cu'): Anim | undefined => {
    // 1. TEASE: Wrong password entered! Characters bounce and giggle teasingly!
    if (hasError || (hoverTarget === 'forgot' && isIdle)) {
      return {
        k:  { rotate: [-2, 3, -2], y: [-4, 0, -4] },
        p:  { rotate: [-4, 6, -4], y: [-14, -6, -14], scale: [1.02, 1.06, 1.02] }, // Pillow bounces with cheeky tease!
        co: { rotate: [-2, 2, -2], y: [-3, 0, -3] },
        cu: { rotate: [4, -4, 4],  y: [-8, -4, -8] },
      }[c];
    }
    // 2. ANGRY: Empty submit attempt! Characters scowl with annoyance!
    if (emptyAttempt) {
      return {
        k:  { rotate: -3, y: -2 },
        p:  { rotate: 0,  y: -2 },
        co: { rotate: -2, y: 5, scale: 0.94 },
        cu: { rotate: 2,  y: -2 },
      }[c];
    }
    // 3. SHY: Secret password typing! Characters look away coyly / duck down!
    if (isPwdHidden) {
      return {
        k:  { rotate: -16, x: -10, y: 6 }, // Kurta bashfully turns and tilts away
        p:  { rotate: 0,   y: 195 },       // Pillow ducks down completely!
        co: { rotate: -4,  y: 12, scale: 0.94 },
        cu: { rotate: 16,  x: 8,  y: 6 },  // Cushion looks away
      }[c];
    }
    // 4. SHOCKED: Password revealed!
    if (isPwdShown) {
      return {
        k:  { rotate: 8,  y: -12, x: 4 },
        p:  { rotate: 0,  y: -14 },        // Pillow pops back up shocked!
        co: { rotate: 5,  y: -8, scale: 1.05 },
        cu: { rotate: -6, y: -10 },
      }[c];
    }
    return undefined;
  };
  const getTransition = () => (isPwdHidden ? SPR_REACT : isPwdShown ? SPR_PEEK : SPR_BACK);

  // Pupil static overrides for special states
  const kPupilOv =
    hasError                    ? { x: -6, y: 2 }
    : emptyAttempt              ? { x: 0,  y: 3 }
    : currentEmotion === 'shy'  ? { x: -9, y: 8 }
    : isPwdShown                ? { x: 13, y: -2 }
    : undefined;

  const pPupilOv =
    hasError                    ? { x: -6, y: 4 }
    : emptyAttempt              ? { x: 0,  y: 4 }
    : currentEmotion === 'shy'  ? { x: 0,  y: 16 }
    : isPwdShown                ? { x: 18, y: 0 }
    : undefined;

  const cPupilOv =
    hasError                    ? { x: -6, y: 2 }
    : emptyAttempt              ? { x: 0,  y: 2 }
    : currentEmotion === 'shy'  ? { x: -14, y: 11 }
    : isPwdShown                ? { x: 18, y: -2 }
    : undefined;

  const cuPupilOv =
    hasError                    ? { x: 12, y: -8 }
    : emptyAttempt              ? { x: 0,  y: 4 }
    : currentEmotion === 'shy'  ? { x: 20, y: -18 }
    : isPwdShown                ? { x: 16, y: 0 }
    : undefined;

  const bodyMotionStyle = (origin = '50% 95%') =>
    isCursorDriven && !hasError && !emptyAttempt
      ? { rotate: sharedBodyRot, x: sharedBodyX, y: sharedBodyY, transformOrigin: origin }
      : { transformOrigin: origin };

  const floatStyle: React.CSSProperties = {
    animation: emptyAttempt
      ? 'joriqueAngryShake 0.4s ease-in-out infinite'
      : hasError
      ? 'none'
      : 'joriqueSyncFloat 3.2s ease-in-out infinite',
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED PUPIL COORDINATES
  // ═══════════════════════════════════════════════════════════════════════════

  // 1. KURTA: cx = 497.5, 549.5, cy = 413.5
  const kLx = useTransform(kEyeOffX, x => 497.5 + (kPupilOv ? kPupilOv.x : x));
  const kLy = useTransform(kEyeOffY, y => 413.5 + (kPupilOv ? kPupilOv.y : y));
  const kRx = useTransform(kEyeOffX, x => 549.5 + (kPupilOv ? kPupilOv.x : x));
  const kRy = useTransform(kEyeOffY, y => 413.5 + (kPupilOv ? kPupilOv.y : y));
  const kLhx = useTransform(kLx, x => x - 3.5);
  const kLhy = useTransform(kLy, y => y - 3.5);
  const kRhx = useTransform(kRx, x => x - 3.5);
  const kRhy = useTransform(kRy, y => y - 3.5);

  // 2. PILLOW: cx = 535.0, 666.0, cy = 429.0, 428.5
  const pLx = useTransform(pEyeOffX, x => 535.0 + (pPupilOv ? pPupilOv.x : x));
  const pLy = useTransform(pEyeOffY, y => 429.0 + (pPupilOv ? pPupilOv.y : y));
  const pRx = useTransform(pEyeOffX, x => 666.0 + (pPupilOv ? pPupilOv.x : x));
  const pRy = useTransform(pEyeOffY, y => 428.5 + (pPupilOv ? pPupilOv.y : y));
  const pLhx1 = useTransform(pLx, x => x - 6.0);
  const pLhy1 = useTransform(pLy, y => y - 6.0);
  const pRhx1 = useTransform(pRx, x => x - 6.0);
  const pRhy1 = useTransform(pRy, y => y - 6.0);
  const pLhx2 = useTransform(pLx, x => x + 5.5);
  const pLhy2 = useTransform(pLy, y => y + 5.0);
  const pRhx2 = useTransform(pRx, x => x + 5.5);
  const pRhy2 = useTransform(pRy, y => y + 5.0);

  // 3. COMFORTER: cx = 727.5, 847.0, cy = 407.0, 397.0
  const cLx = useTransform(cEyeOffX, x => 727.5 + (cPupilOv ? cPupilOv.x : x));
  const cLy = useTransform(cEyeOffY, y => 407.0 + (cPupilOv ? cPupilOv.y : y));
  const cRx = useTransform(cEyeOffX, x => 847.0 + (cPupilOv ? cPupilOv.x : x));
  const cRy = useTransform(cEyeOffY, y => 397.0 + (cPupilOv ? cPupilOv.y : y));
  const cLhx = useTransform(cLx, x => x - 6.0);
  const cLhy = useTransform(cLy, y => y - 6.0);
  const cRhx = useTransform(cRx, x => x - 6.0);
  const cRhy = useTransform(cRy, y => y - 6.0);

  // 4. CUSHION: cx = 442.0, 583.0, cy = 448.5, 448.0
  const cuLx = useTransform(cuEyeOffX, x => 442.0 + (cuPupilOv ? cuPupilOv.x : x));
  const cuLy = useTransform(cuEyeOffY, y => 448.5 + (cuPupilOv ? cuPupilOv.y : y));
  const cuRx = useTransform(cuEyeOffX, x => 583.0 + (cuPupilOv ? cuPupilOv.x : x));
  const cuRy = useTransform(cuEyeOffY, y => 448.0 + (cuPupilOv ? cuPupilOv.y : y));

  return (
    <div className="flex flex-col items-center select-none w-full">

      {/* Main Character Stage */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square max-w-[540px] select-none flex items-end justify-center overflow-visible"
      >

        {/* ═══════════════════════════════════════════════════════════════════
            1. THE ATELIER KURTA (Back-Left)
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          style={{ ...floatStyle, position: 'absolute', left: '6%', bottom: '26%', width: '42%', zIndex: 5 }}
        >
          <motion.div
            animate={getAnimate('k')}
            style={bodyMotionStyle('50% 95%')}
            transition={getTransition()}
            className="w-full pointer-events-none select-none"
          >
            <div className="relative w-full h-auto">
              <img
                src="/images/characters/kurta_clean.png?v=6"
                alt="JORIQUE Atelier Kurta"
                className="w-full h-auto block select-none pointer-events-none drop-shadow-xl"
              />
              <svg viewBox="0 0 896 1200" className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <clipPath id="k-left-eye"><circle cx="497.5" cy="413.5" r="23" /></clipPath>
                  <clipPath id="k-right-eye"><circle cx="549.5" cy="413.5" r="23" /></clipPath>
                </defs>

                {/* 3D Face Parallax Group */}
                <motion.g style={{ x: kFaceOffX, y: kFaceOffY }}>
                  {/* Eyebrows */}
                  <Brow x={497.5} y={384} emotion={currentEmotion} side="left"  sw={3.0} eyeOffY={kEyeOffY} browVariant="refined" />
                  <Brow x={549.5} y={384} emotion={currentEmotion} side="right" sw={3.0} eyeOffY={kEyeOffY} browVariant="refined" />

                  {/* Spectacles: Round Gold Wireframe Frames */}
                  <circle cx={497.5} cy={413.5} r={24} fill="rgba(245, 237, 227, 0.35)" stroke={B.gold} strokeWidth={2.8} />
                  <circle cx={549.5} cy={413.5} r={24} fill="rgba(245, 237, 227, 0.35)" stroke={B.gold} strokeWidth={2.8} />
                  <path d="M 521.5 412 Q 523.5 407 525.5 412" fill="none" stroke={B.gold} strokeWidth={2.6} strokeLinecap="round" />
                  <line x1={473.5} y1={413.5} x2={462} y2={410} stroke={B.gold} strokeWidth={2.2} strokeLinecap="round" />
                  <line x1={573.5} y1={413.5} x2={585} y2={410} stroke={B.gold} strokeWidth={2.2} strokeLinecap="round" />

                  {/* Left Eye */}
                  <g clipPath="url(#k-left-eye)">
                    <motion.circle cx={kLx} cy={kLy} r={11.0} fill={B.charcoal} />
                    <motion.circle cx={kLhx} cy={kLhy} r={3.6} fill={B.pureWhite} opacity={0.95} />
                    <motion.rect
                      x={472} y={388} width={52} height={52} fill={B.ivory}
                      style={{ scaleY: blinkMV, transformOrigin: '497.5px 390px' }}
                    />
                  </g>

                  {/* Right Eye (Winks during tease!) */}
                  {currentEmotion === 'tease' ? (
                    <path d="M 541 413 Q 549.5 405 558 413" fill="none" stroke={B.charcoal} strokeWidth={3.0} strokeLinecap="round" />
                  ) : (
                    <g clipPath="url(#k-right-eye)">
                      <motion.circle cx={kRx} cy={kRy} r={11.0} fill={B.charcoal} />
                      <motion.circle cx={kRhx} cy={kRhy} r={3.6} fill={B.pureWhite} opacity={0.95} />
                      <motion.rect
                        x={524} y={388} width={52} height={52} fill={B.ivory}
                        style={{ scaleY: blinkMV, transformOrigin: '549.5px 390px' }}
                      />
                    </g>
                  )}

                  {/* Kurta Mouth Expressions */}
                  {currentEmotion === 'tease' ? (
                    // Playful tongue peeking out at corner of smirk
                    <g>
                      <path d="M 511 449 Q 523 458 535 450" fill="none" stroke={B.charcoal} strokeWidth={2.8} strokeLinecap="round" />
                      <path d="M 526 453 Q 529 462 533 461 Q 536 459 534 451 Z" fill={B.tongue} stroke={B.charcoal} strokeWidth={1.4} />
                    </g>
                  ) : currentEmotion === 'angry' ? (
                    // Strict stern tailor grimace
                    <g>
                      <path d="M 512 455 L 534 452" fill="none" stroke={B.charcoal} strokeWidth={3.0} strokeLinecap="round" />
                      <line x1={512} y1={453} x2={512} y2={457} stroke={B.charcoal} strokeWidth={2.2} strokeLinecap="round" />
                      <line x1={534} y1={450} x2={534} y2={454} stroke={B.charcoal} strokeWidth={2.2} strokeLinecap="round" />
                    </g>
                  ) : currentEmotion === 'shy' ? (
                    // Bashful little wavy needlework smile
                    <path d="M 514 452 Q 519 455 523 451 Q 528 448 532 452" fill="none" stroke={B.charcoal} strokeWidth={2.6} strokeLinecap="round" />
                  ) : currentEmotion === 'talking' ? (
                    <ellipse cx={523} cy={452} rx={10} ry={6} fill={B.mouthBg} stroke={B.charcoal} strokeWidth={2.5} />
                  ) : currentEmotion === 'shocked' ? (
                    <ellipse cx={523} cy={452} rx={9} ry={11} fill={B.mouthBg} stroke={B.charcoal} strokeWidth={2.5} />
                  ) : currentEmotion === 'nervous' ? (
                    <path d="M 513 453 Q 518 456 523 452 Q 528 448 533 452" fill="none" stroke={B.charcoal} strokeWidth={2.6} strokeLinecap="round" />
                  ) : (
                    <g>
                      <path d="M 511 449 Q 523 458 535 450" fill="none" stroke={B.charcoal} strokeWidth={2.8} strokeLinecap="round" />
                      <circle cx={509} cy={448} r={1.6} fill={B.charcoal} />
                      <circle cx={537} cy={449} r={1.6} fill={B.charcoal} />
                    </g>
                  )}

                  {/* Blush: Glowing deep pink when shy */}
                  {(currentEmotion === 'shy' || currentEmotion === 'nervous') && (
                    <>
                      <Blush x={474} y={432} rx={18} ry={10} color={B.blushShy} opacity={currentEmotion === 'shy' ? 0.72 : 0.4} isShy={currentEmotion === 'shy'} />
                      <Blush x={572} y={432} rx={18} ry={10} color={B.blushShy} opacity={currentEmotion === 'shy' ? 0.72 : 0.4} isShy={currentEmotion === 'shy'} />
                    </>
                  )}
                </motion.g>
              </svg>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            2. THE LINEN PILLOW (Center)
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          style={{ ...floatStyle, position: 'absolute', left: '36%', bottom: '18%', width: '46%', zIndex: 7 }}
        >
          <motion.div
            animate={getAnimate('p')}
            style={bodyMotionStyle('50% 95%')}
            transition={getTransition()}
            className="w-full pointer-events-none select-none"
          >
            <div className="relative w-full h-auto">
              <img
                src="/images/characters/pillow_clean.png?v=6"
                alt="JORIQUE Botanical Pillow"
                className="w-full h-auto block select-none pointer-events-none drop-shadow-2xl"
              />
              <svg viewBox="0 0 1200 896" className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <clipPath id="p-left-eye"><circle cx="535.0" cy="429.0" r="44" /></clipPath>
                  <clipPath id="p-right-eye"><circle cx="666.0" cy="428.5" r="44" /></clipPath>
                </defs>

                {/* 3D Face Parallax Group */}
                <motion.g style={{ x: pFaceOffX, y: pFaceOffY }}>
                  {/* Eyebrows */}
                  <Brow x={535.0} y={370} emotion={currentEmotion} side="left"  sw={6.5} eyeOffY={pEyeOffY} browVariant="expressive" />
                  <Brow x={666.0} y={370} emotion={currentEmotion} side="right" sw={6.5} eyeOffY={pEyeOffY} browVariant="expressive" />

                  {/* Sockets */}
                  <circle cx={535.0} cy={429.0} r={44} fill="none" stroke={B.black} strokeWidth={4.2} />
                  <circle cx={666.0} cy={428.5} r={44} fill="none" stroke={B.black} strokeWidth={4.2} />

                  {/* Left Eye */}
                  <g clipPath="url(#p-left-eye)">
                    <motion.circle cx={pLx} cy={pLy} r={19.0} fill={B.black} />
                    <motion.circle cx={pLhx1} cy={pLhy1} r={7.0} fill={B.pureWhite} opacity={0.96} />
                    <motion.circle cx={pLhx2} cy={pLhy2} r={3.5} fill={B.pureWhite} opacity={0.65} />
                    <motion.rect
                      x={485} y={380} width={100} height={100} fill={B.ivory}
                      style={{ scaleY: blinkMV, transformOrigin: '535px 385px' }}
                    />
                  </g>

                  {/* Right Eye: WINKS tight during 'tease'! (>) */}
                  {currentEmotion === 'tease' ? (
                    <g>
                      {/* Cheeky anime wink: > shape */}
                      <path d="M 648 418 L 674 429 L 648 440" fill="none" stroke={B.black} strokeWidth={6.0} strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  ) : (
                    <g clipPath="url(#p-right-eye)">
                      <motion.circle cx={pRx} cy={pRy} r={19.0} fill={B.black} />
                      <motion.circle cx={pRhx1} cy={pRhy1} r={7.0} fill={B.pureWhite} opacity={0.96} />
                      <motion.circle cx={pRhx2} cy={pRhy2} r={3.5} fill={B.pureWhite} opacity={0.65} />
                      <motion.rect
                        x={616} y={380} width={100} height={100} fill={B.ivory}
                        style={{ scaleY: blinkMV, transformOrigin: '666px 385px' }}
                      />
                    </g>
                  )}

                  {/* ── Pillow Mouth Expressions ── */}
                  {currentEmotion === 'tease' ? (
                    // PULLING TONGUE OUT TO TEASE! (:P) - Triggered when wrong password entered!
                    <motion.g
                      initial={{ scale: 0.95 }}
                      animate={{ scale: [1, 1.1, 1], y: [0, 3, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {/* Open mouth cavity */}
                      <path d="M 576 514 Q 600 542 624 514 Z" fill={B.mouthBg} stroke={B.black} strokeWidth={3.6} />
                      {/* Tooth */}
                      <rect x={594} y={514} width={12} height={8} rx={2.5} fill={B.pureWhite} />
                      {/* Big cheeky tongue sticking out over the bottom lip! */}
                      <path
                        d="M 586 524 Q 584 554 600 556 Q 616 554 614 524 Z"
                        fill={B.tongue}
                        stroke={B.charcoal}
                        strokeWidth={2.4}
                      />
                      {/* Tongue center crease line */}
                      <line x1={600} y1={528} x2={600} y2={550} stroke={B.tongueDark} strokeWidth={1.8} strokeLinecap="round" />
                    </motion.g>
                  ) : currentEmotion === 'angry' ? (
                    // Grumpy cartoon downturned scowl
                    <g>
                      <path d="M 576 534 Q 600 514 624 534" fill="none" stroke={B.black} strokeWidth={4.5} strokeLinecap="round" />
                      <line x1={576} y1={534} x2={573} y2={538} stroke={B.black} strokeWidth={3.5} strokeLinecap="round" />
                      <line x1={624} y1={534} x2={627} y2={538} stroke={B.black} strokeWidth={3.5} strokeLinecap="round" />
                    </g>
                  ) : currentEmotion === 'shy' ? (
                    // Bashful little smile
                    <path d="M 584 524 Q 600 534 616 524" fill="none" stroke={B.black} strokeWidth={3.8} strokeLinecap="round" />
                  ) : currentEmotion === 'talking' ? (
                    <motion.g
                      animate={{ scaleY: [0.75, 1.3, 0.75] }}
                      transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <path d="M 578 518 Q 600 546 622 518 Z" fill={B.mouthBg} stroke={B.black} strokeWidth={3.5} />
                      <rect x={594} y={518} width={12} height={8} rx={2.5} fill={B.pureWhite} />
                      <ellipse cx={600} cy={536} rx={14} ry={8} fill={B.tongue} />
                    </motion.g>
                  ) : currentEmotion === 'shocked' ? (
                    <g>
                      <ellipse cx={600} cy={522} rx={18} ry={24} fill={B.mouthBg} stroke={B.black} strokeWidth={3.5} />
                      <rect x={592} y={500} width={16} height={10} rx={3} fill={B.pureWhite} />
                      <ellipse cx={600} cy={536} rx={12} ry={9} fill={B.tongue} />
                    </g>
                  ) : currentEmotion === 'nervous' ? (
                    <path d="M 580 522 Q 590 526 600 520 Q 610 514 620 522" fill="none" stroke={B.black} strokeWidth={3.8} strokeLinecap="round" />
                  ) : (
                    <g>
                      <path d="M 578 514 Q 600 546 622 514 Z" fill={B.mouthBg} stroke={B.black} strokeWidth={3.6} />
                      <rect x={594} y={514} width={12} height={9} rx={2.5} fill={B.pureWhite} />
                      <ellipse cx={600} cy={534} rx={14} ry={8} fill={B.tongue} />
                    </g>
                  )}

                  {/* Cheeks with Gold Stitched Crosses */}
                  <Blush
                    x={490} y={474} rx={26} ry={14}
                    color={currentEmotion === 'shy' ? B.blushDeep : B.blushWarm}
                    opacity={currentEmotion === 'shy' ? 0.55 : 0.32}
                    hasStitch
                    isShy={currentEmotion === 'shy'}
                  />
                  <Blush
                    x={710} y={474} rx={26} ry={14}
                    color={currentEmotion === 'shy' ? B.blushDeep : B.blushWarm}
                    opacity={currentEmotion === 'shy' ? 0.55 : 0.32}
                    hasStitch
                    isShy={currentEmotion === 'shy'}
                  />
                </motion.g>
              </svg>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            3. THE CLOUD COMFORTER (Front-Left)
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          style={{ ...floatStyle, position: 'absolute', left: '-4%', bottom: '0%', width: '50%', zIndex: 15 }}
        >
          <motion.div
            animate={getAnimate('co')}
            style={bodyMotionStyle('50% 100%')}
            transition={getTransition()}
            className="w-full pointer-events-none select-none"
          >
            <div className="relative w-full h-auto">
              <img
                src="/images/characters/comforter_clean.png?v=6"
                alt="JORIQUE Cloud Comforter"
                className="w-full h-auto block select-none pointer-events-none drop-shadow-2xl"
              />
              <svg viewBox="0 0 1200 896" className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <clipPath id="co-left-eye"><circle cx="727.5" cy="407.0" r="44" /></clipPath>
                  <clipPath id="co-right-eye"><circle cx="847.0" cy="397.0" r="44" /></clipPath>
                </defs>

                {/* 3D Face Parallax Group */}
                <motion.g style={{ x: cFaceOffX, y: cFaceOffY }}>
                  {/* Eyebrows */}
                  <Brow x={727.5} y={350} emotion={currentEmotion} side="left"  sw={6.5} eyeOffY={cEyeOffY} browVariant="sleepy" />
                  <Brow x={847.0} y={340} emotion={currentEmotion} side="right" sw={6.5} eyeOffY={cEyeOffY} browVariant="sleepy" />

                  {/* Sockets contour */}
                  <circle cx={727.5} cy={407.0} r={44} fill="none" stroke="rgba(90, 60, 40, 0.45)" strokeWidth={3.4} />
                  <circle cx={847.0} cy={397.0} r={44} fill="none" stroke="rgba(90, 60, 40, 0.45)" strokeWidth={3.4} />

                  {/* Left Pupil */}
                  <g clipPath="url(#co-left-eye)">
                    <motion.circle cx={cLx} cy={cLy} r={20.5} fill="#1E140E" />
                    <motion.circle cx={cLhx} cy={cLhy} r={6.5} fill={B.pureWhite} opacity={0.92} />
                    <circle cx={727.5} cy={407.0} r={12} fill="#C6A96B" opacity={0.15} />
                    <motion.rect
                      x={678} y={358} width={100} height={100} fill="#EADBCE"
                      style={{ scaleY: blinkMV, transformOrigin: '727.5px 363px' }}
                    />
                  </g>

                  {/* Right Pupil */}
                  <g clipPath="url(#co-right-eye)">
                    <motion.circle cx={cRx} cy={cRy} r={20.5} fill="#1E140E" />
                    <motion.circle cx={cRhx} cy={cRhy} r={6.5} fill={B.pureWhite} opacity={0.92} />
                    <circle cx={847.0} cy={397.0} r={12} fill="#C6A96B" opacity={0.15} />
                    <motion.rect
                      x={798} y={348} width={100} height={100} fill="#EADBCE"
                      style={{ scaleY: blinkMV, transformOrigin: '847.0px 353px' }}
                    />
                  </g>

                  {/* Cozy Sleepy / Angry Eyelids */}
                  {currentEmotion === 'angry' ? (
                    // Sharp angry angled eyelids glaring down!
                    <>
                      <path d="M 684 394 L 771 420 A 44 44 0 0 0 684 394 Z" fill="#EDE2D5" stroke="rgba(85, 55, 35, 0.5)" strokeWidth={2.8} />
                      <path d="M 803 384 L 891 410 A 44 44 0 0 0 803 384 Z" fill="#EDE2D5" stroke="rgba(85, 55, 35, 0.5)" strokeWidth={2.8} />
                    </>
                  ) : (
                    // Drooping cozy sleepy eyelids
                    <>
                      <path d="M 684 404 Q 727.5 423 771 404 A 44 44 0 0 0 684 404 Z" fill="#EDE2D5" stroke="rgba(85, 55, 35, 0.45)" strokeWidth={2.6} />
                      <path d="M 692 396 Q 727.5 408 763 396" fill="none" stroke="rgba(120, 85, 60, 0.28)" strokeWidth={2} strokeLinecap="round" />
                      <path d="M 803 394 Q 847.0 413 891 394 A 44 44 0 0 0 803 394 Z" fill="#EDE2D5" stroke="rgba(85, 55, 35, 0.45)" strokeWidth={2.6} />
                      <path d="M 811 386 Q 847.0 398 883 386" fill="none" stroke="rgba(120, 85, 60, 0.28)" strokeWidth={2} strokeLinecap="round" />
                    </>
                  )}

                  {/* Comforter Mouth Expressions */}
                  {currentEmotion === 'tease' ? (
                    // Sweet sleepy tongue poke
                    <g>
                      <path d="M 764 482 Q 784 496 804 482" fill="none" stroke="#2E1C12" strokeWidth={3.5} strokeLinecap="round" />
                      <path d="M 778 488 Q 776 504 784 506 Q 792 504 790 488 Z" fill={B.tongue} stroke="#2E1C12" strokeWidth={1.8} />
                    </g>
                  ) : currentEmotion === 'angry' ? (
                    // GRUMPY WOKEN-UP COMFORTER SCOWL!
                    <g>
                      <path d="M 760 498 Q 784 478 808 498" fill="none" stroke="#2E1C12" strokeWidth={4.4} strokeLinecap="round" />
                      <line x1={760} y1={498} x2={756} y2={503} stroke="#2E1C12" strokeWidth={3.2} strokeLinecap="round" />
                      <line x1={808} y1={498} x2={812} y2={503} stroke="#2E1C12" strokeWidth={3.2} strokeLinecap="round" />
                    </g>
                  ) : currentEmotion === 'talking' ? (
                    <ellipse cx={784} cy={486} rx={16} ry={11} fill={B.mouthBg} stroke="#2E1C12" strokeWidth={3.4} />
                  ) : currentEmotion === 'shocked' ? (
                    <ellipse cx={784} cy={486} rx={17} ry={22} fill={B.mouthBg} stroke="#2E1C12" strokeWidth={3.4} />
                  ) : currentEmotion === 'nervous' ? (
                    <path d="M 764 488 Q 774 492 784 486 Q 794 480 804 488" fill="none" stroke="#2E1C12" strokeWidth={3.5} strokeLinecap="round" />
                  ) : (
                    <g>
                      <path d="M 762 482 Q 784 502 806 482" fill="none" stroke="#2E1C12" strokeWidth={3.8} strokeLinecap="round" />
                      <line x1={762} y1={482} x2={759} y2={479} stroke="#2E1C12" strokeWidth={3.2} strokeLinecap="round" />
                      <line x1={806} y1={482} x2={809} y2={479} stroke="#2E1C12" strokeWidth={3.2} strokeLinecap="round" />
                    </g>
                  )}

                  {/* Plush Blush Patches */}
                  <Blush
                    x={685} y={460} rx={34} ry={20}
                    color={currentEmotion === 'shy' ? B.blushDeep : B.blushWarm}
                    opacity={currentEmotion === 'shy' ? 0.6 : 0.38}
                    isShy={currentEmotion === 'shy'}
                  />
                  <Blush
                    x={888} y={450} rx={34} ry={20}
                    color={currentEmotion === 'shy' ? B.blushDeep : B.blushWarm}
                    opacity={currentEmotion === 'shy' ? 0.6 : 0.38}
                    isShy={currentEmotion === 'shy'}
                  />
                </motion.g>
              </svg>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            4. THE FLANGE CUSHION (Front-Right)
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          style={{ ...floatStyle, position: 'absolute', left: '44%', bottom: '0%', width: '38%', zIndex: 18 }}
        >
          <motion.div
            animate={getAnimate('cu')}
            style={bodyMotionStyle('50% 95%')}
            transition={getTransition()}
            className="w-full pointer-events-none select-none"
          >
            <div className="relative w-full h-auto">
              <img
                src="/images/characters/cushion_clean.png?v=6"
                alt="JORIQUE Flange Cushion"
                className="w-full h-auto block select-none pointer-events-none drop-shadow-2xl"
              />
              <svg viewBox="0 0 1024 1024" className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <clipPath id="cu-left-eye"><circle cx="442.0" cy="448.5" r="46" /></clipPath>
                  <clipPath id="cu-right-eye"><circle cx="583.0" cy="448.0" r="46" /></clipPath>
                </defs>

                {/* 3D Face Parallax Group */}
                <motion.g style={{ x: cuFaceOffX, y: cuFaceOffY }}>
                  {/* Eyebrows */}
                  <Brow x={442.0} y={382} emotion={currentEmotion} side="left"  sw={7.0} eyeOffY={cuEyeOffY} browVariant="curious" yOffset={-14} />
                  <Brow x={583.0} y={394} emotion={currentEmotion} side="right" sw={7.0} eyeOffY={cuEyeOffY} browVariant="curious" yOffset={2} />

                  {/* Sockets Outline */}
                  <circle cx={442.0} cy={448.5} r={46} fill="none" stroke={B.charcoal} strokeWidth={3.2} />
                  <circle cx={583.0} cy={448.0} r={46} fill="none" stroke={B.charcoal} strokeWidth={3.2} />

                  {/* Left Eye: Star Sparkle */}
                  <g clipPath="url(#cu-left-eye)">
                    <motion.circle cx={cuLx} cy={cuLy} r={21.5} fill={B.black} />
                    <motion.g style={{ x: cuLx, y: cuLy }}>
                      <StarSparkle cx={-6} cy={-6} size={8.5} />
                      <circle cx={6} cy={6} r={3.2} fill={B.pureWhite} opacity={0.8} />
                    </motion.g>
                    <motion.rect
                      x={392} y={398} width={100} height={100} fill={B.ivory}
                      style={{ scaleY: blinkMV, transformOrigin: '442px 403px' }}
                    />
                  </g>

                  {/* Right Eye: Star Sparkle (or Wink during 'tease'!) */}
                  {currentEmotion === 'tease' ? (
                    <path d="M 567 438 L 593 449 L 567 460" fill="none" stroke={B.charcoal} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <g clipPath="url(#cu-right-eye)">
                      <motion.circle cx={cuRx} cy={cuRy} r={21.5} fill={B.black} />
                      <motion.g style={{ x: cuRx, y: cuRy }}>
                        <StarSparkle cx={-6} cy={-6} size={8.5} />
                        <circle cx={6} cy={6} r={3.2} fill={B.pureWhite} opacity={0.8} />
                      </motion.g>
                      <motion.rect
                        x={533} y={398} width={100} height={100} fill={B.ivory}
                        style={{ scaleY: blinkMV, transformOrigin: '583px 403px' }}
                      />
                    </g>
                  )}

                  {/* Cushion Mouth Expressions */}
                  {currentEmotion === 'tease' ? (
                    // Cute cheeky tongue poke (:P)
                    <g>
                      <ellipse cx={512} cy={548} rx={14} ry={14} fill={B.mouthBg} stroke={B.charcoal} strokeWidth={3.5} />
                      <rect x={507} y={535} width={10} height={6} rx={2} fill={B.pureWhite} />
                      <path d="M 504 554 Q 502 570 512 572 Q 522 570 520 554 Z" fill={B.tongue} stroke={B.charcoal} strokeWidth={2.0} />
                    </g>
                  ) : currentEmotion === 'angry' ? (
                    // Pouty little angry clamp mouth (>:[)
                    <g>
                      <path d="M 498 558 Q 512 546 526 558" fill="none" stroke={B.charcoal} strokeWidth={4.0} strokeLinecap="round" />
                      <line x1={498} y1={558} x2={495} y2={562} stroke={B.charcoal} strokeWidth={3.0} strokeLinecap="round" />
                      <line x1={526} y1={558} x2={529} y2={562} stroke={B.charcoal} strokeWidth={3.0} strokeLinecap="round" />
                    </g>
                  ) : currentEmotion === 'shy' ? (
                    // Bashful little "o" mouth
                    <ellipse cx={512} cy={552} rx={10} ry={12} fill={B.mouthBg} stroke={B.charcoal} strokeWidth={3.0} />
                  ) : currentEmotion === 'talking' ? (
                    <motion.g
                      animate={{ scale: [0.9, 1.25, 0.9] }}
                      transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ellipse cx={512} cy={552} rx={16} ry={20} fill={B.mouthBg} stroke={B.charcoal} strokeWidth={3.5} />
                      <rect x={506} y={532} width={12} height={8} rx={2} fill={B.pureWhite} />
                      <ellipse cx={512} cy={563} rx={10} ry={7} fill={B.tongue} />
                    </motion.g>
                  ) : currentEmotion === 'shocked' ? (
                    <g>
                      <ellipse cx={512} cy={552} rx={18} ry={26} fill={B.mouthBg} stroke={B.charcoal} strokeWidth={3.5} />
                      <rect x={504} y={526} width={16} height={10} rx={3} fill={B.pureWhite} />
                      <ellipse cx={512} cy={566} rx={12} ry={9} fill={B.tongue} />
                    </g>
                  ) : currentEmotion === 'nervous' ? (
                    <path d="M 498 554 Q 505 558 512 552 Q 519 546 526 554" fill="none" stroke={B.charcoal} strokeWidth={3.5} strokeLinecap="round" />
                  ) : (
                    <g>
                      <ellipse cx={512} cy={552} rx={15} ry={19} fill={B.mouthBg} stroke={B.charcoal} strokeWidth={3.5} />
                      <rect x={507} y={533} width={10} height={7} rx={2} fill={B.pureWhite} />
                      <ellipse cx={512} cy={562} rx={9} ry={6} fill={B.tongue} />
                    </g>
                  )}

                  {/* Cheeks with Golden Freckles */}
                  <Blush
                    x={402} y={504} rx={24} ry={13}
                    color={currentEmotion === 'shy' ? B.blushDeep : B.blushWarm}
                    opacity={currentEmotion === 'shy' ? 0.5 : 0.24}
                    isShy={currentEmotion === 'shy'}
                  />
                  <Blush
                    x={622} y={504} rx={24} ry={13}
                    color={currentEmotion === 'shy' ? B.blushDeep : B.blushWarm}
                    opacity={currentEmotion === 'shy' ? 0.5 : 0.24}
                    isShy={currentEmotion === 'shy'}
                  />
                  <circle cx={400} cy={498} r={2.2} fill={B.gold} opacity={0.75} />
                  <circle cx={408} cy={506} r={1.8} fill={B.gold} opacity={0.75} />
                  <circle cx={616} cy={506} r={1.8} fill={B.gold} opacity={0.75} />
                  <circle cx={624} cy={498} r={2.2} fill={B.gold} opacity={0.75} />
                </motion.g>
              </svg>
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  );
}
