import React, { useState, useId } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Mail,
  MessageSquare,
  ArrowRight,
  Phone,
  Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// Business Type Options
const BUSINESS_TYPES = [
  'Hotel',
  'Resort',
  'Hospital',
  'Institution',
  'Hospitality Dealer',
  'Other',
];

// Product Families
const PRODUCT_FAMILIES = [
  {
    id: 'bed-linen',
    title: 'BED LINEN',
    subitems: 'Bedsheets · Pillow Covers · Duvet Covers',
    description:
      'For guest rooms, suites and institutional bedrooms. Collect required size, fabric, GSM / thread count, color, construction and finishing.',
    image: '/images/hospitality/bed-linen.jpg',
    tag: 'Guest Rooms & Suites',
  },
  {
    id: 'bath-linen',
    title: 'BATH LINEN',
    subitems: 'Bath Towels · Hand Towels · Face Towels · Bathrobes · Bath Mats',
    description:
      'Collect towel size, GSM, fabric, color, border / design, embroidery and branding requirements.',
    image: '/images/hospitality/bath-linen.jpg',
    tag: 'Bath & Wellness',
  },
  {
    id: 'room-textiles',
    title: 'ROOM TEXTILES',
    subitems: 'Bed Runners · Cushion Covers · Floor Runners · Rugs · Shower Curtains',
    description:
      'Collect dimensions, fabric / material, color, pattern, construction and finishing requirements.',
    image: '/images/hospitality/room-textiles.jpg',
    tag: 'Aesthetic Accent',
  },
  {
    id: 'bedding-sleep',
    title: 'BEDDING & SLEEP',
    subitems: 'Duvets · Quilts · Pillows · Cushions · Mattresses',
    description:
      'Collect dimensions, fill, weight, construction, fabric, firmness and other property-specific requirements.',
    image: '/images/hospitality/bedding-sleep.jpg',
    tag: 'Comfort Core',
  },
];

// Specifications Matrix
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

