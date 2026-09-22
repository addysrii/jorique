import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Mail,
  MessageSquare,
  ArrowRight,
  Phone,
  Check,
  ShieldCheck,
  Sparkles,
  Award,
  Layers,
  FileCheck,
  Bed,
  Bath,
  Palette,
  Clock,
  ChevronRight,
  CheckCircle2,
  Sliders,
  Feather,
  PackageCheck,
  Eye,
  RefreshCw,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// Business Type Options
const BUSINESS_TYPES = [
  'Luxury Resort & Spa',
  'Boutique Design Hotel',
  'Heritage Palace / Haveli',
  'Private Villa Estate',
  'Superyacht / Aviation',
  'Healthcare & Institutional',
];

// Curated Property Packages
const PROPERTY_PACKAGES = [
  {
    id: 'boutique',
    name: 'Boutique & Villa Tier',
    scale: '10 – 35 Keys',
    highlight: 'Curated Sensory Intimacy',
    desc: 'Bespoke small-batch linens with custom hand-embroidered monograms, tailored flange drops, and ultra-plush 700 GSM bath sheets.',
    recommendedQty: '50 – 150 room sets',
    collections: ['Bed Linen', 'Bath & Wellness', 'Room Textiles'],
  },
  {
    id: 'resort',
    name: 'Luxury Resort & Spa',
    scale: '35 – 120 Keys',
    highlight: 'Optimal Turnover Durability',
    desc: 'Single-pick 400 TC percale and 600 TC sateen engineered for relentless commercial laundering, paired with zero-twist spa terry.',
    recommendedQty: '150 – 450 room sets',
    collections: ['Bed Linen', 'Bath & Wellness', 'Bedding & Down'],
  },
  {
    id: 'flagship',
    name: 'Grand Flagship Contract',
    scale: '120+ Keys',
    highlight: 'Enterprise Staged Logistics',
    desc: 'High-volume production with guaranteed dye-lot matching across quarters, dedicated account manager, and reserved safety replenishment stocks.',
    recommendedQty: '500+ contract sets',
    collections: ['Bed Linen', 'Bath & Wellness', 'Room Textiles', 'Bedding & Down'],
  },
];

// Product Collections tailored for Contract Procurement
const PRODUCT_COLLECTIONS = [
  {
    id: 'bed-linen',
    title: 'The Presidential Bed Sanctuary',
    subtitle: 'Suite Bedding Systems',
    tag: '300 – 1000 Thread Count',
    image: '/images/hospitality/bed-linen.jpg',
    items: 'Duvet Covers · Fitted Sheets · Flat Sheets · Oxford Pillowcases · Bolster Encasements',
    summary:
      'Woven from extra-long staple combed cotton yarns. Engineered with reinforced mitered corners and double-needle hems to deliver a crisp, inviting bedscape night after night.',
    tactileFeel: 'Crisp & Breathable or Liquid & Silky',
    weaveOptions: ['400 TC Single-Pick Hotel Percale', '600 TC Liquid Sateen', '800 TC Imperial Cotton'],
    specs: [
      { label: 'Yarn Architecture', value: '100% GOTS-certified combed long-staple cotton' },
      { label: 'Wash Longevity', value: 'Tested for 200+ high-temp commercial laundry cycles' },
      { label: 'Dimensional Stability', value: 'Sanforized preshrunk (< 2.5% shrinkage tolerance)' },
      { label: 'Finishing Craft', value: 'Deep 40cm mattress pockets, 7cm Oxford flanges' },
    ],
  },
  {
    id: 'bath-linen',
    title: 'The Bath & Thermal Spa Suite',
    subtitle: 'Terry, Bathrobes & Wellness',
    tag: '550 – 750 GSM Heavyweight Terry',
    image: '/images/hospitality/bath-linen.jpg',
    items: 'Bath Sheets · Hand Towels · Washcloths · Velour Kimono Robes · Ribbed Bath Mats',
    summary:
      'Ultra-absorbent combed ring-spun cotton terry crafted with zero-twist fibers. Rapid drying, cloud-soft upon guest contact, and constructed with snag-proof lock-stitched edges.',
    tactileFeel: 'Ultra-Dense & Cloud-Like Absorbency',
    weaveOptions: ['600 GSM Combed Ring-Spun', '700 GSM Zero-Twist Spa Terry', '450 GSM Waffle Weave'],
    specs: [
      { label: 'Absorption Rate', value: 'Instant capillary absorption (< 2.8 seconds)' },
      { label: 'Edge Architecture', value: 'Continuous dobby border with reinforced lockstitch selvages' },
      { label: 'Dye Quality', value: 'Chlorine-resistant indanthrene vat dye fastness' },
      { label: 'Robes & Accessories', value: 'Plush shawl collar, double belt loops, hidden seams' },
    ],
  },
  {
    id: 'room-textiles',
    title: 'Architectural Room Accents',
    subtitle: 'Interior Textures & Styling',
    tag: 'Martindale Rubs > 35,000',
    image: '/images/hospitality/room-textiles.jpg',
    items: 'Bed Runners · Accent Cushion Covers · Textured Throws · Tailored Drapes',
    summary:
      'The tactile soul of the guest room. Heavyweight natural linen blends, slub textural weaves, and jacquard accents crafted to withstand commercial wear while framing interior harmony.',
    tactileFeel: 'Textural, Organic & Earthy',
    weaveOptions: ['Belgian Flax Linen Blend', 'Textured Cotton Bouclé', 'Custom Jacquard Damask'],
    specs: [
      { label: 'Abrasion Resistance', value: 'Martindale test rated for > 35,000 commercial cycles' },
      { label: 'Stain Repellency', value: 'Nanotechnology fluid-barrier finish available on request' },
      { label: 'Flame Safety', value: 'Complies with BS 5852 / NFPA 701 FR requirements' },
      { label: 'Color Matching', value: 'Custom Pantone / PMS dyeing to match architect palettes' },
    ],
  },
  {
    id: 'bedding-sleep',
    title: 'The Ergonomic Sleep Architecture',
    subtitle: 'Duvets, Pillows & Encasements',
    tag: 'Hypoallergenic Comfort Core',
    image: '/images/hospitality/bedding-sleep.jpg',
    items: 'Microfiber Duvet Inserts · Virgin Down Alternatives · Gusseted Pillows · Mattress Toppers',
    summary:
      'Engineered with baffle-box compartmentalization to ensure consistent thermal distribution without clumping, maintaining restorative comfort through relentless room turnovers.',
    tactileFeel: 'Weightless, Floating Support',
    weaveOptions: ['Micro-Denier Gel Fiber (Down Alternative)', 'Hungarian White Goose Down', 'Silk-Blend Fill'],
    specs: [
      { label: 'Casing Shell', value: '300 TC 100% cotton cambric down-proof shell' },
      { label: 'Baffle Construction', value: 'Square box-quilted with inner baffle walls (no cold spots)' },
      { label: 'Sanitary Standard', value: 'Anti-microbial & dust-mite barrier encasement' },
      { label: 'Loft Memory', value: 'High resilience fiber maintains 95% loft after laundering' },
    ],
  },
];

