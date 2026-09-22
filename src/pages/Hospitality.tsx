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
  Leaf,
  Send,
  ExternalLink,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// Business Type Options (matching Page 5 of Spec)
const BUSINESS_TYPES = [
  'Hotel',
  'Resort',
  'Hospital',
  'Institution',
  'Hospitality Dealer',
  'Other',
];

// Product Families (matching Page 3 of Spec)
const PRODUCT_FAMILIES = [
  {
    id: 'bed-linen',
    title: 'BED LINEN',
    subitems: 'Bedsheets · Pillow Covers · Duvet Covers',
    description:
      'For guest rooms, suites and institutional bedrooms. Collect required size, fabric, GSM / thread count, color, construction and finishing.',
    specs: 'Size · Fabric · GSM / Thread Count · Construction · Color · Pattern · Finishing · Branding',
    image: '/images/hospitality/bed-linen.jpeg',
    tag: 'Guest Rooms & Suites',
    icon: Bed,
  },
  {
    id: 'bath-linen',
    title: 'BATH LINEN',
    subitems: 'Bath Towels · Hand Towels · Face Towels · Bathrobes · Bath Mats',
    description:
      'Collect towel size, GSM, fabric, color, border / design, embroidery and branding requirements.',
    specs: 'Towel size · GSM · Fabric · Color · Border / Design · Embroidery · Branding',
    image: '/images/hospitality/bath-linen.jpeg',
    tag: 'Bath & Wellness',
    icon: Bath,
  },
  {
    id: 'room-textiles',
    title: 'ROOM TEXTILES',
    subitems: 'Bed Runners · Cushion Covers · Floor Runners · Rugs · Shower Curtains',
    description:
      'Collect dimensions, fabric / material, color, pattern, construction and finishing requirements.',
    specs: 'Dimensions · Material · Color · Pattern · Construction · Finishing',
    image: '/images/hospitality/room-textiles.png',
    tag: 'Aesthetic Accent',
    icon: Palette,
  },
  {
    id: 'bedding-sleep',
    title: 'BEDDING & SLEEP',
    subitems: 'Duvets · Quilts · Pillows · Cushions · Mattresses',
    description:
      'Collect dimensions, fill, weight, construction, fabric, firmness and other property-specific requirements.',
    specs: 'Duvet / Quilt fill · Weight · Dimensions · Fabric · Construction · Mattress & Pillow specs',
    image: '/images/hospitality/bed-linen.jpeg',
    tag: 'Comfort Core',
    icon: Layers,
  },
];

// Specifications Matrix (matching Page 4 of Spec)
const SPECIFICATIONS = [
  {
    family: 'Bed Linen',
    details: 'Size · Fabric · GSM / Thread Count · Construction · Color · Pattern · Finishing · Branding',
  },
  {
    family: 'Bath Linen',
    details: 'Towel size · GSM · Fabric · Color · Border / Design · Embroidery · Branding',
  },
  {
    family: 'Bedding',
    details: 'Duvet / Quilt fill · Weight · Dimensions · Fabric · Construction · Pillow / Cushion specification',
  },
  {
    family: 'Mattresses',
    details: 'Size · Construction · Foam / spring preference · Firmness · Fabric / FR requirement · Quantity',
  },
  {
    family: 'Room Textiles',
    details: 'Dimensions · Material · Color · Pattern · Construction · Finishing',
  },
];

// Customization options (matching Page 4 & 5 of Spec)
const CUSTOMIZATIONS = [
  'Logo Branding',
  'Custom Embroidery',
  'Property Color Match',
  'Bespoke Sizing',
  'Flame Retardant (FR)',
  'Special Weave / Jacquard',
];

