import React from 'react';
import ProductDescriptionTable from './ProductDescriptionTable';

interface ProductDescriptionGridProps {
  description?: string;
  className?: string;
  showTitle?: boolean;
}

/**
 * ProductDescriptionGrid forwards to ProductDescriptionTable to ensure a consistent,
 * ultra-luxurious tabular layout across both customer-facing PDP and admin edit previews.
 */
export default function ProductDescriptionGrid({
  description,
  className = '',
  showTitle = true,
}: ProductDescriptionGridProps) {
  if (!description || !description.trim()) return null;

  return (
    <ProductDescriptionTable
      description={description}
      className={className}
      showTitle={showTitle}
    />
  );
}