// Bespoke Monogramming & Finishes Studio Options
const PALETTES = [
  { name: 'Chalk White', hex: '#FFFFFF', border: '#E8DFD3' },
  { name: 'Warm Ivory', hex: '#F5EDE3', border: '#D9C8B2' },
  { name: 'Oat Sand', hex: '#E2D5C3', border: '#C6B59E' },
  { name: 'Mineral Slate', hex: '#4B5563', border: '#374151' },
  { name: 'Deep Cypress', hex: '#0B5F61', border: '#084849' },
  { name: 'Imperial Black', hex: '#1A1A1A', border: '#332922' },
];

const MONOGRAM_STYLES = [
  'Custom Satin-Stitch Crest',
  'Tone-on-Tone Jacquard Weave',
  'Mitered Flange Piping',
  'Subtle Cordonnet Hemstitch',
  'Laser Cut Metal Seal Tag',
];

// Institutional Quality Pillars
const CONTRACT_PILLARS = [
  {
    icon: ShieldCheck,
    title: '200+ Commercial Wash Endurance',
    desc: 'High-tensile combed yarns are singed and mercerized to withstand 200+ continuous industrial wash cycles without surface fiber fuzzing, seam slippage, or graying.',
  },
  {
    icon: Award,
    title: 'Bespoke Crest & Monogramming',
    desc: 'Precision computerized embroidery, custom tone-on-tone jacquard weaving, and dyed-to-order borders calibrated to your property’s interior design handbook.',
  },
  {
    icon: RefreshCw,
    title: 'Guaranteed Dye-Lot Consistency',
    desc: 'Spectrophotometer digital color calibration ensures that replenishment orders placed months or years apart match your property’s active inventory seamlessly.',
  },
  {
    icon: PackageCheck,
    title: 'Dedicated Trade Concierge & Dossier',
    desc: 'A dedicated trade specialist manages your physical swatch dossier, arranges pilot room sampling on your actual mattresses, and oversees staged delivery.',
  },
];

// Property Sectors Served
const SECTORS = [
  'Heritage Palaces & Havelis',
  'Luxury Island & Safari Resorts',
  'Boutique Design Hotels',
  'Thermal Wellness Retreats',
  'Private Yacht & Aviation Fleets',
  'Presidential Diplomatic Suites',
];

