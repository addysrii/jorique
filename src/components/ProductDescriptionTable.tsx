import React, { useMemo } from 'react';
import { Table, Sparkles, ShieldCheck, Shirt, RefreshCw, Info } from 'lucide-react';
import { Product } from '../types';

interface ProductDescriptionTableProps {
  description?: string | null;
  product?: Product | null;
  selectedSize?: {
    name?: string;
    dimensions?: string;
    cmDimensions?: string;
  } | null;
  className?: string;
  showTitle?: boolean;
  showCare?: boolean;
}

interface ParsedDescription {
  overview: string;
  specs: Array<{ key: string; value: string }>;
  care: string[];
  disclaimer: string;
}

/**
 * Robust parser to convert raw product descriptions into structured specifications
 */
export function parseProductDescription(rawText?: string | null): ParsedDescription {
  if (!rawText || !rawText.trim()) {
    return { overview: '', specs: [], care: [], disclaimer: '' };
  }

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const specs: Array<{ key: string; value: string }> = [];
  const care: string[] = [];
  const overviewLines: string[] = [];
  let disclaimer = '';
  let activeSection: 'general' | 'care' | 'disclaimer' = 'general';

  for (const line of lines) {
    // Detect section switches
    if (/^care\s*instructions?:?/i.test(line)) {
      activeSection = 'care';
      continue;
    }
    if (/^colou?r\s*disclaimer?:?/i.test(line) || /^disclaimer?:?/i.test(line)) {
      activeSection = 'disclaimer';
      const stripped = line.replace(/^colou?r\s*disclaimer?:?\s*/i, '').replace(/^disclaimer?:?\s*/i, '');
      if (stripped) disclaimer = stripped;
      continue;
    }

    // Process care instructions
    if (activeSection === 'care') {
      const clean = line.replace(/^([•\-\*]|\d+[\.\)])\s+/, '').trim();
      if (clean) care.push(clean);
      continue;
    }

    // Process disclaimer
    if (activeSection === 'disclaimer') {
      disclaimer = disclaimer ? `${disclaimer} ${line}` : line;
      continue;
    }

    // Check for "Key: Value" pattern
    const cleanLine = line.replace(/^([•\-\*]|\d+[\.\)])\s+/, '');
    const colonIdx = cleanLine.indexOf(':');

    if (
      colonIdx > 0 &&
      colonIdx < 35 &&
      cleanLine.length > colonIdx + 1 &&
      !cleanLine.toLowerCase().startsWith('http')
    ) {
      const key = cleanLine.slice(0, colonIdx).trim();
      const value = cleanLine.slice(colonIdx + 1).trim();
      if (key && value) {
        specs.push({ key, value });
        continue;
      }
    }

    // Otherwise, treat as narrative/overview text
    overviewLines.push(line);
  }

  return {
    overview: overviewLines.join(' '),
    specs,
    care,
    disclaimer,
  };
}

