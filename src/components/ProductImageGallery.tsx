import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ZoomIn,
  SunMedium,
} from 'lucide-react';
import { getBadgeColors } from '../lib/constants/collections';
import { generateLightingComparisonCard, isLightingComparisonImage } from '../lib/generateLightingComparison';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  badge?: string;
  discountPercentage?: number;
}

export default function ProductImageGallery({
  images,
  productName,
  badge,
  discountPercentage = 0,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  const [displayImages, setDisplayImages] = useState<string[]>(() => {
    return images && images.length > 0 ? images : ['/Products/1.jpg'];
  });

  useEffect(() => {
    let active = true;
    const baseImages = images && images.length > 0 ? images : ['/Products/1.jpg'];
    const hasLighting = baseImages.some((img) => isLightingComparisonImage(img));

    if (hasLighting) {
      setDisplayImages(baseImages);
      return;
    }

    setDisplayImages(baseImages);

    if (baseImages.length > 0) {
      generateLightingComparisonCard(baseImages[0])
        .then(({ dataUrl }) => {
          if (active) {
            setDisplayImages((prev) => {
              if (prev.some((img) => isLightingComparisonImage(img))) return prev;
              return [...prev, dataUrl];
            });
          }
        })
        .catch((err) => {
          console.warn('Silent fallback for dynamic lighting synthesis:', err);
        });
    }

    return () => {
      active = false;
    };
  }, [images]);

  const currentImage = displayImages[activeIndex] || displayImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between px-1 text-xs text-secondary dark:text-white/60">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <ZoomIn size={13} className="text-primary dark:text-[#D4AF37]" />
          Hover to magnify fabric weave & detail
        </span>
      </div>

      {/* Main Image Showcase with Smooth Magnifier Zoom */}
      <div className="flex flex-col-reverse lg:flex-row gap-3.5 items-start">
        
        {/* Vertical Thumbnails (Desktop) */}
        {displayImages.length > 1 && (
          <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[560px] pb-2 lg:pb-0 scrollbar-none shrink-0 w-full lg:w-20">
            {displayImages.map((img, idx) => {
              const isLighting = isLightingComparisonImage(img);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0 shadow-xs cursor-pointer ${
                    activeIndex === idx
                      ? 'border-primary dark:border-[#D4AF37] ring-2 ring-primary/20 dark:ring-[#D4AF37]/20 scale-102'
                      : isLighting
                      ? 'border-amber-500/60 opacity-85 hover:opacity-100'
                      : 'border-border dark:border-[#2E2925] opacity-70 hover:opacity-100 hover:border-primary/40'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {isLighting && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/85 backdrop-blur-xs py-0.5 text-center text-[8.5px] font-bold text-amber-300 flex items-center justify-center gap-0.5 tracking-wider uppercase z-10">
                      <SunMedium size={8} />
                      <span>Lighting</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Hero Viewport */}
        <div
          ref={imageContainerRef}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-[4/5] sm:aspect-[1/1] rounded-3xl overflow-hidden bg-cream/30 dark:bg-[#1A1816] border border-border dark:border-[#2E2925] shadow-xl cursor-crosshair group select-none"
        >
          {/* Main Photo with dynamic zoom on hover */}
          <div className="w-full h-full overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={currentImage}
                alt={`${productName} - view ${activeIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover transition-transform duration-150 ease-out"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                }}
              />
            </AnimatePresence>
          </div>

          {/* Calibrated Lighting Banner when active */}
          {isLightingComparisonImage(currentImage) && (
            <div className="absolute top-4 left-4 backdrop-blur-md bg-black/80 text-amber-300 border border-amber-400/40 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1.5">
              <SunMedium size={12} className="text-amber-400" />
              <span>True Color & Lighting Guide</span>
            </div>
          )}

          {/* Collection Badge */}
          {badge && (() => {
            const bCol = getBadgeColors(badge);
            return (
              <div
                className="absolute top-4 left-4 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-md z-20 pointer-events-none border"
                style={{
                  backgroundColor: bCol.bg,
                  color: bCol.text,
                  borderColor: bCol.border || 'rgba(255,255,255,0.25)',
                }}
              >
                {badge}
              </div>
            );
          })()}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-4 right-4 bg-[#0B5F61] text-white text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-md z-20 pointer-events-none">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Expand / Lightbox Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            aria-label="Expand image"
            className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md text-primary dark:text-white shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-20"
          >
            <Maximize2 size={16} />
          </button>

          {/* Image Counter Pill */}
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono tracking-wider z-20 pointer-events-none">
            {activeIndex + 1} / {displayImages.length}
          </div>

          {/* Left / Right Nav Arrows */}
          {displayImages.length > 1 && (
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="p-2.5 bg-white/95 dark:bg-[#1A1816]/95 backdrop-blur-md text-primary dark:text-white rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all pointer-events-auto"
              >
                <ChevronLeft size={16} strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="p-2.5 bg-white/95 dark:bg-[#1A1816]/95 backdrop-blur-md text-primary dark:text-white rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all pointer-events-auto"
              >
                <ChevronRight size={16} strokeWidth={2.2} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-30"
              aria-label="Close fullscreen"
            >
              <X size={22} />
            </button>

            {/* Navigation in Lightbox */}
            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 text-white hover:bg-white/25 transition-all z-30 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 text-white hover:bg-white/25 transition-all z-30 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Main Lightbox Photo */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage}
                alt={productName}
                className="w-full h-full object-contain max-h-[85vh]"
              />

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono">
                {activeIndex + 1} / {displayImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
