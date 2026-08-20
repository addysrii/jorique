import { supabase } from '../supabase';

export function generateSKU(category: string, year: number, designNumber: number): string {
  const categoryCode = String(category || 'GEN')
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, 'X');

  return `JR-${categoryCode}-${year}-${String(designNumber).padStart(3, '0')}`;
}

export function generateSerials(sku: string, quantity: number): string[] {
  return Array.from({ length: quantity }, (_, index) =>
    `${sku}-${String(index + 1).padStart(4, '0')}`
  );
}

export async function createUniqueSKU(category: string, year: number): Promise<string> {
  const { data, error } = await supabase.from('products').select('sku');
  if (error) throw error;

  const existingSkus = new Set((data || []).map((product) => product.sku));
  for (let designNumber = 1; designNumber <= 999999; designNumber += 1) {
    const sku = generateSKU(category, year, designNumber);
    if (!existingSkus.has(sku)) return sku;
  }

  throw new Error('Unable to generate a unique SKU. Please try again.');
}
