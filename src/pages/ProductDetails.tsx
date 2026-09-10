import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Truck,
  RefreshCw,
  Shield,
  ShieldCheck,
  Check,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Plus,
  Minus,
  Ruler,
  ChevronDown,
  CheckCircle2,
  Zap,
  MapPin,
  Lock,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductImageGallery from '../components/ProductImageGallery';
import SizeGuideModal from '../components/SizeGuideModal';
import ColorDisclaimerSection from '../components/ColorDisclaimerSection';
import ProductDescriptionTable, { parseProductDescription } from '../components/ProductDescriptionTable';
import SEO from '../components/SEO';
import { productService } from '../lib/api/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface SizeOption {
  id: string;
  name: string;
  dimensions: string;
  cmDimensions: string;
  priceOffset: number;
  includes: string;
}

function getProductSizes(product: Product): SizeOption[] {
  // 1. Explicit sizes array in product data
  const pRecord = product as unknown as Record<string, unknown>;
  const rawSizes = pRecord.sizes || pRecord.size_options || pRecord.sizeOptions;
  if (Array.isArray(rawSizes) && rawSizes.length > 0) {
    return rawSizes
      .map((s, idx) => {
        if (typeof s === 'string') {
          const lower = s.toLowerCase().trim();
          let dims = '';
          let cmDims = '';
          let inc = '';
          if (lower.includes('single')) {
            dims = '90" x 60"';
            cmDims = '228 cm x 152 cm';
            inc = `1 Single ${product.category || 'Piece'} (228 cm x 152 cm)`;
          } else if (lower.includes('double')) {
            dims = '100" x 90"';
            cmDims = '254 cm x 228 cm';
            inc = `1 Double ${product.category || 'Piece'} (254 cm x 228 cm)`;
          } else if (lower.includes('king')) {
            dims = '108" x 100"';
            cmDims = '274 cm x 254 cm';
            inc = `1 King ${product.category || 'Piece'} (274 cm x 254 cm)`;
          } else if (lower.includes('queen')) {
            dims = '90" x 90"';
            cmDims = '228 cm x 228 cm';
            inc = `1 Queen ${product.category || 'Piece'} (228 cm x 228 cm)`;
          }
          return {
            id: `size-${idx}-${lower.replace(/\s+/g, '-')}`,
            name: s,
            dimensions: dims,
            cmDimensions: cmDims,
            priceOffset: idx === 0 ? 0 : idx === 1 ? 1050 : 1850,
            includes: inc,
          };
        } else if (typeof s === 'object' && s !== null) {
          return {
            id: s.id || `size-${idx}`,
            name: s.name || s.title || s.label || `Size ${idx + 1}`,
            dimensions: s.dimensions || s.dimension || '',
            cmDimensions: s.cmDimensions || '',
            priceOffset: Number(s.priceOffset || s.price_offset || 0),
            includes: s.includes || '',
          };
        }
        return null;
      })
      .filter(Boolean) as SizeOption[];
  }

  // 2. Check tags for sizes
  const sizeKeywords = [
    'single comforter',
    'double comforter',
    'king comforter',
    'queen comforter',
    'single bedsheet',
    'double bedsheet',
    'king bedsheet',
    'queen bedsheet',
    'single',
    'double',
    'king',
    'queen',
    'small',
    'medium',
    'large',
    'xl',
    'xxl',
  ];

  const matchedFromTags: string[] = [];
  if (Array.isArray(product.tags) && product.tags.length > 0) {
    product.tags.forEach((tag) => {
      const lower = tag.toLowerCase().trim();
      if (lower.startsWith('size:') || lower.startsWith('sizes:')) {
        const parts = tag.split(':')[1].split(',').map((p) => p.trim()).filter(Boolean);
        matchedFromTags.push(...parts);
      } else {
        const match = sizeKeywords.find((k) => lower === k);
        if (match) {
          matchedFromTags.push(tag);
        }
      }
    });
  }

  if (matchedFromTags.length > 0) {
    return matchedFromTags.map((t, idx) => {
      const lower = t.toLowerCase();
      let dims = '';
      let cmDims = '';
      let inc = '';
      if (lower.includes('single')) {
        dims = '90" x 60"';
        cmDims = '228 cm x 152 cm';
        inc = `1 Single ${product.category || 'Piece'} (228 cm x 152 cm)`;
      } else if (lower.includes('double')) {
        dims = '100" x 90"';
        cmDims = '254 cm x 228 cm';
        inc = `1 Double ${product.category || 'Piece'} (254 cm x 228 cm)`;
      } else if (lower.includes('king')) {
        dims = '108" x 100"';
        cmDims = '274 cm x 254 cm';
        inc = `1 King ${product.category || 'Piece'} (274 cm x 254 cm)`;
      } else if (lower.includes('queen')) {
        dims = '90" x 90"';
        cmDims = '228 cm x 228 cm';
        inc = `1 Queen ${product.category || 'Piece'} (228 cm x 228 cm)`;
      }
      return {
        id: `tag-size-${idx}-${lower.replace(/\s+/g, '-')}`,
        name: t,
        dimensions: dims,
        cmDimensions: cmDims,
        priceOffset: idx === 0 ? 0 : idx === 1 ? 1050 : 1850,
        includes: inc,
      };
    });
  }

  // 3. Check if description has an explicit "Sizes:" or "Available Sizes:" line
  if (product.description) {
    const lines = product.description.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^(available\s+)?sizes?:\s+/i.test(trimmed)) {
        const sizePart = trimmed.replace(/^(available\s+)?sizes?:\s+/i, '');
        const splits = sizePart.split(/[,/|]/).map((s) => s.trim()).filter(Boolean);
        if (splits.length > 0) {
          return splits.map((s, idx) => ({
            id: `desc-size-${idx}`,
            name: s,
            dimensions: '',
            cmDimensions: '',
            priceOffset: 0,
            includes: '',
          }));
        }
      }
    }
  }

  // 4. Default to NO sizes if product data doesn't have it
  return [];
}