// What the buyer can ask for (matching Page 4 of Spec)
const BUYER_OPTIONS = [
  'Custom sizes',
  'Custom colors',
  'Branding / embroidery',
  'Property-specific specifications',
  'Bulk quantities',
  'Product combinations',
  'Repeat supply requirements',
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

  // Form State
  const [formData, setFormData] = useState({
    businessType: 'Hotel',
    propertyName: '',
    city: '',
    state: '',
    productsRequired: ['Bed Linen', 'Bath Linen'] as string[],
    estimatedQuantity: '',
    specifications: '',
    customizations: [] as string[],
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

  const handleSelectProductFamily = (familyName: string) => {
    const cleanName = familyName === 'BED LINEN' ? 'Bed Linen' :
      familyName === 'BATH LINEN' ? 'Bath Linen' :
        familyName === 'ROOM TEXTILES' ? 'Room Textiles' :
          familyName === 'BEDDING & SLEEP' ? 'Bedding & Sleep' : familyName;

    if (!formData.productsRequired.includes(cleanName)) {
      setFormData((prev) => ({
        ...prev,
        productsRequired: [...prev.productsRequired, cleanName],
      }));
    }
    const formElem = document.getElementById('enquiry-form');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.propertyName.trim()) {
      newErrors.propertyName = 'Property / Business name is required.';
    }
    if (!formData.city.trim() || !formData.state.trim()) {
      newErrors.location = 'City and State are required.';
    }
    if (formData.productsRequired.length === 0) {
      newErrors.productsRequired = 'Select at least one product family.';
    }
    if (!formData.estimatedQuantity.trim()) {
      newErrors.estimatedQuantity = 'Please specify your estimated quantity.';
    }
    if (!formData.specifications.trim()) {
      newErrors.specifications = 'Please specify your quality / specification requirements.';
    }
    if (!formData.requiredBy) {
      newErrors.requiredBy = 'Required by date is required.';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Contact person name is required.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      newErrors.phone = 'Valid phone / WhatsApp number is required.';
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

  // Message Generators (Matching Exact Page 6 Specifications)
  const getEmailSubject = () => {
    const bName = formData.propertyName.trim() || '[Business Name]';
    const loc = formData.city.trim() || '[City]';
    return `JORIQUE Hospitality Bulk Enquiry — ${bName} — ${loc}`;
  };

  const getEmailBody = () => {
    const loc = [formData.city.trim(), formData.state.trim()].filter(Boolean).join(', ') || '[City, State]';
    const products = formData.productsRequired.join(', ') || '[Selected Products]';
    const custom = formData.customizations.join(', ') || 'Standard specifications';

    return `Dear JORIQUE Team,

I would like to enquire about JORIQUE Hospitality products for bulk supply.

Business Type: ${formData.businessType}
Property / Business Name: ${formData.propertyName || '[Name]'}
Location: ${loc}

Products Required: ${products}
Estimated Quantity: ${formData.estimatedQuantity || '[Quantity / Product-wise Quantity]'}
Specification / Quality Requirement: ${formData.specifications || '[Details]'}
Customization / Branding: ${custom}
Additional Requirements: ${formData.additionalNotes || 'None'}
Required By: ${formData.requiredBy || '[Date]'}

Name: ${formData.name || '[Name]'}
Phone / WhatsApp: ${formData.phone || '[Phone]'}
Email: ${formData.email || '[Email]'}

Please share suitable product options, specifications, lead time and quotation based on my requirement.

Thank you,
${formData.name || '[Name]'}`;
  };

  const getWhatsAppBody = () => {
    const loc = [formData.city.trim(), formData.state.trim()].filter(Boolean).join(', ') || '[City, State]';
    const products = formData.productsRequired.join(', ') || '[Products]';
    const custom = formData.customizations.join(', ') || 'Standard specifications';

    return `Hello JORIQUE Team,

I would like to enquire about JORIQUE Hospitality products for bulk supply.

Business Type: ${formData.businessType}
Property / Business: ${formData.propertyName || '[Name]'}
Location: ${loc}

Products: ${products}
Quantity: ${formData.estimatedQuantity || '[Quantity]'}
Specification / Quality: ${formData.specifications || '[Details]'}
Customization / Branding: ${custom}
Required By: ${formData.requiredBy || '[Date]'}

Name: ${formData.name || '[Name]'}
Phone: ${formData.phone || '[Phone]'}
Email: ${formData.email || '[Email]'}

Please share suitable options, specifications, lead time and quotation.

Thank you.`;
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

  const handlePrimarySubmit = () => {
    if (!validateForm()) return;
    // Default primary submit leads smoothly to WhatsApp dispatch
    handleOpenWhatsApp();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#100E0D] text-[#1A1A1A] dark:text-[#FCFAF7] transition-colors duration-500 font-sans selection:bg-[#C6A96B]/30">
      {/* SEO METADATA (Exact Match to Page 7 of Spec) */}
      <SEO
        title="JORIQUE Hospitality | Hotel & Hospitality Textile Solutions"
        description="Explore JORIQUE Hospitality textile solutions for hotels, resorts, hospitals and institutions, including bed linen, bath linen, bedding, towels and customized bulk supply."
        keywords="hotel linen supplier, hospitality linen, hotel bedsheets, hotel towels, hotel bedding, bath towels, duvet covers, bathrobes, hospitality textile supplier, bulk hotel linen"
        canonical="https://jorique.in/hospitality"
        image="https://jorique.in/images/hospitality-hero-banner.jpg"
      />

      <Navbar />

      {/* ─────────────────────────────────────────────────────────────
          01. HERO: Exact Match to User Design Mockup (Pages 1 & 2 of Spec)
      ───────────────────────────────────────────────────────────── */}
      <header className="relative pt-28 lg:pt-36 pb-14 sm:pb-20 overflow-hidden border-b border-[#2E261F] bg-[#161B20] text-white">
        {/* Background Banner Image: Aligned to the right, showing the sunlit lakeside resort suite */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/images/hospitality-hero-banner.jpg"
            alt="JORIQUE Hospitality Luxury Resort Presidential Suite overlooking lake and mountains"
            className="w-full h-full object-cover object-right"
          />
          {/* Gradient feather to ensure seamless readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#161B20] via-[#161B20]/95 sm:via-[#161B20]/80 md:via-[#161B20]/45 to-transparent lg:w-[58%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161B20]/70 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6 lg:gap-12 items-center pt-6 sm:pt-10 pb-8">

            {/* Left Narrative Column: Exact Match to User Design Mockup */}
            <div className="max-w-[480px] lg:max-w-[500px] lg:mr-auto space-y-5 sm:space-y-6">

              {/* 1. Eyebrow */}
              <p className="text-[11px] sm:text-[12px] font-mono tracking-[0.22em] uppercase text-[#C6A96B] font-semibold">
                PREMIUM TEXTILE SOLUTIONS
              </p>

              {/* 2. Brand & Hospitality Titles */}
              <div className="space-y-0 -mt-1">
                <p className="font-mainlogo text-4xl sm:text-5xl lg:text-[52px] font-normal tracking-[0.06em] text-white leading-none">
                  JORIQUE
                </p>
                <h1 className="font-mainlogo italic text-6xl sm:text-7xl lg:text-[84px] leading-[0.9] text-[#E0C092] font-normal tracking-[-0.01em] pt-1">
                  Hospitality
                </h1>
              </div>

              {/* 3. Tagline */}
              <div className="space-y-0.5 pt-1">
                <p className="font-['Cormorant_Garamond',Georgia,serif] text-2xl sm:text-3xl lg:text-[30px] font-normal text-white leading-[1.2]">
                  Designed for the spaces
                </p>
                <p className="font-['Cormorant_Garamond',Georgia,serif] text-2xl sm:text-3xl lg:text-[30px] font-normal text-white leading-[1.2]">
                  people remember.
                </p>
              </div>

              {/* 4. Description */}
              <p className="text-sm sm:text-[15px] text-[#C4B9A8] font-['Jost',sans-serif] font-light leading-[1.6] max-w-[440px]">
                Premium bed and bath linens, bedding and décor textiles for hotels, resorts and hospitality spaces. Durable, elegant and made to leave a lasting impression.
              </p>

              {/* Bulk Supply Message Badge (from Spec Page 2) */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md">
                <p className="text-xs sm:text-[13px] font-medium text-white/95">
                  <span className="text-[#E0C092] font-bold">Bulk Supply</span> · Requirement-based quotation · Product specifications discussed on enquiry
                </p>
              </div>

              {/* 5. Pill CTA Button */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#enquiry-form"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#8A6230] hover:bg-[#735025] text-white text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer border border-[#C6A96B]/30"
                >
                  <span>ENQUIRE FOR BULK SUPPLY</span>
                  <ArrowRight size={14} />
                </a>

                <a
                  href="tel:9919388211"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/20 bg-white/5 hover:border-[#C6A96B] text-white text-xs font-medium tracking-wider transition-all"
                >
                  <Phone size={13} className="text-[#C6A96B]" />
                  <span>Call / WhatsApp 9919388211</span>
                </a>
              </div>

              {/* 6. Feature Trust Row with Dividers (Matching Mockup) */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-white/15">
                <div className="flex items-center gap-2.5">
                  <Leaf size={19} strokeWidth={1.5} className="text-[#C6A96B] shrink-0" />
                  <div className="text-[11px] sm:text-[12px] leading-snug font-['Jost',sans-serif]">
                    <span className="block text-white font-medium">Premium</span>
                    <span className="block text-white/70 font-light">Quality Fabrics</span>
                  </div>
                </div>

                <div className="hidden sm:block h-7 w-[1px] bg-white/20" />

                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={19} strokeWidth={1.5} className="text-[#C6A96B] shrink-0" />
                  <div className="text-[11px] sm:text-[12px] leading-snug font-['Jost',sans-serif]">
                    <span className="block text-white font-medium">Contract</span>
                    <span className="block text-white/70 font-light">Grade</span>
                  </div>
                </div>

                <div className="hidden sm:block h-7 w-[1px] bg-white/20" />

                <div className="flex items-center gap-2.5">
                  <Sliders size={19} strokeWidth={1.5} className="text-[#C6A96B] shrink-0" />
                  <div className="text-[11px] sm:text-[12px] leading-snug font-['Jost',sans-serif]">
                    <span className="block text-white font-medium">Fully</span>
                    <span className="block text-white/70 font-light">Customizable</span>
                  </div>
                </div>

                <div className="hidden sm:block h-7 w-[1px] bg-white/20" />

                <div className="flex items-center gap-2.5">
                  <Building2 size={19} strokeWidth={1.5} className="text-[#C6A96B] shrink-0" />
                  <div className="text-[11px] sm:text-[12px] leading-snug font-['Jost',sans-serif]">
                    <span className="block text-white font-medium">For Hotels,</span>
                    <span className="block text-white/70 font-light">Resorts &amp; Institutions</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Spacer on desktop (allows background resort suite to shine through) & Mobile Image */}
            <div className="w-full">
              {/* Desktop: Spacer letting the sunlit resort bed & lake view show unobstructed */}
              <div className="hidden lg:block min-h-[480px] pointer-events-none" />

              {/* Mobile / Tablet Image showcase */}
              <div className="block lg:hidden pt-4">
                <div className="rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-black/20">
                  <img
                    src="/images/hospitality-hero-banner.jpg"
                    alt="JORIQUE Hospitality Luxury Resort Presidential Suite"
                    className="w-full h-auto object-cover object-right"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          WHO IT IS FOR / SECTORS STRIP (Page 1 & 2 of Spec)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-7 bg-white/60 dark:bg-[#15110E] border-b border-[#E8DFD3] dark:border-[#2E261F]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#8A6230] dark:text-[#C6A96B] font-bold">
                WHO IT IS FOR
              </span>
              <span className="hidden md:inline text-[#E8DFD3] dark:text-[#332922]">·</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-[#5C554F] dark:text-white/80">
              {['Hotels', 'Resorts', 'Hospitals', 'Institutions', 'Hospitality Dealers'].map((sector) => (
                <span
                  key={sector}
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] font-medium transition-all hover:border-[#C6A96B]"
                >
                  {sector}
                </span>
              ))}
            </div>
            <div className="text-xs text-[#8A847D] dark:text-white/60 font-mono shrink-0">
              Direct: <a href="tel:9919388211" className="text-[#8A6230] dark:text-[#C6A96B] font-bold hover:underline">9919388211</a> · <a href="mailto:care@jorique.in" className="text-[#8A6230] dark:text-[#C6A96B] font-bold hover:underline">care@jorique.in</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FLAGSHIP PACKAGING & INSTITUTIONAL PRESENTATION SHOWCASE
          (Featuring user's newly added image from Page 2 of Spec)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-5 sm:px-8 max-w-[1240px] mx-auto">
        <div className="rounded-3xl overflow-hidden border border-[#E8DFD3] dark:border-[#332922] bg-white dark:bg-[#181412] shadow-xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">

          <div className="relative rounded-2xl overflow-hidden border border-[#E8DFD3] dark:border-[#332922] shadow-md group">
            <img
              src="/images/hospitality/main1.jpeg"
              alt="JORIQUE Hospitality Bespoke Packaged Bedding with Custom Inlay Presentation"
              className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700"
            />
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#8A6230] dark:text-[#C6A96B] font-bold block">
                Above The Fold · Packaging &amp; Presentation
              </span>
              <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-3xl sm:text-4xl font-normal text-[#1A1A1A] dark:text-white leading-snug">
                Bespoke institutional packaging with complete brand customization.
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#5C554F] dark:text-white/75 font-light leading-relaxed">
              Every bulk order can be prepared with customized insert cards, property crest monogramming, barcode inventory tagging, and premium zippered luggage presentation packs tailored for commercial receiving and luxury room turnover.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922]">
                <span className="block font-semibold text-xs text-[#1A1A1A] dark:text-white">Property Monogramming</span>
                <span className="block text-[11px] text-[#786E65] dark:text-white/60 font-light mt-0.5">Custom crest &amp; logo embroidery</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922]">
                <span className="block font-semibold text-xs text-[#1A1A1A] dark:text-white">Inventory Control</span>
                <span className="block text-[11px] text-[#786E65] dark:text-white/60 font-light mt-0.5">Room &amp; unit carton labeling</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#enquiry-form"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#8A6230] dark:text-[#C6A96B] hover:text-[#1A1A1A] dark:hover:text-white uppercase transition-colors"
              >
                <span>Discuss Custom Branding &amp; Packaging</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          02. PRODUCT RANGE (4 Strong Visual Families from Page 3 of Spec)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 px-5 sm:px-8 max-w-[1240px] mx-auto space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#8A6230] dark:text-[#C6A96B] font-bold block">
            02 / PRODUCT RANGE
          </span>
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1A1A] dark:text-white tracking-tight">
            Built around the needs of hospitality spaces.
          </h2>
          <p className="text-sm sm:text-base text-[#5C554F] dark:text-white/75 font-light">
            Four strong visual families engineered for commercial longevity. Each family can lead to a deeper product enquiry.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCT_FAMILIES.map((fam) => {
            const isSelected = formData.productsRequired.includes(
              fam.title === 'BED LINEN' ? 'Bed Linen' :
                fam.title === 'BATH LINEN' ? 'Bath Linen' :
                  fam.title === 'ROOM TEXTILES' ? 'Room Textiles' : 'Bedding & Sleep'
            );

            return (
              <div
                key={fam.id}
                className={`bg-white dark:bg-[#1A1816] rounded-3xl border transition-all duration-300 flex flex-col group overflow-hidden shadow-sm hover:shadow-xl ${isSelected
                  ? 'border-[#8A6230] dark:border-[#C6A96B] ring-1 ring-[#8A6230]/30'
                  : 'border-[#E8DFD3] dark:border-[#332922] hover:border-[#8A6230]/50'
                  }`}
              >
                {/* Image */}
                <div className="relative w-full aspect-[5/4] overflow-hidden bg-[#FAF7F2] dark:bg-black/20">
                  <img
                    src={fam.image}
                    alt={fam.title}
                    className="absolute inset-0 w-full h-full object-contain scale-[1.07] group-hover:scale-[1.07] transition-transform duration-700 ease-out"
                  />

                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-xs text-[10px] font-mono tracking-wider text-[#8A6230] dark:text-[#C6A96B] uppercase font-bold border border-[#E8DFD3] dark:border-white/10">
                    {fam.tag}
                  </div>
                </div>
                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-['Cormorant_Garamond',Georgia,serif] text-2xl sm:text-3xl font-medium tracking-tight text-[#1A1A1A] dark:text-white">
                        {fam.title}
                      </h3>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-md bg-[#8A6230]/10 text-[#8A6230] dark:bg-[#C6A96B]/20 dark:text-[#C6A96B] text-[10px] font-bold uppercase tracking-wider">
                          In Enquiry
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#8A6230] dark:text-[#D4A86A] uppercase tracking-wider">
                      {fam.subitems}
                    </p>
                    <p className="text-sm text-[#5C554F] dark:text-white/75 font-light leading-relaxed pt-1">
                      {fam.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E8DFD3] dark:border-[#332922]">
                    <button
                      type="button"
                      onClick={() => handleSelectProductFamily(fam.title)}
                      className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-[#8A6230] dark:text-[#C6A96B] hover:text-[#1A1A1A] dark:hover:text-white uppercase transition-colors group-hover:underline cursor-pointer"
                    >
                      <span>ENQUIRE ABOUT THIS RANGE →</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commercial Quotations Policy Note (Exact from Page 3 of Spec) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#F5EDE3] dark:bg-[#1E1915] border border-[#E8DFD3] dark:border-[#332922] text-center space-y-1.5">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#8A6230] dark:text-[#D4A86A]">
            COMMERCIAL QUOTATION POLICY
          </p>
          <p className="text-xs sm:text-sm text-[#5C554F] dark:text-white/80 font-light max-w-3xl mx-auto">
            Hospitality quotations are prepared according to product specification, quantity, quality, customization and commercial requirements. No public retail pricing.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          03. SPECIFICATION (Consultative Matrix Table from Page 4 of Spec)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-5 sm:px-8 bg-[#FAF6EE] dark:bg-[#15120F] border-y border-[#E8DFD3] dark:border-[#2E261F]">
        <div className="max-w-[1240px] mx-auto space-y-14">

          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#8A6230] dark:text-[#D4A86A] font-bold block">
              03 / SPECIFICATION
            </span>
            <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1A1A] dark:text-white tracking-tight">
              Every property has different requirements.
            </h2>
            <p className="text-sm sm:text-base text-[#5C554F] dark:text-white/75 font-light">
              This experience is consultative: describe your commercial requirements and JORIQUE responds with suitable specifications and samples.
            </p>
          </div>

          {/* Matrix Table */}
          <div className="bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E8DFD3] dark:border-[#332922] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E8DFD3] dark:border-[#332922] bg-[#F7F2E8] dark:bg-white/5">
                    <th className="p-4 sm:p-5 text-xs font-bold font-mono uppercase tracking-[0.16em] text-[#8A6230] dark:text-[#D4A86A] w-1/4 sm:w-1/3">
                      PRODUCT FAMILY
                    </th>
                    <th className="p-4 sm:p-5 text-xs font-bold font-mono uppercase tracking-[0.16em] text-[#8A6230] dark:text-[#D4A86A]">
                      DETAILS TO DISCUSS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD3] dark:divide-[#332922] text-xs sm:text-sm">
                  {SPECIFICATIONS.map((row) => (
                    <tr key={row.family} className="hover:bg-[#FAF7F2] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 sm:p-5 font-semibold text-[#1A1A1A] dark:text-white">
                        {row.family}
                      </td>
                      <td className="p-4 sm:p-5 text-[#5C554F] dark:text-white/80 font-light leading-relaxed">
                        {row.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* What The Buyer Can Ask For */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#8A6230] dark:text-[#D4A86A] text-center">
              WHAT THE BUYER CAN ASK FOR
            </h3>
            <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
              {BUYER_OPTIONS.map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] text-xs sm:text-sm text-[#1A1A1A] dark:text-white/85 font-medium shadow-2xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Spec Showcase Image */}
          {/* <div className="rounded-2xl overflow-hidden border border-[#E8DFD3] dark:border-[#332922] shadow-md bg-white dark:bg-[#1A1816]">
            <img
              src="/images/luxury-products/Table Runner.png"
              alt="JORIQUE Hospitality Architectural Textile Finishing"
              className="w-full h-auto max-h-[460px] object-cover"
            />
            <div className="p-4 text-center border-t border-[#E8DFD3] dark:border-[#332922]">
              <p className="text-xs text-[#786E65] dark:text-white/60 font-light">
                Fabric weight, scale, finishing and how the product performs inside an institutional hospitality environment.
              </p>
            </div>
          </div> */}

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          04. BULK ENQUIRY FORM (Exact 10 Fields from Pages 5 & 6 of Spec)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="enquiry-form"
        className="py-20 lg:py-28 px-5 sm:px-8 max-w-[1040px] mx-auto space-y-12 scroll-mt-20"
      >
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#8A6230] dark:text-[#D4A86A] font-bold block">
            04 / BULK ENQUIRY
          </span>
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1A1A] dark:text-white tracking-tight">
            Tell us what your property needs.
          </h2>
          <p className="text-sm sm:text-base text-[#5C554F] dark:text-white/75 font-light">
            Share your commercial requirements. We review specifications, dispatch fabric swatches, and prepare a requirement-based quotation.
          </p>
        </div>

        {/* The Form */}
        <div className="bg-white dark:bg-[#1A1816] p-6 sm:p-10 rounded-3xl border border-[#E8DFD3] dark:border-[#332922] shadow-xl space-y-8">

          {/* 1. Business Type */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
              <span>Business Type</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {BUSINESS_TYPES.map((type) => {
                const isSelected = formData.businessType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, businessType: type }))}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${isSelected
                      ? 'bg-[#8A6230] text-white dark:bg-[#C6A96B] dark:text-black font-semibold shadow-xs'
                      : 'bg-[#FAF6F0] dark:bg-white/5 text-[#5C554F] dark:text-white/75 border border-[#E8DFD3] dark:border-[#332922] hover:border-[#8A6230]'
                      }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2 & 3. Property Name & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor={propertyInputId} className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
                <span>Property / Business Name</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                id={propertyInputId}
                type="text"
                placeholder="e.g. The Grand Palace Resort"
                value={formData.propertyName}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, propertyName: e.target.value }));
                  if (errors.propertyName) setErrors((prev) => ({ ...prev, propertyName: '' }));
                }}
                className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none ${errors.propertyName ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#8A6230]'
                  }`}
              />
              {errors.propertyName && <p className="text-xs text-rose-500">{errors.propertyName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
                <span>Location (City · State)</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id={cityInputId}
                  type="text"
                  placeholder="City (e.g. Jaipur)"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, city: e.target.value }));
                    if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none ${errors.location ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#8A6230]'
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
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none ${errors.location ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#8A6230]'
                    }`}
                />
              </div>
              {errors.location && <p className="text-xs text-rose-500">{errors.location}</p>}
            </div>
          </div>

          {/* 4. Products Required (Multi-select) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
              <span>Products Required</span>
              <span className="text-rose-500">*</span>
              <span className="text-[11px] font-normal text-[#786E65] dark:text-white/60 lowercase">(multi-select)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['Bed Linen', 'Bath Linen', 'Room Textiles', 'Bedding & Sleep', 'Mattresses', 'Pillows & Cushions'].map((prod) => {
                const isSelected = formData.productsRequired.includes(prod);
                return (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => toggleProduct(prod)}
                    className={`py-3 px-3 rounded-xl text-xs font-medium text-center border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${isSelected
                      ? 'bg-[#8A6230] text-white dark:bg-[#C6A96B] dark:text-black font-semibold border-transparent shadow-xs'
                      : 'bg-[#FAF6F0] dark:bg-white/5 border-[#E8DFD3] dark:border-[#332922] text-[#5C554F] dark:text-white/80 hover:border-[#8A6230]'
                      }`}
                  >
                    {isSelected && <Check size={13} strokeWidth={2.5} />}
                    <span>{prod}</span>
                  </button>
                );
              })}
            </div>
            {errors.productsRequired && <p className="text-xs text-rose-500">{errors.productsRequired}</p>}
          </div>

          {/* 5 & 8. Estimated Quantity & Required By Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor={quantityInputId} className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
                <span>Estimated Quantity (Overall / Product-wise)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                id={quantityInputId}
                type="text"
                placeholder="e.g. 100 sets Bed Linen, 250 Bath Towels"
                value={formData.estimatedQuantity}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, estimatedQuantity: e.target.value }));
                  if (errors.estimatedQuantity) setErrors((prev) => ({ ...prev, estimatedQuantity: '' }));
                }}
                className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none ${errors.estimatedQuantity ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#8A6230]'
                  }`}
              />
              {errors.estimatedQuantity && <p className="text-xs text-rose-500">{errors.estimatedQuantity}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor={dateInputId} className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
                <span>Required By Date</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                id={dateInputId}
                type="date"
                value={formData.requiredBy}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, requiredBy: e.target.value }));
                  if (errors.requiredBy) setErrors((prev) => ({ ...prev, requiredBy: '' }));
                }}
                className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none ${errors.requiredBy ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#8A6230]'
                  }`}
              />
              {errors.requiredBy && <p className="text-xs text-rose-500">{errors.requiredBy}</p>}
            </div>
          </div>

          {/* 6. Specification / Quality Requirement */}
          <div className="space-y-2">
            <label htmlFor={specInputId} className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
              <span>Specification / Quality Requirement</span>
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              id={specInputId}
              rows={3}
              placeholder="e.g. 400 TC White Percale bedsheets, 600 GSM combed cotton bath towels with dobby border, specific mattress thickness, etc."
              value={formData.specifications}
              onChange={(e) => {
                setFormData((p) => ({ ...p, specifications: e.target.value }));
                if (errors.specifications) setErrors((prev) => ({ ...prev, specifications: '' }));
              }}
              className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none ${errors.specifications ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#8A6230]'
                }`}
            />
            {errors.specifications && <p className="text-xs text-rose-500">{errors.specifications}</p>}
          </div>

          {/* 7. Customization / Branding (Optional) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
              <span>Customization / Branding</span>
              <span className="text-[11px] font-normal text-[#786E65] dark:text-white/60 lowercase">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CUSTOMIZATIONS.map((c) => {
                const isSelected = formData.customizations.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCustomization(c)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${isSelected
                      ? 'bg-[#8A6230] text-white dark:bg-[#C6A96B] dark:text-black font-semibold border-transparent shadow-xs'
                      : 'bg-[#FAF6F0] dark:bg-white/5 border-[#E8DFD3] dark:border-[#332922] text-[#5C554F] dark:text-white/80 hover:border-[#8A6230]'
                      }`}
                  >
                    {isSelected ? `✓ ${c}` : c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 9. Contact Details (Name + Phone/WhatsApp + Email) */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
              <span>Contact Details</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  id={nameInputId}
                  type="text"
                  placeholder="Contact Name *"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, name: e.target.value }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none ${errors.name ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#8A6230]'
                    }`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  id={phoneInputId}
                  type="tel"
                  placeholder="Phone / WhatsApp *"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, phone: e.target.value }));
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none ${errors.phone ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#8A6230]'
                    }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <input
                  id={emailInputId}
                  type="email"
                  placeholder="Business Email *"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, email: e.target.value }));
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none ${errors.email ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#8A6230]'
                    }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* 10. Additional Requirement (Optional) */}
          <div className="space-y-2">
            <label htmlFor={notesInputId} className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
              <span>Additional Requirement</span>
              <span className="text-[11px] font-normal text-[#786E65] dark:text-white/60 lowercase">(optional)</span>
            </label>
            <textarea
              id={notesInputId}
              rows={2}
              placeholder="Any special packing, delivery timeline, or logistics considerations..."
              value={formData.additionalNotes}
              onChange={(e) => setFormData((p) => ({ ...p, additionalNotes: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#8A6230]"
            />
          </div>

          {/* PRICING NOTE & DIRECT ACTIONS (from Page 5 of Spec) */}
          <div className="pt-6 border-t border-[#E8DFD3] dark:border-[#332922] space-y-6">

            {/* Pricing Note */}
            <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] text-center">
              <p className="text-xs text-[#5C554F] dark:text-white/80 font-light">
                <strong className="font-semibold text-[#1A1A1A] dark:text-white">Commercial Pricing Note:</strong>{' '}
                “Pricing is shared based on your product specification, quantity and quality requirements.”
              </p>
            </div>

            {/* Consent Checkbox */}
            <label htmlFor={consentInputId} className="flex items-start gap-3 text-xs text-[#5C554F] dark:text-white/75 cursor-pointer">
              <input
                id={consentInputId}
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => setFormData((p) => ({ ...p, consent: e.target.checked }))}
                className="mt-0.5 rounded text-[#8A6230] focus:ring-[#8A6230] accent-[#8A6230]"
              />
              <span>
                I agree that JORIQUE may contact me regarding commercial supply and quotations for this property.
              </span>
            </label>
            {errors.consent && <p className="text-xs text-rose-500">{errors.consent}</p>}

            {/* Primary Action Button: SEND MY REQUIREMENT */}
            <div>
              <button
                type="button"
                onClick={handlePrimarySubmit}
                className="w-full py-4 px-8 rounded-xl bg-[#8A6230] hover:bg-[#6F4E22] text-white font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>SEND MY REQUIREMENT</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Alternative Actions: WhatsApp My Requirement · Email My Requirement · Call 9919388211 */}
            <div className="space-y-2">
              <span className="block text-center text-[11px] font-mono tracking-wider uppercase text-[#8A847D] dark:text-white/50">
                Alternative Instant Actions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs uppercase tracking-[0.14em] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare size={15} />
                  <span>WhatsApp My Requirement</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenEmail}
                  className="w-full py-3.5 px-6 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-white hover:bg-[#FAF7F2] dark:bg-white/5 dark:hover:bg-white/10 text-[#1A1A1A] dark:text-white font-semibold text-xs uppercase tracking-[0.14em] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail size={15} />
                  <span>Email My Requirement</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E8DFD3]/60 dark:border-[#2E2925] text-[11px] text-[#786E65] dark:text-white/60">
              <p className="font-light">
                Direct: 9919388211 for queries, business enquiries or orders.
              </p>
              <p>
                Direct Concierge:{' '}
                <a href="tel:9919388211" className="text-[#8A6230] dark:text-[#C6A96B] font-bold hover:underline">
                  9919388211
                </a>{' '}
                ·{' '}
                <a href="mailto:care@jorique.in" className="text-[#8A6230] dark:text-[#C6A96B] font-bold hover:underline">
                  care@jorique.in
                </a>
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          06. HOW IT WORKS (Page 7 of Spec)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-5 sm:px-8 bg-[#F5EDE3] dark:bg-[#14100D] border-t border-[#E8DFD3] dark:border-[#2E261F]">
        <div className="max-w-[1240px] mx-auto space-y-12">

          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#8A6230] dark:text-[#D4A86A] font-bold block">
              06 / FULL PAGE FLOW
            </span>
            <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1A1A] dark:text-white tracking-tight">
              The Hospitality experience.
            </h2>
            <p className="text-sm sm:text-base text-[#5C554F] dark:text-white/75 font-light">
              From requirement definition to confirmed institutional delivery with complete specification control.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Share the requirement.',
                desc: 'Tell us your property, products, quantity and specifications.',
              },
              {
                step: '02',
                title: 'Discuss the requirement.',
                desc: 'JORIQUE reviews quality, dimensions, customization and commercial details.',
              },
              {
                step: '03',
                title: 'Receive the quotation.',
                desc: 'Pricing is prepared around the agreed requirement.',
              },
              {
                step: '04',
                title: 'Confirm & supply.',
                desc: 'Production and delivery proceed according to the confirmed specification.',
              },
            ].map((st) => (
              <div
                key={st.step}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1A1816] border border-[#E8DFD3] dark:border-[#332922] space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">

                  <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] dark:text-white">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C554F] dark:text-white/75 font-light leading-relaxed">
                    {st.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E8DFD3] dark:border-[#332922] flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#8A6230] dark:text-[#C6A96B]">
                  <Check size={12} />
                  <span>Specification Controlled</span>
                </div>
              </div>
            ))}
          </div>

          {/* Key Distinction Note (from Page 7 of Spec) */}
          {/* <div className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] text-center max-w-3xl mx-auto">
            <p className="text-xs text-[#786E65] dark:text-white/70 font-light leading-relaxed">
              <strong className="text-[#1A1A1A] dark:text-white font-medium">Key distinction from JORIQUE Souvenir:</strong>{' '}
              Souvenir is an occasion-led gifting journey. Hospitality is a professional B2B supply journey with architectural, commercial, and specification-led supply agreements.
            </p>
          </div> */}

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          07. FOOTER (Page 7 of Spec)
      ───────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
