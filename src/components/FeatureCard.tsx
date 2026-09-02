import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Parallax3DCard from './Parallax3DCard';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index?: number;
}

export default function FeatureCard({ icon, title, description, index = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Parallax3DCard
        maxRotation={12}
        perspective={1000}
        glareEffect={true}
        scaleOnHover={1.03}
        className="h-full"
      >
        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/95 dark:bg-[#1A1816] backdrop-blur-sm border border-border dark:border-[#2E2925] hover:border-primary/40 dark:hover:border-[#D4AF37]/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full transform-style-3d">
          <div
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-cream/80 dark:bg-white/10 text-primary dark:text-[#D4AF37] mb-5 shadow-inner"
            style={{ transform: 'translateZ(30px)' }}
          >
            {icon}
          </div>
          <h3
            className="text-base font-medium text-primary dark:text-white tracking-wide mb-2"
            style={{ transform: 'translateZ(20px)' }}
          >
            {title}
          </h3>
          <p
            className="text-xs sm:text-sm text-secondary dark:text-white/60 leading-relaxed"
            style={{ transform: 'translateZ(10px)' }}
          >
            {description}
          </p>
        </div>
      </Parallax3DCard>
    </motion.div>
  );
}