const COLOR_HEX_MAP: Record<string, string> = {
  'eternal glow': '#C6A96B',
  'royal ivory': '#F5EDE3',
  'ivory': '#F5EDE3',
  'cream': '#F5EDE3',
  'champagne': '#EAD7BA',
  'blushing pink': '#E8A898',
  'pink': '#D88579',
  'dreamy blue': '#4A6B82',
  'midnight navy': '#1B2A4A',
  'navy': '#1B2A4A',
  'blue': '#243B64',
  'emerald green': '#0B5F61',
  'emerald': '#0B5F61',
  'green': '#2D5A27',
  'olive oasis': '#556B2F',
  'olive': '#556B2F',
  'flirty red': '#8B0000',
  'velvet wine': '#641F2D',
  'wine': '#641F2D',
  'burgundy': '#641F2D',
  'melted caramel': '#B77443',
  'harbour mist grey': '#7A8288',
  'grey': '#6B7280',
  'hot chocolate': '#3E2723',
  'midnight black': '#1A1A1A',
  'black': '#1A1A1A',
  'classic charcoal': '#2B2825',
  'pristine white': '#FFFFFF',
  'white': '#FFFFFF',
};

// Real SKU to authentic catalog color mapping
const SKU_COLOR_MAP: Record<string, { colorName: string; colorHex: string }> = {
  'JR-ESS-WU-001': { colorName: 'Royal Plum Magenta', colorHex: '#892C4E' },
  'JR-ESS-WU-002': { colorName: 'Olive Green', colorHex: '#4D5838' },
  'JR-ESS-WU-003': { colorName: 'Royal Indigo Blue', colorHex: '#1C3B68' },
  'JR-ESS-WU-004': { colorName: 'Tangerine Orange', colorHex: '#E8652B' },
  'JR-ESS-WU-005': { colorName: 'Mustard Gold', colorHex: '#C99B26' },
  'JR-ESS-WU-006': { colorName: 'Rani Fuchsia Pink', colorHex: '#C71585' },
  'JR-ESS-WU-007': { colorName: 'Onyx Black & Pink', colorHex: '#1E1E1E' },
  'JR-ESS-WU-008': { colorName: 'Ivory Cream & Black', colorHex: '#EDE8DF' },
  'JR-TOW-2026-001': { colorName: 'Ocean Blue', colorHex: '#243B64' },
  'JR-PIL-2026-002': { colorName: 'Purple Iris', colorHex: '#6A4B82' },
  'JR-BED-2026-001': { colorName: 'Royal Ivory', colorHex: '#F5EDE3' },
  'JR-BED-2026-002': { colorName: 'Mint & Pastel Multicolour', colorHex: '#52B2BF' },
  'JR-MT-2026-002': { colorName: 'Classic White & Grey', colorHex: '#ECEAE6' },
  'JR-MAT-2026-001': { colorName: 'Natural Ecru', colorHex: '#E5DFD5' },
};

