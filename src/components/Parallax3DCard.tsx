import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Parallax3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // max tilt degrees (e.g. 15)
  perspective?: number; // perspective in px (e.g. 1200)
  glareEffect?: boolean;
  scaleOnHover?: number;
}

export default function Parallax3DCard({
  children,
  className = '',
  maxRotation = 14,
  perspective = 1200,
  glareEffect = true,
  scaleOnHover = 1.02,
}: Parallax3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coordinates from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics configuration for luxurious, buttery smooth motion
  const springConfig = { stiffness: 220, damping: 24, mass: 0.6 };

  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Derive 3D rotation angles
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxRotation, -maxRotation]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxRotation, maxRotation]);
  const scale = useSpring(isHovered ? scaleOnHover : 1, springConfig);

  // Dynamic glare coordinates - Top Level Hooks
  const glareX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);
  const glareOpacity = useSpring(isHovered ? 0.35 : 0, { stiffness: 300, damping: 30 });

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle 350px at ${x} ${y}, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 80%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to center of element
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const normalizedX = clientX / width - 0.5;
    const normalizedY = clientY / height - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Touch handling for mobile interaction
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const clientX = touch.clientX - rect.left;
    const clientY = touch.clientY - rect.top;

    const normalizedX = Math.max(-0.5, Math.min(0.5, clientX / rect.width - 0.5));
    const normalizedY = Math.max(-0.5, Math.min(0.5, clientY / rect.height - 0.5));

    setIsHovered(true);
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className={`relative select-none ${className}`}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative cursor-grab active:cursor-grabbing will-change-transform rounded-2xl"
      >
        {children}

        {/* Dynamic 3D Glare Light Effect */}
        {glareEffect && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden z-40"
            style={{
              opacity: glareOpacity,
              transform: 'translateZ(1px)',
            }}
          >
            <motion.div
              className="w-full h-full"
              style={{
                background: glareBackground,
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
