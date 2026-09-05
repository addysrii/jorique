import React, { useEffect, useState, useRef, useMemo } from 'react';

interface InteractiveLoginCharactersProps {
  focusedField: 'none' | 'email' | 'password';
  showPassword?: boolean;
}

interface ProductCharacterConfig {
  id: string;
  name: string;
  category: string;
  leftEye: { cx: number; cy: number; socketR: number; pupilR: number };
  rightEye: { cx: number; cy: number; socketR: number; pupilR: number };
  mouth?: { cx: number; cy: number; r?: number };
  reaction: 'squint' | 'look-away-up' | 'look-away-down' | 'shy' | 'shocked' | 'sleepy';
  badgePos: { x: number; y: number };
}

const CHARACTERS: ProductCharacterConfig[] = [
  {
    id: 'kurta',
    name: 'Atelier Embroidered Kurta',
    category: 'The Heritage Collection',
    leftEye: { cx: 357.7, cy: 326.2, socketR: 16.0, pupilR: 8.0 },
    rightEye: { cx: 396.9, cy: 326.5, socketR: 16.0, pupilR: 8.0 },
    mouth: { cx: 376.6, cy: 357.2 },
    reaction: 'squint',
    badgePos: { x: 380, y: 240 },
  },
  {
    id: 'shirt',
    name: 'Classic Tailored Shirt',
    category: 'The Essential Collection',
    leftEye: { cx: 681.5, cy: 301.0, socketR: 15.5, pupilR: 8.0 },
    rightEye: { cx: 721.8, cy: 301.1, socketR: 15.5, pupilR: 8.0 },
    mouth: { cx: 701.5, cy: 331.0 },
    reaction: 'look-away-up',
    badgePos: { x: 700, y: 220 },
  },
  {
    id: 'big_pillow',
    name: 'Botanical Linen Sham',
    category: 'Signature Bedding',
    leftEye: { cx: 716.5, cy: 541.5, socketR: 22.0, pupilR: 9.6 },
    rightEye: { cx: 774.1, cy: 542.0, socketR: 22.0, pupilR: 9.6 },
    mouth: { cx: 746.0, cy: 580.5 },
    reaction: 'shy',
    badgePos: { x: 750, y: 470 },
  },
  {
    id: 'comforter',
    name: 'Organic Rolled Duvet',
    category: 'The Luxe Collection',
    leftEye: { cx: 297.5, cy: 729.5, socketR: 22.0, pupilR: 10.2 },
    rightEye: { cx: 352.9, cy: 724.4, socketR: 22.0, pupilR: 10.2 },
    mouth: { cx: 327.5, cy: 767.5 },
    reaction: 'look-away-down',
    badgePos: { x: 320, y: 640 },
  },
  {
    id: 'cushion',
    name: 'Embroidered Flange Cushion',
    category: 'Artisanal Living',
    leftEye: { cx: 518.5, cy: 805.3, socketR: 19.5, pupilR: 9.8 },
    rightEye: { cx: 567.8, cy: 806.2, socketR: 19.5, pupilR: 9.8 },
    mouth: { cx: 542.0, cy: 845.0, r: 9.1 },
    reaction: 'shocked',
    badgePos: { x: 540, y: 730 },
  },
  {
    id: 'towel_top',
    name: 'Rolled Organic Terry Towel',
    category: 'Spa & Bath',
    leftEye: { cx: 790.1, cy: 735.7, socketR: 18.0, pupilR: 9.1 },
    rightEye: { cx: 836.8, cy: 739.0, socketR: 18.0, pupilR: 9.1 },
    mouth: { cx: 809.0, cy: 767.5 },
    reaction: 'sleepy',
    badgePos: { x: 810, y: 670 },
  },
  {
    id: 'towel_bottom',
    name: 'Plush Bath Towel',
    category: 'Spa & Bath',
    leftEye: { cx: 781.4, cy: 858.9, socketR: 18.0, pupilR: 9.4 },
    rightEye: { cx: 827.6, cy: 864.3, socketR: 18.0, pupilR: 9.4 },
    mouth: { cx: 801.3, cy: 893.7 },
    reaction: 'squint',
    badgePos: { x: 805, y: 950 },
  },
];