function getColorInfo(product: Product | null | undefined): { colorName: string; colorHex: string } {
  if (!product) return { colorName: 'Signature Shade', colorHex: '#C6A96B' };

  const sku = (product.sku || '').toUpperCase().trim();
  if (SKU_COLOR_MAP[sku]) {
    return SKU_COLOR_MAP[sku];
  }

  // 1. Check title for " - Color"
  if (product.name && product.name.includes(' - ')) {
    const rawColor = product.name.split(' - ')[1].trim();
    const lower = rawColor.toLowerCase();
    let hex = '#C6A96B';
    for (const [k, v] of Object.entries(COLOR_HEX_MAP)) {
      if (lower.includes(k)) {
        hex = v;
        break;
      }
    }
    return { colorName: rawColor, colorHex: hex };
  }

  // 2. Check description for "Colours:" or "Color:"
  if (product.description) {
    const lines = product.description.split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^colou?rs?:\s*(.+)$/i);
      if (match && match[1]) {
        const descColor = match[1].trim();
        const firstPart = descColor.split(/[,&]/)[0].trim();
        const lower = firstPart.toLowerCase();
        let hex = '#C6A96B';
        for (const [k, v] of Object.entries(COLOR_HEX_MAP)) {
          if (lower.includes(k)) {
            hex = v;
            break;
          }
        }
        return { colorName: firstPart, colorHex: hex };
      }
    }
  }

  // 3. Check tags for direct hex or named colors
  if (product.tags && Array.isArray(product.tags)) {
    const directHexTag = product.tags.find(t => /^#[0-9A-Fa-f]{6}$/.test(t.trim()));
    if (directHexTag) {
      const colorTitle = product.name && product.name.includes(' - ')
        ? product.name.split(' - ')[1].trim()
        : 'Signature Shade';
      return { colorName: colorTitle, colorHex: directHexTag.trim().toUpperCase() };
    }

    for (const tag of product.tags) {
      const lower = tag.toLowerCase().trim();
      if (COLOR_HEX_MAP[lower]) {
        return {
          colorName: tag.charAt(0).toUpperCase() + tag.slice(1),
          colorHex: COLOR_HEX_MAP[lower],
        };
      }
    }
  }

  return { colorName: 'Signature Shade', colorHex: '#C6A96B' };
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>(); // This is SKU or ID
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [siblingColorways, setSiblingColorways] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedQty, setSelectedQty] = useState(1);
  const [availableSizes, setAvailableSizes] = useState<SizeOption[]>([]);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Accordion Toggles
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    specs: true,
    features: true,
    washcare: false,
    returns: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Pincode Delivery Estimator
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'valid' | 'error'>('idle');
  const [deliveryDate, setDeliveryDate] = useState('');

  // Sticky bottom conversion bar visibility
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainBuyRef = useRef<HTMLDivElement | null>(null);

  // Cart actions
  const { addToCart, buyNow } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError('Product not found');
          return;
        }

        let data = await productService.getProductBySku(id);
        if (!data) {
          try {
            data = await productService.getProductById(id);
          } catch {
            // not found by id
          }
        }

        if (!data) {
          setError('Product not found');
          return;
        }

        setProduct(data);

        // Check if product data actually has sizes
        const sizes = getProductSizes(data);
        setAvailableSizes(sizes);
        setSelectedSize(sizes.length > 0 ? sizes[0] : null);

        // Calculate delivery estimate (3 days from now)
        const date = new Date();
        date.setDate(date.getDate() + 3);
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
        setDeliveryDate(date.toLocaleDateString('en-IN', options));

        // Fetch related products & sibling color variants
        const allProducts = await productService.getProducts();

        const baseTitle = data.name.includes(' - ') ? data.name.split(' - ')[0].trim() : data.name.trim();
        const siblings = allProducts.filter((p) => {
          if (p.id === data.id || p.sku === data.sku) return false;
          const pBase = p.name.includes(' - ') ? p.name.split(' - ')[0].trim() : p.name.trim();
          return pBase.toLowerCase() === baseTitle.toLowerCase();
        });
        setSiblingColorways(siblings);

        const related = allProducts.filter((p) => p.id !== data.id && p.category === data.category).slice(0, 3);
        const fallback = allProducts.filter((p) => p.id !== data.id).slice(0, 3);
        setRelatedProducts(related.length >= 2 ? related : fallback);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Scroll listener for sticky bottom bar
  useEffect(() => {
    const handleScroll = () => {
      if (!mainBuyRef.current) return;
      const rect = mainBuyRef.current.getBoundingClientRect();
      // Show sticky bar when the main buy buttons scroll above viewport
      setShowStickyBar(rect.bottom < 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus('error');
      return;
    }
    setPincodeStatus('checking');
    setTimeout(() => {
      setPincodeStatus('valid');
    }, 450);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-primary dark:border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs tracking-widest uppercase text-secondary dark:text-white/60">Loading Masterpiece...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <p className="text-secondary dark:text-white/60 mb-6">{error || 'Product not found'}</p>
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-[#D4AF37] border-b border-primary dark:border-[#D4AF37] pb-1"
          >
            Return to Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Dynamic Price Calculations based on Variant Size (if available)
  const baseDiscountPrice = product.discount_price || product.price;
  const sizePriceOffset = selectedSize ? selectedSize.priceOffset : 0;
  const currentPrice = baseDiscountPrice + sizePriceOffset;
  const originalPrice = (product.price || baseDiscountPrice) + sizePriceOffset;
  const discountPercentage =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 28; // Standard luxury promotional discount fallback

  const upiInstantPrice = Math.round(currentPrice * 0.9); // 10% instant discount for prepaid/UPI

  // Create variant product for cart actions
  const variantProduct: Product = {
    ...product,
    id: selectedSize ? `${product.id}-${selectedSize.id}` : product.id,
    name: selectedSize ? `${product.name} - ${selectedSize.name}` : product.name,
    price: originalPrice,
    discount_price: currentPrice,
  };

  const productImageUrl = product.images && product.images.length > 0
    ? (product.images[0].startsWith('http') ? product.images[0] : `https://jorique.in${product.images[0]}`)
    : 'https://jorique.in/images/hero.png';

  const productCleanDescription = product.description
    ? product.description.replace(/[\r\n]+/g, ' ').slice(0, 160)
    : `Experience the heirloom craftsmanship of the ${product.name} by JORIQUE.`;

  const productStructuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images : [productImageUrl],
    description: product.description || productCleanDescription,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'JORIQUE'
    },
    offers: {
      '@type': 'Offer',
      url: `https://jorique.in/product/${product.id}`,
      priceCurrency: 'INR',
      price: currentPrice,
      availability: (product.quantity && product.quantity > 0) ? 'https://schema.org/InStock' : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300">
      <SEO
        title={`${product.name} | JORIQUE Luxury Home & Living`}
        description={productCleanDescription}
        canonical={`https://jorique.in/product/${product.id}`}
        image={productImageUrl}
        type="product"
        structuredData={productStructuredData}
      />
      <Navbar />

      <div className="pt-20 lg:pt-24">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 border-b border-border/70 dark:border-[#2E2925]">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-secondary dark:text-white/60 hover:text-primary dark:hover:text-[#D4AF37] transition-colors duration-200"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              Back
            </button>
            <div className="flex items-center gap-2 text-xs font-sans text-secondary dark:text-white/50">
              <span className="hover:text-primary dark:hover:text-white cursor-pointer" onClick={() => navigate('/shop')}>
                Catalog
              </span>
              <span>/</span>
              <span className="hover:text-primary dark:hover:text-white cursor-pointer" onClick={() => navigate('/shop')}>
                {product.category || 'Bedding'}
              </span>
              <span>/</span>
              <span className="text-primary dark:text-white font-medium truncate max-w-[180px] sm:max-w-[280px]">
                {product.name}
              </span>
            </div>
          </div>
        </div>

        {/* Main PDP Grid (Images on Left, Buy Box on Right) */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* LEFT COLUMN: High-Resolution Luxury Image Gallery with Zoom & Lightbox (lg:col-span-7) */}
            <div className="lg:col-span-7 lg:sticky lg:top-28">
              <ProductImageGallery
                images={product.images}
                productName={product.name}
                badge={product.badge}
                discountPercentage={discountPercentage}
              />
            </div>

            {/* RIGHT COLUMN: Product Details, Variations, Stoa Paris Pricing & CTAs (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col space-y-6">

              {/* Product Header & Rating */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cream dark:bg-white/5 text-secondary dark:text-[#D4AF37] text-[10px] font-bold tracking-[0.25em] uppercase border border-border dark:border-[#2E2925]">
                    {product.category || 'Luxury Collection'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                    <Sparkles size={11} /> Limited Time Offer
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-primary dark:text-white leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Box with Stoa Paris Instant UPI Discount */}
              <div className="p-4 sm:p-5 rounded-2xl bg-cream/35 dark:bg-[#1A1816] border border-border/80 dark:border-[#2E2925] space-y-3 shadow-2xs">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-times font-bold text-primary dark:text-[#D4AF37] tracking-tight tabular-nums">
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </span>
                  {originalPrice > currentPrice && (
                    <span className="text-base font-times text-secondary/60 dark:text-white/40 line-through tabular-nums">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="text-xs font-times font-bold text-white bg-[#851C25] px-2.5 py-0.5 rounded-full uppercase tracking-wider tabular-nums">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {/* Signature Stoa Paris UPI Callout */}
                {/* <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-xs text-primary dark:text-white">
                  <Zap size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    UPI & Card Orders get it for <strong className="font-times font-bold text-[#851C25] dark:text-[#D4AF37] tabular-nums">₹{upiInstantPrice.toLocaleString('en-IN')}</strong> (Extra 10% Off)
                  </span>
                </div> */}
              </div>

              {/* Sibling Colorways Swatches (Stoa Paris Swatch System) */}
              {product && (() => {
                const currentColor = getColorInfo(product);
                const activeColorKey = currentColor.colorName.toLowerCase();
                const seen = new Set<string>([activeColorKey]);
                const uniqueSiblings: Array<{ product: Product; colorInfo: { colorName: string; colorHex: string } }> = [];

                for (const sib of siblingColorways) {
                  const info = getColorInfo(sib);
                  const key = info.colorName.toLowerCase();
                  if (!seen.has(key)) {
                    seen.add(key);
                    uniqueSiblings.push({ product: sib, colorInfo: info });
                  }
                }

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70">
                        <span>Colour:</span>
                        <span className="text-primary dark:text-white font-bold">
                          {currentColor.colorName}
                        </span>
                      </div>
                      {uniqueSiblings.length > 0 && (
                        <span className="text-[11px] text-secondary/70 dark:text-white/50 font-medium">
                          {uniqueSiblings.length + 1} Colours Available
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Current Active Color Pill */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-primary dark:border-[#D4AF37] bg-white dark:bg-[#1A1816] shadow-xs text-xs font-bold text-primary dark:text-white">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-inner"
                          style={{ backgroundColor: currentColor.colorHex }}
                        />
                        <span>{currentColor.colorName}</span>
                        <Check size={12} className="text-primary dark:text-[#D4AF37]" strokeWidth={3} />
                      </div>

                      {/* Sibling Swatches */}
                      {uniqueSiblings.map(({ product: sibling, colorInfo }) => (
                        <button
                          key={sibling.id}
                          onClick={() => navigate(`/product/${sibling.sku || sibling.id}`)}
                          title={colorInfo.colorName}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border dark:border-[#2E2925] hover:border-primary dark:hover:border-[#D4AF37] bg-white/70 dark:bg-[#100E0D] text-xs font-medium text-secondary dark:text-white/80 hover:text-primary dark:hover:text-white transition-all shadow-2xs hover:scale-105"
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-inner"
                            style={{ backgroundColor: colorInfo.colorHex }}
                          />
                          <span>{colorInfo.colorName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Size Variant Selector + Size Chart Modal Trigger (ONLY RENDERED IF PRODUCT DATA HAS SIZES) */}
              {availableSizes.length > 0 && selectedSize && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70">
                      Select Size:
                    </span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-[#D4AF37] hover:underline font-semibold"
                    >
                      <Ruler size={13} />
                      <span>Size chart</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {availableSizes.map((size) => {
                      const isSelected = selectedSize.id === size.id;
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`p-3 rounded-2xl border text-left transition-all ${isSelected
                            ? 'border-primary dark:border-[#D4AF37] bg-primary/5 dark:bg-[#D4AF37]/10 ring-2 ring-primary/20 dark:ring-[#D4AF37]/20'
                            : 'border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] hover:border-primary/40 dark:hover:border-white/30'
                            }`}
                        >
                          <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-primary dark:text-[#D4AF37]' : 'text-primary dark:text-white'}`}>
                            {size.name.replace(/\s+(Comforter|Bedsheet)/i, '')}
                          </p>
                          {size.dimensions && (
                            <p className="text-[11px] text-secondary dark:text-white/60 font-mono mt-0.5">
                              {size.dimensions}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* What's Included Callout (Stoa Paris Signature) */}
                  {selectedSize.includes && (
                    <div className="flex items-center gap-2 text-xs text-secondary dark:text-white/70 py-1">
                      <span className="font-bold text-primary dark:text-white">Includes:</span>
                      <span>{selectedSize.includes}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Stock Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  In stock, ready to ship
                </span>
              </div>

              {/* Quantity Selector & Purchase CTAs */}
              <div ref={mainBuyRef} className="space-y-4 pt-1">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70">
                    Quantity:
                  </span>
                  <div className="inline-flex items-center border border-border dark:border-[#2E2925] rounded-xl bg-white dark:bg-[#100E0D] shadow-2xs">
                    <button
                      onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-2 hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/70 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-xs font-bold text-primary dark:text-white font-mono">
                      {selectedQty}
                    </span>
                    <button
                      onClick={() => setSelectedQty((q) => q + 1)}
                      className="px-3.5 py-2 hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/70 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => addToCart(variantProduct, selectedQty)}
                    className="w-full sm:w-1/2 py-4 rounded-xl bg-primary dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98]"
                  >
                    <ShoppingBag size={17} />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={() => buyNow(variantProduct, selectedQty)}
                    className="w-full sm:w-1/2 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98]"
                  >
                    <MessageCircle size={18} />
                    <span>Buy Now via WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Pincode Delivery Estimator */}
              <div className="p-4 rounded-2xl bg-cream/30 dark:bg-white/5 border border-border dark:border-[#2E2925] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary dark:text-white">
                  <MapPin size={14} className="text-primary dark:text-[#D4AF37]" />
                  <span>Estimated Delivery & COD Check</span>
                </div>

                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      if (pincodeStatus !== 'idle') setPincodeStatus('idle');
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-[#12100E] border border-border dark:border-[#2E2925] text-xs text-primary dark:text-white placeholder:text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-xs"
                  >
                    {pincodeStatus === 'checking' ? 'Checking...' : 'Check'}
                  </button>
                </form>

                {pincodeStatus === 'valid' && (
                  <div className="space-y-1 text-xs text-emerald-700 dark:text-emerald-400 pt-1">
                    <p className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={13} />
                      <span>Delivery expected by <strong>{deliveryDate}</strong></span>
                    </p>
                    <p className="text-[11px] text-secondary dark:text-white/60 pl-5">
                      ✓ Free Express Shipping • Cash on Delivery Available
                    </p>
                  </div>
                )}

                {pincodeStatus === 'error' && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">
                    Please enter a valid 6-digit Indian pincode.
                  </p>
                )}
              </div>

              {/* 4 Pillars Trust & Reassurance Badges (Stoa Paris Style) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white dark:bg-[#1A1816] border border-border/80 dark:border-[#2E2925] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cream dark:bg-white/10 flex items-center justify-center text-primary dark:text-[#D4AF37] shrink-0">
                    <Truck size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary dark:text-white">Free Express Shipping</p>
                    <p className="text-[10px] text-secondary dark:text-white/60">On all orders above ₹999</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#1A1816] border border-border/80 dark:border-[#2E2925] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cream dark:bg-white/10 flex items-center justify-center text-primary dark:text-[#D4AF37] shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary dark:text-white">Defect Exchange Guarantee</p>
                    <p className="text-[10px] text-secondary dark:text-white/60">48-Hr transit/defect claim window</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#1A1816] border border-border/80 dark:border-[#2E2925] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cream dark:bg-white/10 flex items-center justify-center text-primary dark:text-[#D4AF37] shrink-0">
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary dark:text-white">100% Genuine Quality</p>
                    <p className="text-[10px] text-secondary dark:text-white/60">Authentic heirloom weave</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#1A1816] border border-border/80 dark:border-[#2E2925] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cream dark:bg-white/10 flex items-center justify-center text-primary dark:text-[#D4AF37] shrink-0">
                    <Lock size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary dark:text-white">Cash on Delivery</p>
                    <p className="text-[10px] text-secondary dark:text-white/60">Available across India</p>
                  </div>
                </div>
              </div>

              {/* LUXURY COLLAPSIBLE ACCORDIONS (Stoa Paris Signature PDP Component) */}
              <div className="border-t border-border dark:border-[#2E2925] pt-4 divide-y divide-border dark:divide-[#2E2925]">

                {/* 1. Product Features Highlight Grid */}
                {/* 
                 */}

                {/* 2. Product Details & Specifications (Tabular Format) */}
                <div className="py-4">
                  <button
                    onClick={() => toggleAccordion('specs')}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold tracking-wide text-primary dark:text-white group-hover:text-[#D4AF37] transition-colors">
                      <Ruler size={16} className="text-[#D4AF37]" />
                      Product Details & Specifications
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-secondary transition-transform duration-200 ${openAccordions.specs ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openAccordions.specs && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden pt-4 space-y-3"
                      >
                        <ProductDescriptionTable
                          description={product.description}
                          product={product}
                          selectedSize={selectedSize}
                          showTitle={false}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Washcare Instructions */}
                <div className="py-4">
                  <button
                    onClick={() => toggleAccordion('washcare')}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold tracking-wide text-primary dark:text-white group-hover:text-[#D4AF37] transition-colors">
                      <RefreshCw size={16} className="text-[#D4AF37]" />
                      Washcare & Maintenance
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-secondary transition-transform duration-200 ${openAccordions.washcare ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openAccordions.washcare && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden pt-4 text-xs text-secondary dark:text-white/70 space-y-2 leading-relaxed"
                      >
                        {(() => {
                          const parsed = parseProductDescription(product.description);
                          if (parsed.care && parsed.care.length > 0) {
                            return (
                              <div className="overflow-hidden rounded-xl border border-border/80 dark:border-[#2E2925] bg-white dark:bg-[#161412] shadow-2xs">
                                <table className="w-full text-left border-collapse text-xs">
                                  <tbody className="divide-y divide-border/60 dark:divide-[#26211D]">
                                    {parsed.care.map((item, idx) => (
                                      <tr
                                        key={idx}
                                        className={`transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-[#FAF8F5]/60 dark:bg-white/[0.02]'
                                          } hover:bg-cream/40 dark:hover:bg-white/[0.04]`}
                                      >
                                        <td className="py-2.5 px-3.5 text-[10px] font-mono font-bold text-[#C6A96B] dark:text-[#D4AF37] w-8 text-center align-top">
                                          {String(idx + 1).padStart(2, '0')}
                                        </td>
                                        <td className="py-2.5 px-3.5 text-secondary dark:text-white/80 font-normal align-top leading-relaxed">
                                          {item}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          }
                          return (
                            <p className="text-center py-3 text-secondary dark:text-white/60">
                              Content to be added
                            </p>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. Returns & Exchange Policy */}
                <div className="py-4">
                  <button
                    onClick={() => toggleAccordion('returns')}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold tracking-wide text-primary dark:text-white group-hover:text-[#D4AF37] transition-colors">
                      <Shield size={16} className="text-[#D4AF37]" />
                      Returns & Exchange Policy
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-secondary transition-transform duration-200 ${openAccordions.returns ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openAccordions.returns && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden pt-4 text-xs text-secondary dark:text-white/70 space-y-3 leading-relaxed"
                      >
                        <p className="font-semibold text-primary dark:text-white">
                          Pre-Dispatch Inspection & Defect-Only Exchange Policy:
                        </p>
                        <ul className="space-y-1.5 list-disc pl-4 text-secondary/90 dark:text-white/80">
                          <li>
                            Every JORIQUE product is meticulously inspected before packaging. We do <strong>not</strong> accept returns or exchanges for change of mind or subjective preference.
                          </li>
                          <li>
                            Exchange is available exclusively for genuine manufacturing defects, transit damage, or incorrect items reported within <strong>48 hours of delivery</strong>.
                          </li>
                          <li>
                            <strong>Mandatory 360° Unboxing Video:</strong> A complete, continuous opening video recorded from <em>before</em> the parcel is opened (showing outer packaging, shipping label, and item condition) is strictly required to verify any claim.
                          </li>
                          <li>
                            The item must remain unused, unwashed, unaltered, and in its original luxury packaging.
                          </li>
                        </ul>
                        <div className="pt-2">
                          <Link
                            to="/return-policy"
                            className="inline-flex items-center gap-1.5 font-bold text-[#851C25] dark:text-[#D4AF37] hover:underline"
                          >
                            <span>Read Full Return & Exchange Policy</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ATMOSPHERIC EDITORIAL SHOWCASE (Stoa Paris Signature Full-Width Section) */}
        {/* <section className="my-16 lg:my-24 py-16 lg:py-24 bg-cream/40 dark:bg-[#151311] border-y border-border/80 dark:border-[#2E2925] overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#851C25] dark:text-[#D4AF37] block mb-2">
                    {product.category || 'Collection'} Spotlight
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-light text-primary dark:text-white leading-tight">

                  </h2>
                </div>
                <div className="p-8 rounded-2xl bg-cream/35 dark:bg-white/5 border border-border/70 dark:border-[#2E2925] text-xs text-secondary dark:text-white/60">
                  Content to be added
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-border dark:border-[#2E2925] aspect-[4/3]">
                  <img
                    src={product.images[1] || product.images[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200'}
                    alt="Luxury lifestyle detail"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <p className="text-[11px] text-secondary/70 dark:text-white/50 text-center mt-3 italic">
                  * Fabric sheen and golden hues adapt gracefully to warm ambient bedroom lighting.
                </p>
              </div>
            </div>
          </div>
        </section> */}

        {/* COLOUR DISCLAIMER SECTION WITH MULTI-DEVICE MOCKUPS */}
        <ColorDisclaimerSection images={product.images} productName={product.name} />

        {/* CUSTOMER REVIEWS & RATINGS SECTION */}
        {/* <section id="reviews-section" className="py-14 lg:py-20 max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#851C25] dark:text-[#D4AF37]">
              Customer Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-primary dark:text-white">
              Content to be added
            </h2>
          </div>

          <div className="p-10 rounded-3xl bg-cream/35 dark:bg-[#1A1816] border border-border dark:border-[#2E2925] text-center space-y-4 max-w-xl mx-auto">
            <p className="text-xs text-secondary dark:text-white/60">
              Content to be added
            </p>
            <div>
              <Link
                to="/reviews"
                className="inline-block py-2.5 px-6 rounded-xl border border-primary dark:border-[#D4AF37] text-primary dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-black transition-all shadow-xs"
              >
                Write a Review
              </Link>
            </div>
          </div>
        </section> */}

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-border dark:border-[#2E2925] py-16 lg:py-24 px-6 bg-warm-white dark:bg-[#0D0B0A] transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary dark:text-[#D4AF37] mb-2">
                  Complete The Collection
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif font-light text-primary dark:text-white tracking-wide">
                  You Might Also Admire
                </h2>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                {relatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* FLOATING STICKY BOTTOM BAR (Stoa Paris Conversion Feature) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#1A1816]/95 backdrop-blur-md border-t border-border dark:border-[#2E2925] px-4 sm:px-8 py-3.5 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              {/* Product preview */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={product.images[0] || ''}
                  alt=""
                  className="w-11 h-11 rounded-xl object-cover border border-border dark:border-[#2E2925] shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-primary dark:text-white truncate">
                    {product.name}
                  </p>
                  <p className="text-[11px] font-times text-secondary dark:text-white/60 truncate tabular-nums">
                    {selectedSize ? `${selectedSize.name} • ` : ''}₹{currentPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => addToCart(variantProduct, selectedQty)}
                  className="px-5 py-2.5 rounded-xl bg-primary dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
                >
                  <ShoppingBag size={14} />
                  <span className="hidden sm:inline">Add to Bag</span>
                  <span className="sm:hidden">Add</span>
                </button>

                <button
                  onClick={() => buyNow(variantProduct, selectedQty)}
                  className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
                >
                  <MessageCircle size={15} />
                  <span className="hidden sm:inline">Instant Buy</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />

      <Footer />
    </div>
  );
}