// Customization options
const CUSTOMIZATIONS = [
  'Logo Branding',
  'Custom Embroidery',
  'Property Color Match',
  'Bespoke Sizing',
  'Flame Retardant (FR)',
  'Special Weave / Jacquard',
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
    if (!formData.productsRequired.includes(familyName)) {
      setFormData((prev) => ({
        ...prev,
        productsRequired: [...prev.productsRequired, familyName],
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
      newErrors.estimatedQuantity = 'Please specify estimated quantity.';
    }
    if (!formData.specifications.trim()) {
      newErrors.specifications = 'Please specify your quality/specification requirements.';
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
      newErrors.email = 'Valid business email is required.';
    }
    if (!formData.consent) {
      newErrors.consent = 'Please confirm consent to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Message Generators matching developer specification
  const getEmailSubject = () => {
    const bName = formData.propertyName.trim() || 'Commercial Property';
    const loc = formData.city.trim() || 'Direct Enquiry';
    return `JORIQUE Hospitality Bulk Enquiry — ${bName} — ${loc}`;
  };

  const getEmailBody = () => {
    const loc = [formData.city.trim(), formData.state.trim()].filter(Boolean).join(', ') || '[City, State]';
    const products = formData.productsRequired.join(', ') || 'Not specified';
    const custom = formData.customizations.join(', ') || 'Standard specifications';

    return `Dear JORIQUE Team,

I would like to enquire about JORIQUE Hospitality products for bulk supply.

Business Type: ${formData.businessType}
Property / Business Name: ${formData.propertyName || '[Name]'}
Location: ${loc}

Products Required: ${products}
Estimated Quantity: ${formData.estimatedQuantity || '[Quantity]'}
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
    const products = formData.productsRequired.join(', ') || 'Not specified';
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

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#100E0D] text-[#241F1C] dark:text-[#FCFAF7] transition-colors duration-500 font-sans selection:bg-[#855331]/20">
      {/* SEO METADATA */}
      <SEO
        title="JORIQUE Hospitality | Hotel & Hospitality Textile Solutions"
        description="Explore JORIQUE Hospitality textile solutions for hotels, resorts, hospitals and institutions, including bed linen, bath linen, bedding, towels and customized bulk supply."
        keywords="hotel linen supplier, hospitality linen, hotel bedsheets, hotel towels, hotel bedding, bath towels, duvet covers, bathrobes, hospitality textile supplier, bulk hotel linen"
        canonical="https://jorique.in/hospitality"
        image="https://jorique.in/images/jorique-hospitality.jpg"
      />

      <Navbar />

      {/* ─────────────────────────────────────────────────────────────
          01. HERO SECTION (Architectural & Professional)
      ───────────────────────────────────────────────────────────── */}
      <header className="relative pt-28 lg:pt-32 pb-14 sm:pb-20 overflow-hidden border-b border-[#E6DCCB] dark:border-[#2E261F] bg-[linear-gradient(135deg,#FAF7F1_0%,#F3EADB_50%,#E9DCC6_100%)] dark:bg-[linear-gradient(135deg,#161311_0%,#1B1613_50%,#120F0D_100%)]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center pt-6 sm:pt-10">

            {/* Left Narrative Column */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8A6230]/10 dark:bg-[#D4A86A]/10 border border-[#8A6230]/20 dark:border-[#D4A86A]/30">
                <Building2 size={13} className="text-[#8A6230] dark:text-[#D4A86A]" />
                <span className="font-['Jost',sans-serif] text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8A6230] dark:text-[#D4A86A]">
                  JORIQUE HOSPITALITY
                </span>
              </div>

              <div>
                <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-5xl sm:text-6xl lg:text-7xl font-normal text-[#231F1A] dark:text-[#F3EADB] tracking-tight leading-[1.05]">
                  Hospitality
                </h1>
                <p className="font-['Cormorant_Garamond',Georgia,serif] italic text-2xl sm:text-3xl text-[#8A6230] dark:text-[#D4A86A] mt-2 font-medium">
                  Designed for spaces that welcome.
                </p>
              </div>

              <p className="max-w-xl text-[#5F574C] dark:text-[#C4B9A8] text-base sm:text-lg font-['Jost',sans-serif] leading-relaxed">
                Premium textile solutions for hotels, resorts, hospitals and hospitality spaces — from bed and bath linen to bedding and room textiles.
              </p>

              {/* Bulk Supply Message Badge */}
              <div className="p-4 rounded-xl bg-white/70 dark:bg-white/5 border border-[#E6DCCB] dark:border-[#332922] backdrop-blur-xs">
                <p className="text-xs sm:text-[13px] font-medium text-[#231F1A] dark:text-white/90">
                  <span className="text-[#8A6230] dark:text-[#D4A86A] font-bold">Bulk Supply</span> · Requirement-based quotation · Product specifications discussed on enquiry
                </p>
              </div>

              {/* CTA & Direct Contact */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a
                  href="#enquiry-form"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#855331] hover:bg-[#6F4324] dark:bg-[#C6A96B] dark:hover:bg-[#D4B87A] text-white dark:text-black text-xs font-bold tracking-[0.16em] uppercase transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>ENQUIRE FOR BULK SUPPLY</span>
                  <ArrowRight size={14} />
                </a>

                <a
                  href="tel:9919388211"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-[#E6DCCB] dark:border-[#332922] bg-white/60 dark:bg-white/5 hover:border-[#855331] text-[#241F1C] dark:text-white text-xs font-semibold tracking-wider transition-all"
                >
                  <Phone size={14} className="text-[#8A6230] dark:text-[#D4A86A]" />
                  <span>Call / WhatsApp 9919388211</span>
                </a>
              </div>

              {/* Sectors Served Bar */}
              <div className="pt-2 border-t border-[#E6DCCB]/60 dark:border-[#2E261F]">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#786E65] dark:text-white/50 mb-2">
                  WHO IT IS FOR
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-medium text-[#241F1C] dark:text-white/80">
                  {['Hotels', 'Resorts', 'Hospitals', 'Institutions', 'Hospitality Dealers'].map((sector) => (
                    <span
                      key={sector}
                      className="px-3 py-1 rounded-md bg-white/80 dark:bg-white/5 border border-[#E6DCCB] dark:border-[#332922]"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Architectural Imagery Column */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#E6DCCB] dark:border-[#332922] shadow-2xl group bg-black/10">
                <img
                  src="/images/jorique-hospitality.jpg"
                  alt="JORIQUE Hospitality Luxury Resort Suite"
                  className="w-full h-[400px] sm:h-[500px] lg:h-[560px] object-cover object-center group-hover:scale-103 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/80 block">
                    SANCTUARY SPECIFICATION
                  </span>
                  <p className="font-serif text-xl sm:text-2xl font-medium leading-tight">
                    Architectural textiles calibrated for commercial longevity.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          02. PRODUCT RANGE (4 Strong Visual Families)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-5 sm:px-8 max-w-[1240px] mx-auto space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-['Jost',sans-serif] font-semibold tracking-[0.25em] text-[#8A6230] dark:text-[#D4A86A] uppercase block">
            02 / PRODUCT RANGE
          </span>
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#241F1C] dark:text-white tracking-tight">
            Built around the needs of hospitality spaces.
          </h2>
          <p className="text-sm sm:text-base text-[#5C554F] dark:text-white/75 font-light">
            Use four strong visual families rather than a long catalogue. Each family can lead to a deeper product enquiry.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCT_FAMILIES.map((fam) => (
            <div
              key={fam.id}
              className="bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E5DACD] dark:border-[#332922] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#F5EDE3] dark:bg-black/20">
                <img
                  src={fam.image}
                  alt={fam.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-xs text-[10px] font-mono tracking-wider text-[#8A6230] dark:text-[#D4A86A] uppercase font-bold">
                  {fam.tag}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <h3 className="font-['Cormorant_Garamond',Georgia,serif] text-2xl sm:text-3xl font-medium tracking-tight text-[#241F1C] dark:text-white">
                    {fam.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#8A6230] dark:text-[#D4A86A] uppercase tracking-wider">
                    {fam.subitems}
                  </p>
                  <p className="text-sm text-[#5C554F] dark:text-white/75 font-light leading-relaxed pt-1">
                    {fam.description}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectProductFamily(fam.title)}
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-[#855331] dark:text-[#C6A96B] hover:text-[#241F1C] dark:hover:text-white uppercase transition-colors group-hover:underline cursor-pointer"
                  >
                    <span>ENQUIRE ABOUT THIS RANGE →</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Commercial Notice Banner */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#F3EADB] dark:bg-[#1E1915] border border-[#E6DCCB] dark:border-[#332922] text-center space-y-1.5">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#8A6230] dark:text-[#D4A86A]">
            DO NOT SHOW RETAIL PRICES
          </p>
          <p className="text-xs sm:text-sm text-[#5C554F] dark:text-white/80 font-light max-w-3xl mx-auto">
            Hospitality quotations should be prepared according to product specification, quantity, quality, customization and commercial requirements.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          03. SPECIFICATION (Consultative Matrix Table)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-5 sm:px-8 bg-[#FAF6EE] dark:bg-[#15120F] border-y border-[#E8DFD3] dark:border-[#2E261F]">
        <div className="max-w-[1240px] mx-auto space-y-14">

          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-[11px] font-['Jost',sans-serif] font-semibold tracking-[0.25em] text-[#8A6230] dark:text-[#D4A86A] uppercase block">
              03 / SPECIFICATION
            </span>
            <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#241F1C] dark:text-white tracking-tight">
              Every property has different requirements.
            </h2>
            <p className="text-sm sm:text-base text-[#5C554F] dark:text-white/75 font-light">
              This page should feel consultative: the buyer is describing the requirement and JORIQUE responds with suitable options.
            </p>
          </div>

          {/* Matrix Table */}
          <div className="bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E5DACD] dark:border-[#332922] overflow-hidden shadow-sm">
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
                      <td className="p-4 sm:p-5 font-semibold text-[#241F1C] dark:text-white">
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
              {[
                'Custom sizes',
                'Custom colors',
                'Branding / embroidery',
                'Property-specific specifications',
                'Bulk quantities',
                'Product combinations',
                'Repeat supply requirements',
              ].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-[#E5DACD] dark:border-[#332922] text-xs sm:text-sm text-[#241F1C] dark:text-white/85 font-medium shadow-2xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Spec Showcase Image */}
          <div className="rounded-2xl overflow-hidden border border-[#E5DACD] dark:border-[#332922] shadow-md bg-white dark:bg-[#1A1816]">
            <img
              src="/images/hospitality/hospitality-spec-runner.jpg"
              alt="JORIQUE Hospitality Architectural Textile Finishing"
              className="w-full h-auto max-h-[460px] object-cover"
            />
            <div className="p-4 text-center border-t border-[#E8DFD3] dark:border-[#332922]">
              <p className="text-xs text-[#786E65] dark:text-white/60 font-light">
                Photography highlights fabric weight, scale, finishing and how the product lives inside a hospitality environment.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          04. BULK ENQUIRY FORM (Short B2B Commercial Experience)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="enquiry-form"
        className="py-20 lg:py-28 px-5 sm:px-8 max-w-[1040px] mx-auto space-y-12 scroll-mt-20"
      >
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-['Jost',sans-serif] font-semibold tracking-[0.25em] text-[#8A6230] dark:text-[#D4A86A] uppercase block">
            04 / BULK ENQUIRY
          </span>
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#241F1C] dark:text-white tracking-tight">
            Tell us what your property needs.
          </h2>
          <p className="text-sm sm:text-base text-[#5C554F] dark:text-white/75 font-light">
            Keep the form shorter than the Souvenir consultation. Hospitality buyers are describing a commercial requirement, not designing a gift.
          </p>
        </div>

        {/* The Form */}
        <div className="bg-white dark:bg-[#1A1816] p-6 sm:p-10 rounded-2xl border border-[#E5DACD] dark:border-[#332922] shadow-md space-y-8">

          {/* 1. Business Type */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
              <span className="text-[#8A6230] dark:text-[#D4A86A] font-mono">1.</span> Business Type
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
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#855331] text-white dark:bg-[#C6A96B] dark:text-black font-semibold shadow-xs'
                        : 'bg-[#FAF6F0] dark:bg-white/5 text-[#5C554F] dark:text-white/75 border border-[#E8DFD3] dark:border-[#332922] hover:border-[#855331]'
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
              <label htmlFor={propertyInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                <span className="text-[#8A6230] dark:text-[#D4A86A] font-mono">2.</span> Property / Business Name
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
                className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${
                  errors.propertyName ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
                }`}
              />
              {errors.propertyName && <p className="text-xs text-rose-500">{errors.propertyName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                <span className="text-[#8A6230] dark:text-[#D4A86A] font-mono">3.</span> Location (City · State)
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
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${
                    errors.location ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
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
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${
                    errors.location ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
                  }`}
                />
              </div>
              {errors.location && <p className="text-xs text-rose-500">{errors.location}</p>}
            </div>
          </div>

          {/* 4. Products Required (Multi-select) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
              <span className="text-[#8A6230] dark:text-[#D4A86A] font-mono">4.</span> Products Required
              <span className="text-rose-500">*</span>
              <span className="text-[11px] font-normal text-[#786E65] dark:text-white/60 lowercase">(multi-select)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['Bed Linen', 'Bath Linen', 'Room Textiles', 'Bedding & Sleep', 'Mattresses'].map((prod) => {
                const isSelected = formData.productsRequired.includes(prod);
                return (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => toggleProduct(prod)}
                    className={`py-3 px-3 rounded-xl text-xs font-medium text-center border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#855331] text-white dark:bg-[#C6A96B] dark:text-black font-semibold border-transparent shadow-xs'
                        : 'bg-[#FAF6F0] dark:bg-white/5 border-[#E8DFD3] dark:border-[#332922] text-[#5C554F] dark:text-white/80 hover:border-[#855331]'
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
              <label htmlFor={quantityInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                <span className="text-[#8A6230] dark:text-[#D4A86A] font-mono">5.</span> Estimated Quantity
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
                className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${
                  errors.estimatedQuantity ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
                }`}
              />
              {errors.estimatedQuantity && <p className="text-xs text-rose-500">{errors.estimatedQuantity}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor={dateInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                <span className="text-[#8A6230] dark:text-[#D4A86A] font-mono">8.</span> Required By Date
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
                className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${
                  errors.requiredBy ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
                }`}
              />
              {errors.requiredBy && <p className="text-xs text-rose-500">{errors.requiredBy}</p>}
            </div>
          </div>

          {/* 6. Specification / Quality Requirement */}
          <div className="space-y-2">
            <label htmlFor={specInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
              <span className="text-[#8A6230] dark:text-[#D4A86A] font-mono">6.</span> Specification / Quality Requirement
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
              className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${
                errors.specifications ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
              }`}
            />
            {errors.specifications && <p className="text-xs text-rose-500">{errors.specifications}</p>}
          </div>

          {/* 7. Customization / Branding (Optional) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
              <span className="text-[#8A6230] dark:text-[#D4A86A] font-mono">7.</span> Customization / Branding
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
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#855331] text-white dark:bg-[#C6A96B] dark:text-black font-semibold border-transparent shadow-xs'
                        : 'bg-[#FAF6F0] dark:bg-white/5 border-[#E8DFD3] dark:border-[#332922] text-[#5C554F] dark:text-white/80 hover:border-[#855331]'
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
            <label className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
              <span className="text-[#8A6230] dark:text-[#D4A86A] font-mono">9.</span> Contact Details
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
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${
                    errors.name ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
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
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${
                    errors.phone ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
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
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${
                    errors.email ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* 10. Additional Requirement (Optional) */}
          <div className="space-y-2">
            <label htmlFor={notesInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
              <span className="text-[#8A6230] dark:text-[#D4A86A] font-mono">10.</span> Additional Requirement
              <span className="text-[11px] font-normal text-[#786E65] dark:text-white/60 lowercase">(optional)</span>
            </label>
            <textarea
              id={notesInputId}
              rows={2}
              placeholder="Any special packing, delivery timeline, or logistics considerations..."
              value={formData.additionalNotes}
              onChange={(e) => setFormData((p) => ({ ...p, additionalNotes: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none focus:border-[#855331]"
            />
          </div>

          {/* PRICING NOTE & DIRECT ACTIONS */}
          <div className="pt-6 border-t border-[#E8DFD3] dark:border-[#332922] space-y-5">
            {/* Pricing Note */}
            <div className="p-4 rounded-xl bg-[#FAF6EE] dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] text-center">
              <p className="text-xs text-[#5C554F] dark:text-white/80 font-light">
                <strong className="font-semibold text-[#241F1C] dark:text-white">Commercial Pricing Note:</strong>{' '}
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
                className="mt-0.5 rounded text-[#855331] focus:ring-[#855331] accent-[#855331]"
              />
              <span>
                I agree that JORIQUE may contact me regarding commercial supply and quotations for this property.
              </span>
            </label>
            {errors.consent && <p className="text-xs text-rose-500">{errors.consent}</p>}

            {/* Direct Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-[0.14em] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2.5"
              >
                <MessageSquare size={16} />
                <span>WhatsApp My Requirement</span>
              </button>

              <button
                type="button"
                onClick={handleOpenEmail}
                className="w-full py-4 px-6 rounded-xl bg-[#855331] hover:bg-[#6F4324] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black font-bold text-xs uppercase tracking-[0.14em] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2.5"
              >
                <Mail size={16} />
                <span>Email My Requirement</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E8DFD3]/60 dark:border-[#2E2925] text-[11px] text-[#786E65] dark:text-white/60">
              <p className="font-light">
                Auto-generated direct message with prefilled commercial specifications.
              </p>
              <p>
                Direct Concierge:{' '}
                <a href="tel:9919388211" className="text-[#855331] dark:text-[#C6A96B] font-bold hover:underline">
                  9919388211
                </a>{' '}
                ·{' '}
                <a href="mailto:care@jorique.in" className="text-[#855331] dark:text-[#C6A96B] font-bold hover:underline">
                  care@jorique.in
                </a>
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          06. HOW IT WORKS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-5 sm:px-8 bg-[#FAF7F2] dark:bg-[#100E0D] border-t border-[#E8DFD3] dark:border-[#2E261F]">
        <div className="max-w-[1240px] mx-auto space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-[11px] font-['Jost',sans-serif] font-semibold tracking-[0.25em] text-[#8A6230] dark:text-[#D4A86A] uppercase block">
              06 / HOW IT WORKS
            </span>
            <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#241F1C] dark:text-white tracking-tight">
              The Hospitality experience.
            </h2>
            <p className="text-sm sm:text-base text-[#5C554F] dark:text-white/75 font-light">
              From requirement to institutional delivery with complete specification control.
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
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1A1816] border border-[#E5DACD] dark:border-[#332922] space-y-3 shadow-2xs"
              >
                <span className="text-2xl font-serif font-bold text-[#8A6230] dark:text-[#D4A86A]">
                  {st.step}
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#241F1C] dark:text-white">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C554F] dark:text-white/75 font-light leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Key Distinction Note */}
          <div className="p-6 rounded-2xl bg-[#F3EADB]/60 dark:bg-white/5 border border-[#E6DCCB] dark:border-[#332922] text-center max-w-3xl mx-auto">
            <p className="text-xs text-[#786E65] dark:text-white/70 font-light leading-relaxed">
              <strong className="text-[#241F1C] dark:text-white font-medium">Key distinction from JORIQUE Souvenir:</strong>{' '}
              Souvenir is an occasion-led gifting journey. Hospitality is a professional B2B supply journey with architectural, commercial, and specification-led supply agreements.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          07. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
