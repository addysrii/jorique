import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingMasterpieceProps {
  fullScreen?: boolean;
  className?: string;
  message?: string;
}

export default function LoadingMasterpiece({
  fullScreen = true,
  className = '',
  message = 'LOADING',
}: LoadingMasterpieceProps = {}) {
  // Step cycles: 1 -> 2 -> 3 -> 1 -> 2 -> 3
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev === 3 ? 1 : ((prev + 1) as 1 | 2 | 3)));
    }, 450);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`${
        fullScreen
          ? 'min-h-screen bg-[#F5EDE3] dark:bg-[#100E0D]'
          : 'py-16 w-full bg-transparent'
      } text-[#1A1A1A] dark:text-[#FCFAF7] flex flex-col items-center justify-center gap-5 selection:bg-[#C6A96B]/30 transition-colors duration-500 select-none ${className}`}
    >
      {/* "LOADING" in CAPSLOCK with Sequential Blinking Dots */}
      <div className="flex items-center font-mainlogo mt-1">
        <span className="text-sm sm:text-base font-normal tracking-[0.25em] uppercase text-[#1A1A1A] dark:text-[#FCFAF7]">
          {message}
        </span>

        {/* Sequential Dots Container */}
        <div className="flex items-center gap-1.5 ml-2.5 w-12">
          {[1, 2, 3].map((dotIndex) => {
            const isVisible = activeStep >= dotIndex;
            const isCurrentlyBlinking = activeStep === dotIndex;

            return (
              <motion.span
                key={dotIndex}
                initial={false}
                animate={
                  isVisible
                    ? isCurrentlyBlinking
                      ? {
                          opacity: [0.25, 1, 0.25, 1],
                          scale: [0.85, 1.35, 1],
                        }
                      : {
                          opacity: 1,
                          scale: 1,
                        }
                    : {
                        opacity: 0,
                        scale: 0.5,
                      }
                }
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                }}
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  isCurrentlyBlinking
                    ? 'bg-black dark:bg-white shadow-[0_0_6px_rgba(0,0,0,0.4)] dark:shadow-[0_0_6px_rgba(255,255,255,0.6)]'
                    : 'bg-black/80 dark:bg-white/80'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