export default function Hospitality() {
  const propertyInputId = useId();
  const cityInputId = useId();
  const stateInputId = useId();
  const quantityInputId = useId();
  const specInputId = useId();
  const dateInputId = useId();
  const nameInputId = useId();
  const phoneInputId = useId();
  const emailInputId = useId();
  const notesInputId = useId();
  const consentInputId = useId();

  // Active Collection Tab State
  const [activeCollectionTab, setActiveCollectionTab] = useState(0);

  // Interactive Bespoke Studio State
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0].name);
  const [selectedMonogram, setSelectedMonogram] = useState(MONOGRAM_STYLES[0]);
  const [selectedWeave, setSelectedWeave] = useState('400 TC Single-Pick Hotel Percale');

  // Form State
  const [formData, setFormData] = useState({
    businessType: 'Luxury Resort & Spa',
    propertyName: '',
    city: '',
    state: '',
    productsRequired: ['Bed Linen', 'Bath & Wellness'] as string[],
    estimatedQuantity: '150 – 450 room sets',
    specifications: '400 TC Hotel Percale in Chalk White with custom crest embroidery',
    customizations: ['Custom Satin-Stitch Crest', 'Complimentary Swatch Dossier Required'] as string[],
    requiredBy: '',
    name: '',
    phone: '',
    email: '',
    additionalNotes: '',
    consent: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toggleProduct = (prod: string) => {
    setFormData((prev) => {
      const exists = prev.productsRequired.includes(prod);
      return {
        ...prev,
        productsRequired: exists
          ? prev.productsRequired.filter((p) => p !== prod)
          : [...prev.productsRequired, prod],
      };
    });
    if (errors.productsRequired) {
      setErrors((p) => ({ ...p, productsRequired: '' }));
    }
  };

  const toggleCustomization = (cust: string) => {
    setFormData((prev) => {
      const exists = prev.customizations.includes(cust);
      return {
        ...prev,
        customizations: exists
          ? prev.customizations.filter((c) => c !== cust)
          : [...prev.customizations, cust],
      };
    });
  };

  const handleSelectPackage = (pkg: typeof PROPERTY_PACKAGES[0]) => {
    setFormData((prev) => ({
      ...prev,
      estimatedQuantity: pkg.recommendedQty,
      productsRequired: pkg.collections,
    }));
    const formElem = document.getElementById('trade-portal');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddStudioSpec = () => {
    setFormData((prev) => {
      const specString = `Weave: ${selectedWeave} | Palette: ${selectedPalette} | Monogram: ${selectedMonogram}`;
      const updatedSpecs = prev.specifications
        ? `${prev.specifications}\n${specString}`
        : specString;
      const updatedCustom = prev.customizations.includes(selectedMonogram)
        ? prev.customizations
        : [...prev.customizations, selectedMonogram];

      return {
        ...prev,
        specifications: updatedSpecs,
        customizations: updatedCustom,
      };
    });

    const formElem = document.getElementById('trade-portal');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.propertyName.trim()) {
      newErrors.propertyName = 'Property or organization name is required.';
    }
    if (!formData.city.trim() || !formData.state.trim()) {
      newErrors.location = 'Please provide both city and state/country.';
    }
    if (formData.productsRequired.length === 0) {
      newErrors.productsRequired = 'Please select at least one textile collection.';
    }
    if (!formData.estimatedQuantity.trim()) {
      newErrors.estimatedQuantity = 'Please specify your estimated quantity or room count.';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Contact officer name is required.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      newErrors.phone = 'Valid direct phone / WhatsApp number is required.';
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Valid corporate or business email is required.';
    }
    if (!formData.consent) {
      newErrors.consent = 'Please confirm consent to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getEmailSubject = () => {
    const bName = formData.propertyName.trim() || 'Contract Procurement';
    const loc = formData.city.trim() || 'Direct Enquiry';
    return `JORIQUE Hospitality Trade Proposal — ${bName} (${loc})`;
  };

  const getEmailBody = () => {
    const loc = [formData.city.trim(), formData.state.trim()].filter(Boolean).join(', ') || 'Direct';
    const products = formData.productsRequired.join(', ') || 'Contract Linen Suites';
    const custom = formData.customizations.join(', ') || 'Standard luxury hospitality standards';

    return `Dear JORIQUE Trade Atelier Concierge,

I am requesting a formal commercial trade proposal and tactile fabric dossier for our property.

PROJECT PROFILE:
• Classification: ${formData.businessType}
• Property Name: ${formData.propertyName || 'N/A'}
• Location: ${loc}

CONTRACT SPECIFICATIONS:
• Collections Required: ${products}
• Estimated Room / Unit Volume: ${formData.estimatedQuantity || 'To be discussed'}
• Quality & Specification Notes: ${formData.specifications || 'Standard luxury hospitality standards'}
• Custom Monogramming & Finishing: ${custom}
• Target Installation / Delivery: ${formData.requiredBy || 'Flexible'}
• Additional Logistics / Project Scope: ${formData.additionalNotes || 'None'}

DIRECT PROCUREMENT CONTACT:
• Contact Officer: ${formData.name || 'N/A'}
• Telephone / WhatsApp: ${formData.phone || 'N/A'}
• Corporate Email: ${formData.email || 'N/A'}

Please transmit your trade pricing catalogue, fabric swatch dossier, and custom quotation.

With warm regards,
${formData.name || 'Procurement Partner'}`;
  };

  const getWhatsAppBody = () => {
    const loc = [formData.city.trim(), formData.state.trim()].filter(Boolean).join(', ') || 'Direct';
    const products = formData.productsRequired.join(', ') || 'All Collections';

    return `Hello JORIQUE Trade Concierge,

I would like to request a trade quotation and swatch dossier for *${formData.propertyName || 'our property'}*.

• Property: ${formData.propertyName || 'N/A'} (${formData.businessType})
• Location: ${loc}
• Collections: ${products}
• Volume: ${formData.estimatedQuantity || 'To be discussed'}
${formData.specifications ? `• Specifications: ${formData.specifications}\n` : ''}• Target Date: ${formData.requiredBy || 'Flexible'}

Contact: ${formData.name} (${formData.phone} | ${formData.email})

Please share suitable specifications, lead times, and contract pricing. Thank you.`;
  };

  const handleOpenWhatsApp = () => {
    if (!validateForm()) return;
    const text = encodeURIComponent(getWhatsAppBody());
    window.open(`https://wa.me/919919388211?text=${text}`, '_blank');
  };

  const handleOpenEmail = () => {
    if (!validateForm()) return;
    const subject = encodeURIComponent(getEmailSubject());
    const body = encodeURIComponent(getEmailBody());
    window.location.href = `mailto:care@jorique.in?subject=${subject}&body=${body}`;
  };

  const activeCol = PRODUCT_COLLECTIONS[activeCollectionTab];

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#100E0D] text-[#1A1A1A] dark:text-[#FCFAF7] transition-colors duration-500 font-sans selection:bg-[#C6A96B]/30">
      {/* SEO METADATA */}
      <SEO
        title="JORIQUE Hospitality | Contract Hotel Linen & Institutional Textiles"
        description="Curated luxury hotel linens, 300 to 1000 TC Egyptian & combed organic cotton bedsheets, 700 GSM plush spa towels, and bespoke monogramming for world-class resorts and heritage palaces."
        keywords="luxury hotel linen, contract textiles, hotel bedsheets bulk, commercial bath towels, resort bedding supplier, luxury hotel duvet covers, bespoke hotel embroidery, institutional linens India"
        canonical="https://jorique.in/hospitality"
        image="https://jorique.in/images/jorique-hospitality.jpg"
      />

      <Navbar />

      {/* ─────────────────────────────────────────────────────────────
          HERO: Cinematic Architectural Atmosphere
      ───────────────────────────────────────────────────────────── */}
      <header className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden border-b border-[#E8DFD3] dark:border-[#2E261F] bg-[#F5EDE3] dark:bg-[#14100D]">
        {/* Soft Ambient Radiance */}
        <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-radial from-[#C6A96B]/15 via-[#C6A96B]/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-[500px] h-[500px] bg-radial from-[#0B5F61]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10 space-y-12">
          
          {/* Top Label & Headline */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
            
            {/* Left Narrative Column */}
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#C6A96B]/40 text-[#855331] dark:text-[#D4AF37] text-[11px] font-semibold tracking-[0.25em] uppercase shadow-xs">
                <Building2 size={13} className="text-[#C6A96B]" />
                <span>The Hospitality Atelier</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1A1A1A] dark:text-[#FCFAF7] tracking-tight leading-[1.05]">
                  Designed for the Spaces People Remember.
                </h1>
                <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-[#855331] dark:text-[#C6A96B] font-light">
                  Tactile luxury engineered for commercial endurance.
                </p>
              </div>

              <p className="max-w-xl text-[#6B6359] dark:text-[#C4B9A8] text-base sm:text-lg font-light leading-relaxed">
                From presidential suites and heritage havelis to island resort sanctuaries, JORIQUE collaborates directly with luxury hoteliers and interior architects to engineer bespoke contract linens calibrated for sensory indulgence and high-turnover longevity.
              </p>

              {/* Instant Assurance Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {[
                  { label: '300–1000 TC', desc: 'Combed extra-long staple' },
                  { label: '200+ Wash Cycles', desc: 'Commercial endurance rating' },
                  { label: 'Bespoke Crest', desc: 'Swiss satin-stitch & PMS dye' },
                  { label: 'Trade Concierge', desc: 'Physical dossiers & sampling' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] backdrop-blur-xs shadow-2xs"
                  >
                    <span className="block font-serif text-base sm:text-lg font-semibold text-[#1A1A1A] dark:text-white">
                      {stat.label}
                    </span>
                    <span className="block text-[11px] text-[#786E65] dark:text-white/60 font-light mt-0.5">
                      {stat.desc}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a
                  href="#trade-portal"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#1A1A1A] hover:bg-[#0B5F61] dark:bg-[#C6A96B] dark:hover:bg-[#D4B87A] text-white dark:text-black text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Request Trade Proposal</span>
                  <ArrowRight size={14} />
                </a>

                <a
                  href="#bespoke-studio"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-white/60 dark:bg-white/5 hover:border-[#C6A96B] text-[#1A1A1A] dark:text-white text-xs font-semibold tracking-wider transition-all"
                >
                  <Sliders size={14} className="text-[#855331] dark:text-[#C6A96B]" />
                  <span>Explore Bespoke Studio</span>
                </a>
              </div>
            </div>

            {/* Right Architectural Suite Photography */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#E8DFD3] dark:border-[#332922] shadow-2xl group bg-black/10">
                <img
                  src="/images/jorique-hospitality.jpg"
                  alt="JORIQUE Hospitality Luxury Resort Presidential Suite"
                  className="w-full h-[420px] sm:h-[520px] lg:h-[580px] object-cover object-center group-hover:scale-103 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
                
                {/* Floating Architectural Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] dark:text-[#C6A96B] font-bold shadow-lg">
                  Contract Grade · ISO 9001
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] uppercase text-[#C6A96B]">
                    <Sparkles size={12} />
                    <span>The Presidential Standard</span>
                  </div>
                  <p className="font-serif text-xl sm:text-2xl font-medium leading-snug">
                    Tactile architecture calibrated to leave an indelible sensory memory.
                  </p>
                  <p className="text-xs text-white/70 font-light">
                    Single-pick combed percale and liquid sateen suites engineered for ultra-luxury hospitality.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          SECTORS & DESTINATIONS SERVED (Subtle Architectural Ticker)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-7 bg-white/60 dark:bg-[#15110E] border-b border-[#E8DFD3] dark:border-[#2E261F]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#855331] dark:text-[#C6A96B] font-bold shrink-0">
              Curating Sanctuaries For
            </span>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-[#5C554F] dark:text-white/80">
              {SECTORS.map((sector) => (
                <span
                  key={sector}
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] font-medium transition-all hover:border-[#C6A96B]"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE CONTRACT COLLECTIONS ATELIER (Lookbook Experience)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-5 sm:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#855331] dark:text-[#C6A96B] font-bold block">
            The Contract Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
            Curated tactile suites for high-turnover luxury.
          </h2>
          <p className="text-sm sm:text-base text-[#6B6359] dark:text-white/70 font-light leading-relaxed">
            Every fiber is calibrated to deliver the effortless elegance of private estate living with the industrial resilience required by world-class operations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-[#E8DFD3] dark:border-[#332922] pb-4">
          {PRODUCT_COLLECTIONS.map((col, index) => {
            const isActive = activeCollectionTab === index;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setActiveCollectionTab(index)}
                className={`px-5 py-3 rounded-2xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white dark:bg-[#C6A96B] dark:text-black shadow-md'
                    : 'bg-white/60 dark:bg-white/5 text-[#5C554F] dark:text-white/70 border border-[#E8DFD3] dark:border-[#332922] hover:border-[#C6A96B]'
                }`}
              >
                <span>{col.title.split(' ')[1]}</span>
                <span className="text-[10px] opacity-70 font-mono tracking-widest hidden sm:inline">
                  {col.tag.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Collection Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center bg-white dark:bg-[#181412] p-6 sm:p-12 rounded-3xl border border-[#E8DFD3] dark:border-[#332922] shadow-xl">
          
          {/* Visual Showcase */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E8DFD3] dark:border-[#332922] shadow-lg group">
            <img
              src={activeCol.image}
              alt={activeCol.title}
              className="w-full h-80 sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-mono tracking-wider text-[#855331] dark:text-[#C6A96B] uppercase font-bold border border-white/20">
              {activeCol.tag}
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C6A96B]">
                Tactile Profile
              </span>
              <p className="font-serif text-xl sm:text-2xl font-medium">
                {activeCol.tactileFeel}
              </p>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#855331] dark:text-[#C6A96B]">
                <span>{activeCol.subtitle}</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1A1A] dark:text-white">
                {activeCol.title}
              </h3>
              <p className="text-xs font-semibold text-[#855331] dark:text-[#C6A96B] uppercase tracking-wider">
                {activeCol.items}
              </p>
              <p className="text-sm text-[#6B6359] dark:text-white/70 font-light leading-relaxed pt-1">
                {activeCol.summary}
              </p>
            </div>

            {/* Weave Selections */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#1A1A1A] dark:text-white font-bold block">
                Available Weaves & Density Formulations
              </span>
              <div className="flex flex-wrap gap-2">
                {activeCol.weaveOptions.map((weave, wIdx) => (
                  <span
                    key={wIdx}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] text-xs font-medium text-[#1A1A1A] dark:text-white/90"
                  >
                    {weave}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="pt-3 border-t border-[#E8DFD3] dark:border-[#332922] space-y-2.5">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#855331] dark:text-[#C6A96B] font-bold block">
                Technical Contract Standards
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {activeCol.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922]">
                    <span className="text-[#8A847D] dark:text-white/50 block text-[10px] uppercase font-mono">
                      {spec.label}
                    </span>
                    <span className="text-[#1A1A1A] dark:text-white font-medium block mt-0.5">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  toggleProduct(activeCol.title.split(' ')[1] + ' Linen');
                  const formElem = document.getElementById('trade-portal');
                  if (formElem) formElem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#0B5F61] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
              >
                <span>Add To Trade Inquiry</span>
                <ArrowRight size={13} />
              </button>
              <span className="text-[11px] font-mono text-[#8A847D] dark:text-white/50">
                Direct Mill Quotations
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE BESPOKE ATELIER & MONOGRAMMING STUDIO
      ───────────────────────────────────────────────────────────── */}
      <section
        id="bespoke-studio"
        className="py-20 lg:py-28 px-5 sm:px-8 bg-[#F5EDE3] dark:bg-[#14100D] border-y border-[#E8DFD3] dark:border-[#2E261F] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#855331] dark:text-[#C6A96B] font-bold block">
              Bespoke Identity Studio
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
              Tailored to your interior architect’s narrative.
            </h2>
            <p className="text-sm sm:text-base text-[#6B6359] dark:text-white/70 font-light leading-relaxed">
              Every luxury property carries a distinct architectural voice. Test our bespoke palette matching, crest monogramming, and weave constructions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
            
            {/* Interactive Studio Controls */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#181412] border border-[#E8DFD3] dark:border-[#332922] shadow-xl space-y-8">
              
              {/* 1. Weave Selection */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider font-bold text-[#1A1A1A] dark:text-white block">
                  1. Fabric Weave & Hand-Feel
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { title: '400 TC Hotel Percale', desc: 'Cooling, crisp matte finish with breathable density' },
                    { title: '600 TC Liquid Sateen', desc: 'Silky, luminous drape with heavy tactile luxury' },
                  ].map((weave) => {
                    const isSelected = selectedWeave === weave.title;
                    return (
                      <button
                        key={weave.title}
                        type="button"
                        onClick={() => setSelectedWeave(weave.title)}
                        className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-white dark:bg-[#C6A96B] dark:text-black border-transparent shadow-xs'
                            : 'bg-[#FAF7F2] dark:bg-white/5 border-[#E8DFD3] dark:border-[#332922] text-[#5C554F] dark:text-white/75 hover:border-[#C6A96B]'
                        }`}
                      >
                        <span className="font-serif text-base font-semibold block">{weave.title}</span>
                        <span className="text-[11px] opacity-80 block mt-1">{weave.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Color Palette Selector */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider font-bold text-[#1A1A1A] dark:text-white flex items-center justify-between">
                  <span>2. Property Color Palette</span>
                  <span className="text-[11px] font-normal text-[#8A847D] dark:text-white/50">{selectedPalette}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {PALETTES.map((palette) => {
                    const isSelected = selectedPalette === palette.name;
                    return (
                      <button
                        key={palette.name}
                        type="button"
                        onClick={() => setSelectedPalette(palette.name)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-white dark:bg-[#C6A96B] dark:text-black border-transparent shadow-xs'
                            : 'bg-[#FAF7F2] dark:bg-white/5 border-[#E8DFD3] dark:border-[#332922] text-[#5C554F] dark:text-white/80 hover:border-[#C6A96B]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border shadow-2xs"
                          style={{ backgroundColor: palette.hex, borderColor: palette.border }}
                        />
                        <span>{palette.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Monogram & Emblem Finishing */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider font-bold text-[#1A1A1A] dark:text-white block">
                  3. Crest & Monogram Detailing
                </label>
                <div className="flex flex-wrap gap-2">
                  {MONOGRAM_STYLES.map((mono) => {
                    const isSelected = selectedMonogram === mono;
                    return (
                      <button
                        key={mono}
                        type="button"
                        onClick={() => setSelectedMonogram(mono)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#855331] text-white dark:bg-[#C6A96B] dark:text-black font-semibold border-transparent shadow-2xs'
                            : 'bg-[#FAF7F2] dark:bg-white/5 border-[#E8DFD3] dark:border-[#332922] text-[#5C554F] dark:text-white/80 hover:border-[#C6A96B]'
                        }`}
                      >
                        {isSelected ? `✓ ${mono}` : mono}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Studio Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-[#E8DFD3] dark:border-[#332922]">
                <button
                  type="button"
                  onClick={handleAddStudioSpec}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#855331] hover:bg-[#6F4324] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  <span>Attach Configuration To RFP</span>
                </button>
                <span className="text-[11px] font-mono text-[#8A847D] dark:text-white/50 text-center sm:text-right">
                  Complimentary Swatches Dispatched
                </span>
              </div>

            </div>

            {/* Visual Lookbook Dossier Preview */}
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden border border-[#E8DFD3] dark:border-[#332922] shadow-2xl group">
                <img
                  src="/images/hospitality/hospitality-spec-runner.jpg"
                  alt="JORIQUE Hospitality Architectural Textile Finishing"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-mono tracking-widest uppercase">
                    <span>Active Specification Dossier</span>
                  </div>
                  <h4 className="font-serif text-2xl font-normal leading-tight">
                    {selectedWeave}
                  </h4>
                  <p className="text-xs text-white/80 font-light">
                    Dyed in {selectedPalette} with {selectedMonogram} tailored for your suite architecture.
                  </p>
                </div>
              </div>

              {/* Sample Swatch Folder Assurance */}
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A] dark:text-white">
                  <PackageCheck size={16} className="text-[#855331] dark:text-[#C6A96B]" />
                  <span>Physical Sample Dossier Included</span>
                </div>
                <p className="text-xs text-[#6B6359] dark:text-white/70 font-light leading-relaxed">
                  Qualified procurement officers and interior architects receive a boxed fabric binder featuring physical percale, sateen, terry swatches, and wash endurance reports.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CURATED PROCUREMENT TIERS (Quick Configuration)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-5 sm:px-8 max-w-7xl mx-auto space-y-16">
        
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#855331] dark:text-[#C6A96B] font-bold block">
            Scale & Scope Programs
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
            Engineered around your operational scale.
          </h2>
          <p className="text-sm sm:text-base text-[#6B6359] dark:text-white/70 font-light leading-relaxed">
            Whether launching an intimate 15-key boutique lodge or outfitting a 250-room flagship resort, our supply contracts are structured to safeguard continuity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROPERTY_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="p-8 rounded-3xl bg-white dark:bg-[#181412] border border-[#E8DFD3] dark:border-[#332922] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-8 group"
            >
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-[#855331] dark:text-[#C6A96B] font-bold">
                    {pkg.scale}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF7F2] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] text-[10px] font-semibold text-[#1A1A1A] dark:text-white">
                    {pkg.recommendedQty}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A1A] dark:text-white">
                  {pkg.name}
                </h3>

                <p className="text-xs font-semibold text-[#855331] dark:text-[#C6A96B] uppercase tracking-wider">
                  {pkg.highlight}
                </p>

                <p className="text-xs sm:text-sm text-[#6B6359] dark:text-white/70 font-light leading-relaxed">
                  {pkg.desc}
                </p>

                <div className="pt-2 border-t border-[#E8DFD3] dark:border-[#332922] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#8A847D] dark:text-white/50 block">
                    Core Suite Coverage
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.collections.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-[#FAF7F2] dark:bg-white/5 text-[11px] text-[#1A1A1A] dark:text-white/80">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleSelectPackage(pkg)}
                  className="w-full py-3.5 px-4 rounded-xl border border-[#1A1A1A] dark:border-[#C6A96B] text-[#1A1A1A] dark:text-white hover:bg-[#1A1A1A] hover:text-white dark:hover:bg-[#C6A96B] dark:hover:text-black font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer text-center"
                >
                  Configure This Tier
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          INSTITUTIONAL PERFORMANCE & QUALITY PILLARS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-5 sm:px-8 bg-[#F5EDE3] dark:bg-[#14100D] border-t border-[#E8DFD3] dark:border-[#2E261F]">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#855331] dark:text-[#C6A96B] font-bold block">
              Contract Quality Matrix
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] dark:text-white tracking-tight leading-tight">
              Tested for commercial laundry longevity.
            </h2>
            <p className="text-sm sm:text-base text-[#6B6359] dark:text-white/70 font-light leading-relaxed">
              Industrial calenders, chemical sanitation, and heavy wash tumbling degrade standard retail linens within months. JORIQUE textiles are engineered differently.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTRACT_PILLARS.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div
                  key={idx}
                  className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#1C1613] border border-[#E8DFD3] dark:border-[#332922] space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8DFD3] dark:border-white/10 flex items-center justify-center text-[#855331] dark:text-[#C6A96B]">
                      <IconComp size={22} />
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1A1A1A] dark:text-white leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B6359] dark:text-white/70 font-light leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E8DFD3] dark:border-[#332922] flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#0B5F61] dark:text-[#C6A96B]">
                    <CheckCircle2 size={12} />
                    <span>Contract Standard</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Testimonial / Client Proof Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#181412] border border-[#E8DFD3] dark:border-[#332922] shadow-md grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#855331] dark:text-[#C6A96B] font-bold block">
                Trade Partner Endorsement
              </span>
              <p className="font-serif italic text-lg sm:text-2xl text-[#1A1A1A] dark:text-white/90 leading-relaxed font-light">
                “JORIQUE contract linens delivered a remarkable transformation in our suite touchpoints. After 14 months of relentless commercial laundering, the 400 TC percale retains its cool, matte crispness without any fiber fuzzing or seam twisting.”
              </p>
              <p className="text-xs font-mono uppercase tracking-wider text-[#8A847D] dark:text-white/60">
                — General Manager, Boutique Heritage Palace & Luxury Spa
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] space-y-2">
              <span className="text-xs font-semibold text-[#1A1A1A] dark:text-white block">
                Standard Supply Guarantee
              </span>
              <p className="text-xs text-[#6B6359] dark:text-white/70 font-light leading-relaxed">
                All JORIQUE contract orders include certified wash endurance reports, dye-lot archive cards, and dedicated account manager oversight.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TRADE PROCUREMENT PORTAL (Refined Executive RFP)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="trade-portal"
        className="py-20 lg:py-28 px-5 sm:px-8 max-w-5xl mx-auto space-y-12 scroll-mt-20"
      >
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#855331] dark:text-[#C6A96B] font-bold block">
            Commercial Procurement
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] dark:text-white tracking-tight">
            Initiate a Trade Consultation.
          </h2>
          <p className="text-sm sm:text-base text-[#6B6359] dark:text-white/70 font-light">
            Share your property scope and volume requirements. Our trade concierge will prepare custom specifications, sample swatch dossiers, and contract wholesale pricing.
          </p>
        </div>

        {/* Structured Luxury Form */}
        <div className="bg-white dark:bg-[#181412] p-6 sm:p-12 rounded-3xl border border-[#E8DFD3] dark:border-[#332922] shadow-xl space-y-10">

          {/* Section A: Property Profile */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-[#E8DFD3] dark:border-[#332922]">
              <Building2 size={16} className="text-[#855331] dark:text-[#C6A96B]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#1A1A1A] dark:text-white">
                Property & Project Profile
              </span>
            </div>

            {/* Business Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center justify-between">
                <span>Property Classification</span>
                <span className="text-[11px] font-normal text-[#8A847D] dark:text-white/50">Select best match</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BUSINESS_TYPES.map((type) => {
                  const isSelected = formData.businessType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, businessType: type }))}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer flex items-center justify-between border ${
                        isSelected
                          ? 'bg-[#1A1A1A] text-white dark:bg-[#C6A96B] dark:text-black border-transparent shadow-xs font-semibold'
                          : 'bg-[#FAF7F2] dark:bg-white/5 text-[#5C554F] dark:text-white/75 border-[#E8DFD3] dark:border-[#332922] hover:border-[#C6A96B]'
                      }`}
                    >
                      <span className="truncate">{type}</span>
                      {isSelected && <Check size={12} className="shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Property Name & City/State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor={propertyInputId} className="text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center gap-1">
                  <span>Property / Business Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  id={propertyInputId}
                  type="text"
                  placeholder="e.g. Amanbagh Palace or The Oberoi Udaivilas"
                  value={formData.propertyName}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, propertyName: e.target.value }));
                    if (errors.propertyName) setErrors((prev) => ({ ...prev, propertyName: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none transition-all ${
                    errors.propertyName
                      ? 'border-rose-500'
                      : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#C6A96B]'
                  }`}
                />
                {errors.propertyName && <p className="text-xs text-rose-500">{errors.propertyName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center gap-1">
                  <span>Location (City · State / Region)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    id={cityInputId}
                    type="text"
                    placeholder="City (e.g. Udaipur)"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, city: e.target.value }));
                      if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                    }}
                    className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none transition-all ${
                      errors.location
                        ? 'border-rose-500'
                        : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#C6A96B]'
                    }`}
                  />
                  <input
                    id={stateInputId}
                    type="text"
                    placeholder="State (e.g. Rajasthan)"
                    value={formData.state}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, state: e.target.value }));
                      if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                    }}
                    className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none transition-all ${
                      errors.location
                        ? 'border-rose-500'
                        : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#C6A96B]'
                    }`}
                  />
                </div>
                {errors.location && <p className="text-xs text-rose-500">{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* Section B: Textile Scope & Specifications */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-[#E8DFD3] dark:border-[#332922]">
              <Layers size={16} className="text-[#855331] dark:text-[#C6A96B]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#1A1A1A] dark:text-white">
                Textile Scope & Requirements
              </span>
            </div>

            {/* Products Multi-Select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center justify-between">
                <span className="flex items-center gap-1">
                  Collections Required <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-[#8A847D] dark:text-white/50">Multi-select applicable</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['Bed Linen', 'Bath & Wellness', 'Room Textiles', 'Bedding & Down'].map((prod) => {
                  const isSelected = formData.productsRequired.includes(prod);
                  return (
                    <button
                      key={prod}
                      type="button"
                      onClick={() => toggleProduct(prod)}
                      className={`p-3.5 rounded-xl text-xs font-medium text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#1A1A1A] text-white dark:bg-[#C6A96B] dark:text-black font-semibold border-transparent shadow-xs'
                          : 'bg-[#FAF7F2] dark:bg-white/5 border-[#E8DFD3] dark:border-[#332922] text-[#5C554F] dark:text-white/80 hover:border-[#C6A96B]'
                      }`}
                    >
                      <span>{prod}</span>
                      {isSelected ? (
                        <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">Selected</span>
                      ) : (
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#8A847D] dark:text-white/40">+ Add</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.productsRequired && <p className="text-xs text-rose-500">{errors.productsRequired}</p>}
            </div>

            {/* Quantity Volume & Target Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor={quantityInputId} className="text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center gap-1">
                  <span>Estimated Volume / Room Count</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  id={quantityInputId}
                  type="text"
                  placeholder="e.g. 120 rooms (360 sets) or 500 bath sheets"
                  value={formData.estimatedQuantity}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, estimatedQuantity: e.target.value }));
                    if (errors.estimatedQuantity) setErrors((prev) => ({ ...prev, estimatedQuantity: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none transition-all ${
                    errors.estimatedQuantity
                      ? 'border-rose-500'
                      : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#C6A96B]'
                  }`}
                />
                {errors.estimatedQuantity && <p className="text-xs text-rose-500">{errors.estimatedQuantity}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor={dateInputId} className="text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center justify-between">
                  <span>Target Installation / Opening Date</span>
                  <span className="text-[11px] font-normal text-[#8A847D] dark:text-white/50">Approximate</span>
                </label>
                <input
                  id={dateInputId}
                  type="date"
                  value={formData.requiredBy}
                  onChange={(e) => setFormData((p) => ({ ...p, requiredBy: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#C6A96B]"
                />
              </div>
            </div>

            {/* Specifications & Notes */}
            <div className="space-y-2">
              <label htmlFor={specInputId} className="text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center justify-between">
                <span>Quality, Weave & Dimensional Preferences</span>
                <span className="text-[11px] font-normal text-[#8A847D] dark:text-white/50">Optional</span>
              </label>
              <textarea
                id={specInputId}
                rows={3}
                placeholder="e.g. 400 TC White Percale, 700 GSM zero-twist towels, custom King size (78x80x16 in), specific pillow firmness..."
                value={formData.specifications}
                onChange={(e) => setFormData((p) => ({ ...p, specifications: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#C6A96B]"
              />
            </div>

            {/* Customization Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center justify-between">
                <span>Specialized Finishing & Branding</span>
                <span className="text-[11px] font-normal text-[#8A847D] dark:text-white/50">Select all that apply</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Custom Satin-Stitch Crest',
                  'Tone-on-Tone Jacquard Weave',
                  'PMS Brand Color Match',
                  'Bespoke Sizing / Drops',
                  'Flame Retardant (FR) Finish',
                  'Complimentary Swatch Dossier Required',
                  'Pilot Room Prototype Required',
                ].map((c) => {
                  const isSelected = formData.customizations.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCustomization(c)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#855331] text-white dark:bg-[#C6A96B] dark:text-black font-semibold border-transparent shadow-2xs'
                          : 'bg-[#FAF7F2] dark:bg-white/5 border-[#E8DFD3] dark:border-[#332922] text-[#5C554F] dark:text-white/75 hover:border-[#C6A96B]'
                      }`}
                    >
                      {isSelected ? `✓ ${c}` : c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section C: Trade Concierge Contact Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-[#E8DFD3] dark:border-[#332922]">
              <FileCheck size={16} className="text-[#855331] dark:text-[#C6A96B]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#1A1A1A] dark:text-white">
                Contact & Procurement Officer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor={nameInputId} className="text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center gap-1">
                  <span>Full Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  id={nameInputId}
                  type="text"
                  placeholder="e.g. Vikramaditya Rathore"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, name: e.target.value }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none transition-all ${
                    errors.name
                      ? 'border-rose-500'
                      : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#C6A96B]'
                  }`}
                />
                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor={phoneInputId} className="text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center gap-1">
                  <span>Direct Telephone / WhatsApp</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  id={phoneInputId}
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, phone: e.target.value }));
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none transition-all ${
                    errors.phone
                      ? 'border-rose-500'
                      : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#C6A96B]'
                  }`}
                />
                {errors.phone && <p className="text-xs text-rose-500">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor={emailInputId} className="text-xs font-semibold text-[#1A1A1A] dark:text-white flex items-center gap-1">
                  <span>Corporate Email</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  id={emailInputId}
                  type="email"
                  placeholder="procurement@hotel.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, email: e.target.value }));
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none transition-all ${
                    errors.email
                      ? 'border-rose-500'
                      : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#C6A96B]'
                  }`}
                />
                {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor={notesInputId} className="text-xs font-semibold text-[#1A1A1A] dark:text-white">
                Logistics, Delivery Phasing or Property Launch Timelines
              </label>
              <textarea
                id={notesInputId}
                rows={2}
                placeholder="Details on phase deliveries, warehouse receiving, custom carton labeling..."
                value={formData.additionalNotes}
                onChange={(e) => setFormData((p) => ({ ...p, additionalNotes: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#C6A96B]"
              />
            </div>
          </div>

          {/* Proposal Dispatch & Action Section */}
          <div className="pt-6 border-t border-[#E8DFD3] dark:border-[#332922] space-y-6">
            
            {/* Commercial Pricing Guarantee */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-medium text-[#1A1A1A] dark:text-white">
                  Direct Mill Commercial Terms
                </p>
                <p className="text-xs text-[#786E65] dark:text-white/65 font-light">
                  Tailored wholesale contract pricing is quoted based on volume tiers, thread density, and custom embroidery requirements.
                </p>
              </div>
              <div className="shrink-0 text-right text-[11px] font-mono text-[#855331] dark:text-[#C6A96B] font-semibold">
                Guaranteed 24-Hour Proposal
              </div>
            </div>

            {/* Consent Checkbox */}
            <label htmlFor={consentInputId} className="flex items-start gap-3 text-xs text-[#5C554F] dark:text-white/75 cursor-pointer select-none">
              <input
                id={consentInputId}
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => setFormData((p) => ({ ...p, consent: e.target.checked }))}
                className="mt-0.5 rounded text-[#855331] focus:ring-[#855331] accent-[#855331]"
              />
              <span>
                I authorize JORIQUE to prepare and transmit a formal commercial quotation and schedule a trade consultation for this project.
              </span>
            </label>
            {errors.consent && <p className="text-xs text-rose-500">{errors.consent}</p>}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2.5"
              >
                <MessageSquare size={16} />
                <span>Transmit Inquiry via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleOpenEmail}
                className="w-full py-4 px-6 rounded-xl bg-[#1A1A1A] hover:bg-[#0B5F61] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2.5"
              >
                <Mail size={16} />
                <span>Request Formal Proposal via Email</span>
              </button>
            </div>

            {/* Direct Line */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E8DFD3]/60 dark:border-[#2E2925] text-xs text-[#786E65] dark:text-white/60">
              <p className="font-light">
                Direct Trade Atelier: care@jorique.in
              </p>
              <p>
                Telephone / WhatsApp:{' '}
                <a href="tel:9919388211" className="text-[#855331] dark:text-[#C6A96B] font-bold hover:underline">
                  +91 99193 88211
                </a>
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