export default function ProductDescriptionTable({
  description,
  product,
  selectedSize,
  className = '',
  showTitle = true,
  showCare = false,
}: ProductDescriptionTableProps) {
  const parsed = useMemo(() => {
    return parseProductDescription(description || product?.description);
  }, [description, product?.description]);

  // Combine extracted specs with relevant product metadata without duplicates (Excluding SKU from user view)
  const finalSpecs = useMemo(() => {
    // Filter out any specs extracted from raw description that mention SKU
    const list: Array<{ key: string; value: string }> = parsed.specs.filter(
      (s) => !/sku|product\s*sku|sku\s*code/i.test(s.key)
    );
    const existingKeys = new Set(list.map((s) => s.key.toLowerCase()));

    // Inject metadata if not already present (SKU is excluded from customer-facing table)
    if (product) {
      if (product.category && !existingKeys.has('category') && !existingKeys.has('type')) {
        list.push({ key: 'Category', value: product.category });
      }
      if (product.subcategory && !existingKeys.has('subcategory') && !existingKeys.has('collection')) {
        list.push({ key: 'Collection', value: product.subcategory });
      }
      if (selectedSize?.dimensions && !existingKeys.has('dimensions') && !existingKeys.has('size')) {
        list.push({ key: 'Dimensions', value: selectedSize.dimensions });
      }
      if (product.brand_id && !existingKeys.has('brand') && !existingKeys.has('origin')) {
        list.push({ key: 'Brand / Origin', value: product.brand_id });
      } else if (!existingKeys.has('origin') && !existingKeys.has('heritage')) {
        list.push({ key: 'Origin & Craft', value: 'Handcrafted in India' });
      }
      if (product.inStock !== undefined && !existingKeys.has('availability')) {
        list.push({
          key: 'Availability',
          value: product.inStock !== false ? 'Ready to Ship (In Stock)' : 'Made to Order (Pre-Order)',
        });
      }
      if (!existingKeys.has('lighting') && !existingKeys.has('color calibration')) {
        list.push({
          key: 'Color Fidelity',
          value: 'Calibrated Studio Daylight (Warm • Neutral • Cold Guide in Gallery)',
        });
      }
    }

    return list;
  }, [parsed.specs, product, selectedSize]);

  // If there are no specs and no overview at all, return null
  if (finalSpecs.length === 0 && !parsed.overview && parsed.care.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title Header */}
      {showTitle && (
        <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/70 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Table size={14} className="text-[#C6A96B] dark:text-[#D4AF37]" />
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary dark:text-white">
              Product Specifications & Details
            </h4>
          </div>
          <span className="text-[10px] font-mono text-secondary dark:text-white/50">
            {finalSpecs.length} Attributes
          </span>
        </div>
      )}

      {/* Narrative Overview / Description Paragraph (if any) */}
      {parsed.overview && (
        <div className="p-3.5 rounded-xl bg-cream/40 dark:bg-white/5 border border-border/70 dark:border-white/10">
          <p className="text-xs text-secondary dark:text-white/80 leading-relaxed font-sans">
            {parsed.overview}
          </p>
        </div>
      )}

      {/* Main Specifications Table */}
      {finalSpecs.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border/80 dark:border-[#2E2925] bg-white dark:bg-[#161412] shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] dark:bg-[#1F1C19] border-b border-border/80 dark:border-[#2E2925]">
                <th className="py-2.5 px-3.5 sm:px-4 font-bold text-[10px] uppercase tracking-[0.16em] text-secondary/80 dark:text-[#D4AF37] w-2/5 sm:w-1/3">
                  Specification
                </th>
                <th className="py-2.5 px-3.5 sm:px-4 font-bold text-[10px] uppercase tracking-[0.16em] text-secondary/80 dark:text-[#D4AF37] w-3/5 sm:w-2/3">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-[#26211D]">
              {finalSpecs.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    idx % 2 === 0
                      ? 'bg-transparent'
                      : 'bg-[#FAF8F5]/60 dark:bg-white/[0.02]'
                  } hover:bg-cream/50 dark:hover:bg-white/[0.04]`}
                >
                  <td className="py-2.5 px-3.5 sm:px-4 font-medium text-secondary dark:text-white/70 align-top tracking-wide">
                    {row.key}
                  </td>
                  <td className="py-2.5 px-3.5 sm:px-4 font-semibold text-primary dark:text-white align-top leading-snug">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabular Care & Maintenance Instructions (Only rendered if showCare is explicitly enabled) */}
      {showCare && parsed.care.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border/80 dark:border-[#2E2925] bg-white dark:bg-[#161412] shadow-2xs mt-3">
          <div className="bg-[#FAF7F2] dark:bg-[#1F1C19] px-3.5 sm:px-4 py-2.5 border-b border-border/80 dark:border-[#2E2925] flex items-center gap-2">
            <RefreshCw size={13} className="text-[#C6A96B] dark:text-[#D4AF37]" />
            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-secondary/90 dark:text-[#D4AF37]">
              Care & Handling Instructions
            </span>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <tbody className="divide-y divide-border/60 dark:divide-[#26211D]">
              {parsed.care.map((item, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    idx % 2 === 0 ? 'bg-transparent' : 'bg-[#FAF8F5]/60 dark:bg-white/[0.02]'
                  } hover:bg-cream/40 dark:hover:bg-white/[0.04]`}
                >
                  <td className="py-2 px-3 sm:px-4 text-[10px] font-mono font-bold text-[#C6A96B] dark:text-[#D4AF37] w-8 text-center align-top">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-secondary dark:text-white/80 font-normal align-top leading-relaxed">
                    {item}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Colour / Product Disclaimer */}
      {parsed.disclaimer && (
        <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-secondary dark:text-white/70 leading-relaxed flex items-start gap-2">
          <Info size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-primary dark:text-[#D4AF37] mr-1">
              Note on Handcrafted Colours:
            </span>
            <span>{parsed.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
}
