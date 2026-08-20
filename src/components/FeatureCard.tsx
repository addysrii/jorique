import { ReactNode } from 'react';
import { motion } from 'framer-motion';

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
      className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-border hover:shadow-md transition-shadow duration-300"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cream text-primary mb-5">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-primary tracking-wide mb-2">{title}</h3>
      <p className="text-sm text-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
}
