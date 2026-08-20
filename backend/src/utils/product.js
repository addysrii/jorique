export function generateSKU(category, year, designNumber) {
  const categoryCode = String(category || 'GEN')
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, 'X');

  return `JR-${categoryCode}-${year}-${String(designNumber).padStart(3, '0')}`;
}

export function generateSerials(sku, quantity) {
  return Array.from({ length: quantity }, (_, index) => ({
    serial_number: `${sku}-${String(index + 1).padStart(4, '0')}`,
    qr_code: `${sku}-${String(index + 1).padStart(4, '0')}`,
    barcode: `${sku}-${String(index + 1).padStart(4, '0')}`,
    status: 'available',
  }));
}

export async function createUniqueSKU(supabase, category, year) {
  const { data, error } = await supabase.from('products').select('sku');
  if (error) throw error;

  const existingSkus = new Set((data || []).map((product) => product.sku));
  for (let designNumber = 1; designNumber <= 999999; designNumber += 1) {
    const sku = generateSKU(category, year, designNumber);
    if (!existingSkus.has(sku)) return sku;
  }

  throw new Error('Unable to generate a unique SKU. Please try again.');
}
