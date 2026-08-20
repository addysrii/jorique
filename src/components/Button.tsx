import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'dark' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'dark',
  size = 'md',
  fullWidth = false,
  type = 'button',
  disabled = false,
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium tracking-widest uppercase transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    dark: 'bg-primary text-white hover:bg-[#2a2623] active:scale-[0.98]',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.98]',
    ghost: 'text-primary hover:text-secondary active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-[10px] px-5 py-2.5',
    md: 'text-xs px-8 py-3.5',
    lg: 'text-xs px-10 py-4',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.015 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
}