export default function InteractiveLoginCharacters({
  focusedField,
  showPassword = false,
}: InteractiveLoginCharactersProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse coords in 1024x1024 SVG coordinate space
  const [svgMouse, setSvgMouse] = useState<{ x: number; y: number }>({ x: 512, y: 512 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  // Track global mouse position and convert to SVG space
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Normalize into 1024x1024 coordinates
      const mappedX = ((e.clientX - rect.left) / rect.width) * 1024;
      const mappedY = ((e.clientY - rect.top) / rect.height) * 1024;

      setSvgMouse({ x: mappedX, y: mappedY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Natural spontaneous blinking (every 3.8s to 5.2s)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const nextDelay = 3500 + Math.random() * 2000;
        timeoutId = setTimeout(triggerBlink, nextDelay);
      }, 150);
    };

    timeoutId = setTimeout(triggerBlink, 3800);
    return () => clearTimeout(timeoutId);
  }, []);

  // Determine target eye focus per character
  const eyeStates = useMemo(() => {
    return CHARACTERS.map((char) => {
      const maxTravelLeft = Math.max(2, char.leftEye.socketR - char.leftEye.pupilR - 2.5);
      const maxTravelRight = Math.max(2, char.rightEye.socketR - char.rightEye.pupilR - 2.5);

      let leftOffset = { x: 0, y: 0 };
      let rightOffset = { x: 0, y: 0 };
      let blinkRatio = isBlinking ? 1 : 0;
      let pupilScale = 1;
      let showSquintArc = false;
      let isShocked = false;

      if (focusedField === 'email') {
        // All eyes look directly towards the right side input box
        leftOffset = { x: maxTravelLeft * 0.95, y: -maxTravelLeft * 0.15 };
        rightOffset = { x: maxTravelRight * 0.95, y: -maxTravelRight * 0.15 };
        pupilScale = 1.05;
      } else if (focusedField === 'password') {
        if (showPassword) {
          // Password revealed: Eyes pop wide open and look right with curiosity!
          leftOffset = { x: maxTravelLeft * 0.9, y: 0 };
          rightOffset = { x: maxTravelRight * 0.9, y: 0 };
          pupilScale = 1.22;
          blinkRatio = 0; // Wide open!
        } else {
          // Password hidden: Characters act shy, embarrassed, or pretend not to look!
          switch (char.reaction) {
            case 'squint':
              blinkRatio = 0.9;
              showSquintArc = true;
              leftOffset = { x: 0, y: maxTravelLeft * 0.4 };
              rightOffset = { x: 0, y: maxTravelRight * 0.4 };
              break;
            case 'sleepy':
              blinkRatio = 1.0;
              showSquintArc = true;
              break;
            case 'look-away-up':
              // Whistling, looking away at the ceiling
              leftOffset = { x: maxTravelLeft * 0.85, y: -maxTravelLeft * 0.85 };
              rightOffset = { x: maxTravelRight * 0.85, y: -maxTravelRight * 0.85 };
              break;
            case 'look-away-down':
              // Burying face in comforter
              leftOffset = { x: -maxTravelLeft * 0.7, y: maxTravelLeft * 0.85 };
              rightOffset = { x: -maxTravelRight * 0.7, y: maxTravelRight * 0.85 };
              break;
            case 'shy':
              // Looking sideways nervously
              leftOffset = { x: -maxTravelLeft * 0.8, y: maxTravelLeft * 0.5 };
              rightOffset = { x: -maxTravelRight * 0.8, y: maxTravelRight * 0.5 };
              break;
            case 'shocked':
              // Small cushion wide-eyed gasp
              isShocked = true;
              pupilScale = 0.8; // Constricted pupil
              leftOffset = { x: 0, y: 0 };
              rightOffset = { x: 0, y: 0 };
              blinkRatio = 0;
              break;
          }
        }
      } else {
        // Free mouse tracking with vector distance & angle
        const calculatePupilOffset = (cx: number, cy: number, maxDist: number) => {
          const dx = svgMouse.x - cx;
          const dy = svgMouse.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist === 0) return { x: 0, y: 0 };

          // Clamp movement smoothly within socket bounds
          const moveRatio = Math.min(1, dist / 220);
          const travel = maxDist * moveRatio;
          const angle = Math.atan2(dy, dx);
          return {
            x: Math.cos(angle) * travel,
            y: Math.sin(angle) * travel,
          };
        };

        leftOffset = calculatePupilOffset(char.leftEye.cx, char.leftEye.cy, maxTravelLeft);
        rightOffset = calculatePupilOffset(char.rightEye.cx, char.rightEye.cy, maxTravelRight);
      }

      return {
        ...char,
        leftOffset,
        rightOffset,
        blinkRatio,
        pupilScale,
        showSquintArc,
        isShocked,
      };
    });
  }, [svgMouse, focusedField, showPassword, isBlinking]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[580px] lg:min-h-[720px] select-none flex items-center justify-center overflow-hidden rounded-3xl bg-[#EBE4D8] shadow-2xl border border-[#D9CEBF]/60 group"
    >
      {/* Luxury Background Photo (JORIQUE Bedding & Apparel with eye sockets) */}
      <img
        src="/images/jorique-login-characters-base.jpg"
        alt="JORIQUE Luxury Textile Characters"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.01]"
      />

      {/* Subtle Warm Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-black/5 to-black/20" />

      {/* Interactive SVG Overlay (1024x1024) */}
      <svg
        viewBox="0 0 1024 1024"
        className="absolute inset-0 w-full h-full pointer-events-auto"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Eye Socket Clip Paths */}
          {CHARACTERS.map((char) => (
            <React.Fragment key={`defs-${char.id}`}>
              <clipPath id={`clip-${char.id}-left`}>
                <circle cx={char.leftEye.cx} cy={char.leftEye.cy} r={char.leftEye.socketR - 0.5} />
              </clipPath>
              <clipPath id={`clip-${char.id}-right`}>
                <circle cx={char.rightEye.cx} cy={char.rightEye.cy} r={char.rightEye.socketR - 0.5} />
              </clipPath>
            </React.Fragment>
          ))}

          {/* Radial specular gloss gradient */}
          <radialGradient id="pupil-gloss" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#303030" />
            <stop offset="100%" stopColor="#0B0B0C" />
          </radialGradient>
        </defs>

        {/* Render each Character's Eyes & Reactions */}
        {eyeStates.map((char) => {
          const leftPupilR = char.leftEye.pupilR * char.pupilScale;
          const rightPupilR = char.rightEye.pupilR * char.pupilScale;

          const leftPupilX = char.leftEye.cx + char.leftOffset.x;
          const leftPupilY = char.leftEye.cy + char.leftOffset.y;

          const rightPupilX = char.rightEye.cx + char.rightOffset.x;
          const rightPupilY = char.rightEye.cy + char.rightOffset.y;

          return (
            <g
              key={char.id}
              className="cursor-pointer transition-opacity duration-300"
              onMouseEnter={() => setActiveHoverId(char.id)}
              onMouseLeave={() => setActiveHoverId(null)}
            >
              {/* Invisible Hitbox for Product Hover Details */}
              <circle
                cx={(char.leftEye.cx + char.rightEye.cx) / 2}
                cy={(char.leftEye.cy + char.rightEye.cy) / 2}
                r={char.leftEye.socketR * 3}
                fill="transparent"
              />

              {/* ================= LEFT EYE ================= */}
              <g clipPath={`url(#clip-${char.id}-left)`}>
                {/* Pupil */}
                <circle
                  cx={leftPupilX}
                  cy={leftPupilY}
                  r={leftPupilR}
                  fill="url(#pupil-gloss)"
                  className="transition-all duration-150 ease-out"
                />
                {/* Primary Specular Highlight */}
                <circle
                  cx={leftPupilX - leftPupilR * 0.32}
                  cy={leftPupilY - leftPupilR * 0.32}
                  r={leftPupilR * 0.35}
                  fill="#FFFFFF"
                  opacity="0.94"
                  className="transition-all duration-150 ease-out"
                />
                {/* Secondary Ambient Highlight */}
                <circle
                  cx={leftPupilX + leftPupilR * 0.28}
                  cy={leftPupilY + leftPupilR * 0.28}
                  r={leftPupilR * 0.18}
                  fill="#FFFFFF"
                  opacity="0.4"
                  className="transition-all duration-150 ease-out"
                />

                {/* Eyelid (Blink & Squint) */}
                {char.blinkRatio > 0 && (
                  <rect
                    x={char.leftEye.cx - char.leftEye.socketR}
                    y={char.leftEye.cy - char.leftEye.socketR}
                    width={char.leftEye.socketR * 2}
                    height={char.leftEye.socketR * 2 * char.blinkRatio}
                    fill="#EFE7DC"
                    className="transition-all duration-150 ease-out"
                  />
                )}
              </g>

              {/* Squint / Sleepy Eyelash Arc for Left Eye */}
              {char.showSquintArc && (
                <path
                  d={`M ${char.leftEye.cx - char.leftEye.socketR * 0.65} ${char.leftEye.cy + 1} Q ${char.leftEye.cx} ${char.leftEye.cy - char.leftEye.socketR * 0.25} ${char.leftEye.cx + char.leftEye.socketR * 0.65} ${char.leftEye.cy + 1}`}
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              )}

              {/* ================= RIGHT EYE ================= */}
              <g clipPath={`url(#clip-${char.id}-right)`}>
                {/* Pupil */}
                <circle
                  cx={rightPupilX}
                  cy={rightPupilY}
                  r={rightPupilR}
                  fill="url(#pupil-gloss)"
                  className="transition-all duration-150 ease-out"
                />
                {/* Primary Specular Highlight */}
                <circle
                  cx={rightPupilX - rightPupilR * 0.32}
                  cy={rightPupilY - rightPupilR * 0.32}
                  r={rightPupilR * 0.35}
                  fill="#FFFFFF"
                  opacity="0.94"
                  className="transition-all duration-150 ease-out"
                />
                {/* Secondary Ambient Highlight */}
                <circle
                  cx={rightPupilX + rightPupilR * 0.28}
                  cy={rightPupilY + rightPupilR * 0.28}
                  r={rightPupilR * 0.18}
                  fill="#FFFFFF"
                  opacity="0.4"
                  className="transition-all duration-150 ease-out"
                />

                {/* Eyelid (Blink & Squint) */}
                {char.blinkRatio > 0 && (
                  <rect
                    x={char.rightEye.cx - char.rightEye.socketR}
                    y={char.rightEye.cy - char.rightEye.socketR}
                    width={char.rightEye.socketR * 2}
                    height={char.rightEye.socketR * 2 * char.blinkRatio}
                    fill="#EFE7DC"
                    className="transition-all duration-150 ease-out"
                  />
                )}
              </g>

              {/* Squint / Sleepy Eyelash Arc for Right Eye */}
              {char.showSquintArc && (
                <path
                  d={`M ${char.rightEye.cx - char.rightEye.socketR * 0.65} ${char.rightEye.cy + 1} Q ${char.rightEye.cx} ${char.rightEye.cy - char.rightEye.socketR * 0.25} ${char.rightEye.cx + char.rightEye.socketR * 0.65} ${char.rightEye.cy + 1}`}
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              )}

              {/* ================= SURPRISE SWEAT DROP (Small Cushion) ================= */}
              {char.isShocked && (
                <g className="animate-bounce">
                  <path
                    d={`M ${char.rightEye.cx + 26} ${char.rightEye.cy - 12} C ${char.rightEye.cx + 22} ${char.rightEye.cy - 6}, ${char.rightEye.cx + 20} ${char.rightEye.cy}, ${char.rightEye.cx + 26} ${char.rightEye.cy + 4} C ${char.rightEye.cx + 32} ${char.rightEye.cy}, ${char.rightEye.cx + 30} ${char.rightEye.cy - 6}, ${char.rightEye.cx + 26} ${char.rightEye.cy - 12} Z`}
                    fill="#38BDF8"
                    opacity="0.95"
                  />
                </g>
              )}

              {/* ================= PASSWORD PEEK SPARKLES ================= */}
              {focusedField === 'password' && showPassword && (
                <g className="animate-pulse">
                  <path
                    d={`M ${char.rightEye.cx + char.rightEye.socketR + 10} ${char.rightEye.cy - 8} l 2 4 l 4 2 l -4 2 l -2 4 l -2 -4 l -4 -2 l 4 -2 Z`}
                    fill="#D4AF37"
                  />
                </g>
              )}

              {/* ================= HOVER PRODUCT TOOLTIP ================= */}
              {activeHoverId === char.id && (
                <g className="pointer-events-none transition-all duration-200">
                  <rect
                    x={char.badgePos.x - 110}
                    y={char.badgePos.y - 28}
                    width={220}
                    height={38}
                    rx={19}
                    fill="#1A1A1A"
                    opacity="0.92"
                    stroke="#D4AF37"
                    strokeWidth="1"
                  />
                  <text
                    x={char.badgePos.x}
                    y={char.badgePos.y - 12}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="Inter, sans-serif"
                    letterSpacing="0.05em"
                  >
                    {char.name.toUpperCase()}
                  </text>
                  <text
                    x={char.badgePos.x}
                    y={char.badgePos.y + 2}
                    textAnchor="middle"
                    fill="#D4AF37"
                    fontSize="9"
                    fontWeight="500"
                    fontFamily="Cinzel, serif"
                  >
                    {char.category}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Luxury Corner Brand Seal */}
      <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-serif text-[11px] tracking-[0.2em] uppercase font-light">
          JORIQUE LIVING · ATELIER
        </span>
      </div>

      {/* Bottom Subtitle / Reaction Hint */}
      <div className="absolute bottom-6 inset-x-6 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 text-[#2B2319] shadow-sm pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-sm">👁️</span>
          <p className="text-xs font-medium tracking-wide">
            {focusedField === 'password'
              ? showPassword
                ? 'Curiosity peaked! The atelier is watching.'
                : 'Shh! Our textiles are turning away for your privacy.'
              : focusedField === 'email'
              ? 'Atelier characters are attentively following your input.'
              : 'Our handcrafted textiles follow your every move.'}
          </p>
        </div>
        <span className="hidden sm:inline-block text-[10px] text-[#8C7A6B] uppercase tracking-widest font-mono">
          Interactive
        </span>
      </div>
    </div>
  );
}
