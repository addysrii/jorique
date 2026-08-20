import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-border rounded-lg overflow-hidden w-fit">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="w-10 h-10 flex items-center justify-center text-secondary hover:text-primary hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
      >
        <Minus size={14} strokeWidth={1.5} />
      </button>
      <span className="w-12 h-10 flex items-center justify-center text-sm font-medium text-text border-x border-border select-none">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="w-10 h-10 flex items-center justify-center text-secondary hover:text-primary hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
      >
        <Plus size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
