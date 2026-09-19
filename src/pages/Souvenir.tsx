import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Package,
  Heart,
  Phone,
  Mail,
  Copy,
  Check,
  Calendar,
  MapPin,
  Building,
  User,
  MessageSquare,
  ArrowRight,
  Send,
  SlidersHorizontal,
  Leaf,
  Pencil,
  Home,
  Bed,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// Occasion options
const OCCASIONS = [
  'Wedding',
  'Return Gift',
  'Corporate',
  'Diwali',
  'Anniversary',
  'Housewarming',
  'Family Celebration',
  'Personal Gifting',
  'Other',
];

// Personalization tags
const PERSONALIZATION_OPTIONS = [
  'Name / Couple',
  'Company Logo',
  'Event',
  'Date',
  'Message',
  'Theme',
  'Colors',
  'Custom Artwork',
];

// Bedding Gift Sets (Strictly matching design mockup)
const BEDDING_SETS = [
  {
    id: 'bedding-3pc',
    title: '3 Piece Set',
    badge: '3 piece set',
    formattedIncludes: '1 Bedsheet<br />+ 2 Pillow Covers',
    includes: '1 Bedsheet + 2 Pillow Covers',
    description: 'A perfect everyday gifting choice.',
    image: '/images/souvenir-set-bedding-3pc.png',
  },
  {
    id: 'bedding-4pc',
    title: '4 Piece Set',
    badge: '4 piece set',
    formattedIncludes: '3 Piece Set<br />+ 1 Comforter',
    includes: '3 Piece Set + 1 Comforter',
    description: 'Added comfort for a complete feel.',
    image: '/images/souvenir-set-bedding-4pc.png',
  },
  {
    id: 'bedding-5pc',
    title: '5 Piece Set',
    badge: '5 piece set',
    formattedIncludes: '3 Piece Set<br />+ 2 Cushion Covers',
    includes: '3 Piece Set + 2 Cushion Covers',
    description: 'A stylish and useful gifting set.',
    image: '/images/souvenir-set-bedding-5pc.png',
  },
  {
    id: 'bedding-6pc',
    title: '6 Piece Set',
    badge: '6 piece set',
    formattedIncludes: '5 Piece Set<br />+ 1 Comforter',
    includes: '5 Piece Set + 1 Comforter',
    description: 'A complete home gifting experience.',
    image: '/images/souvenir-set-bedding-6pc.png',
  },
];

// Towel Gift Sets (Strictly matching design mockup)
const TOWEL_SETS = [
  {
    id: 'towel-2pc',
    title: '2 Piece Set',
    badge: '2 piece set',
    formattedIncludes: '2 Bath Towels<br /><span class="invisible select-none">+ 0</span>',
    includes: '2 Bath Towels',
    description: 'A thoughtful and practical gift.',
    image: '/images/souvenir-set-towel-2pc.png',
  },
  {
    id: 'towel-4pc',
    title: '4 Piece Set',
    badge: '4 piece set',
    formattedIncludes: '2 Piece Set<br />+ 2 Hand Towels',
    includes: '2 Piece Set + 2 Hand Towels',
    description: 'Everyday essentials for every home.',
    image: '/images/souvenir-set-towel-4pc.png',
  },
  {
    id: 'towel-6pc',
    title: '6 Piece Set',
    badge: '6 piece set',
    formattedIncludes: '4 Piece Set<br />+ 2 Face Towels',
    includes: '4 Piece Set + 2 Face Towels',
    description: 'A complete wellness gifting set.',
    image: '/images/souvenir-set-towel-6pc.png',
  },
];

// Delicate Lotus emblem matching design mockup
function LotusIcon({ className = 'w-8 h-8 text-[#9A643E]' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 5C14 10.5 13 17.5 16 25C19 17.5 18 10.5 16 5Z" />
      <path d="M16 12.5C11.5 14.5 7.5 19 8.5 24.5C11.2 25 14 23.5 16 21.8" />
      <path d="M16 12.5C20.5 14.5 24.5 19 23.5 24.5C20.8 25 18 23.5 16 21.8" />
      <path d="M16 18C10.5 19.8 6 21.8 5 24.5C8.8 25.8 12.5 25.5 16 24.5" />
      <path d="M16 18C21.5 19.8 26 21.8 27 24.5C23.2 25.8 19.5 25.5 16 24.5" />
    </svg>
  );
}

export default function Souvenir() {
  const occasionInputId = useId();
  const quantityInputId = useId();
  const setInputId = useId();
  const ideaInputId = useId();
  const dateInputId = useId();
  const deliveryInputId = useId();
  const nameInputId = useId();
  const companyInputId = useId();
  const phoneInputId = useId();
  const emailInputId = useId();
  const consentInputId = useId();

  // Form State
  const [formData, setFormData] = useState({
    occasion: 'Wedding',
    quantity: '50',
    category: 'Bedding Sets' as 'Bedding Sets' | 'Towel Sets' | 'Both',
    set: '3 Piece Set',
    customSet: '',
    personalizations: ['Name / Couple', 'Custom Artwork'] as string[],
    idea: '',
    date: '',
    location: '',
    name: '',
    company: '',
    phone: '',
    email: '',
    consent: true,
  });

  // Errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Dynamic set options based on category
  const getSetOptions = () => {
    if (formData.category === 'Bedding Sets') {
      return [
        '3 Piece Set',
        '4 Piece Set',
        '5 Piece Set',
        '6 Piece Set',
        'Custom Combination',
      ];
    }
    if (formData.category === 'Towel Sets') {
      return [
        '2 Piece Set',
        '4 Piece Set',
        '6 Piece Set',
        'Custom Combination',
      ];
    }
    return [
      'Bedding + Towel Full Suite',
      'Bedding (4pc) + Towel (2pc)',
      'Custom Combination',
    ];
  };

  const handleCategoryChange = (cat: 'Bedding Sets' | 'Towel Sets' | 'Both') => {
    let defaultSet = '3 Piece Set';
    if (cat === 'Towel Sets') defaultSet = '2 Piece Set';
    if (cat === 'Both') defaultSet = 'Bedding + Towel Full Suite';

    setFormData((prev) => ({
      ...prev,
      category: cat,
      set: defaultSet,
    }));
  };

  const togglePersonalization = (item: string) => {
    setFormData((prev) => {
      const exists = prev.personalizations.includes(item);
      return {
        ...prev,
        personalizations: exists
          ? prev.personalizations.filter((p) => p !== item)
          : [...prev.personalizations, item],
      };
    });
  };

  const scrollToForm = (preselectCategory?: 'Bedding Sets' | 'Towel Sets' | 'Both', preselectSet?: string) => {
    if (preselectCategory) {
      setFormData((prev) => ({
        ...prev,
        category: preselectCategory,
        set: preselectSet || prev.set,
      }));
    }
    const elem = document.getElementById('enquiry-form');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate Email Content
  const getEmailSubject = () => {
    const occ = formData.occasion || '[Occasion]';
    const qty = formData.quantity || '[Quantity]';
    return `JORIQUE Souvenir Bulk Order Enquiry — ${occ} — ${qty} Pieces`;
  };

  const getEmailBody = () => {
    const occ = formData.occasion || '[Occasion]';
    const qty = formData.quantity || '[Number of Pieces]';
    const cat = formData.category || '[Bedding / Towel / Both]';
    const chosenSet =
      formData.set === 'Custom Combination' && formData.customSet
        ? `Custom Combination (${formData.customSet})`
        : formData.set || '[Selected Set / Custom Combination]';
    const personalization =
      formData.personalizations.length > 0
        ? formData.personalizations.join(', ')
        : '[Name / Logo / Event / Date / Message / Theme / Colors / Custom Artwork]';
    const details = formData.idea.trim() || "[Customer's description / requirements]";
    const reqDate = formData.date || '[Date]';
    const loc = formData.location.trim() || '[City / State]';
    const custName = formData.name.trim() || '[Customer Name]';
    const comp = formData.company.trim() || '[Company Name]';
    const ph = formData.phone.trim() || '[Phone Number]';
    const em = formData.email.trim() || '[Email Address]';

    return `Dear JORIQUE Team,

I would like to enquire about the JORIQUE Souvenir collection for a bulk order.

Occasion: ${occ}
Quantity: ${qty}
Product Category: ${cat}
Set: ${chosenSet}

Personalization:
${personalization}

Additional Details:
${details}

Required By: ${reqDate}
Delivery Location: ${loc}

Name: ${custName}
Company / Organization: ${comp}
Phone / WhatsApp: ${ph}
Email: ${em}

I look forward to your response with the next steps and quotation.

Warm regards,
${custName}`;
  };

  // Generate WhatsApp Content
  const getWhatsAppBody = () => {
    const occ = formData.occasion || '[Occasion]';
    const qty = formData.quantity || '[Number of Pieces]';
    const cat = formData.category || '[Bedding / Towel / Both]';
    const chosenSet =
      formData.set === 'Custom Combination' && formData.customSet
        ? `Custom Combination (${formData.customSet})`
        : formData.set || '[Selected Set / Custom Combination]';
    const personalization =
      formData.personalizations.length > 0
        ? formData.personalizations.join(', ')
        : '[Name / Logo / Event / Date / Message / Theme / Colors / Custom Artwork]';
    const details = formData.idea.trim() || "[Customer's description / requirements]";
    const reqDate = formData.date || '[Date]';
    const loc = formData.location.trim() || '[City / State]';
    const custName = formData.name.trim() || '[Customer Name]';
    const comp = formData.company.trim() || '[Company Name]';
    const ph = formData.phone.trim() || '[Phone Number]';
    const em = formData.email.trim() || '[Email Address]';

    return `Hello JORIQUE Team,

I would like to enquire about the JORIQUE Souvenir collection for a bulk order.

Occasion: ${occ}
Quantity: ${qty}
Product Category: ${cat}
Set: ${chosenSet}

Personalization:
${personalization}

Additional Details:
${details}

Required By: ${reqDate}
Delivery Location: ${loc}

Name: ${custName}
Company / Organization: ${comp}
Phone / WhatsApp: ${ph}
Email: ${em}

Please share the available options and quotation.

Thank you!`;
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const qty = parseInt(formData.quantity, 10);
    if (!formData.quantity || isNaN(qty) || qty < 25) {
      newErrors.quantity = 'Minimum order quantity is 25 pieces.';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!formData.date) {
      newErrors.date = 'Please specify when you need the order.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please enter your city / state.';
    }

    if (!formData.phone.trim() || !/^[0-9+() -]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (10 digits).';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.consent) {
      newErrors.consent = 'Please confirm consent to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenWhatsApp = () => {
    if (!validateForm()) {
      return;
    }
    const text = encodeURIComponent(getWhatsAppBody());
    window.open(`https://wa.me/919919388211?text=${text}`, '_blank');
  };

  const handleOpenEmail = () => {
    if (!validateForm()) {
      return;
    }
    const subject = encodeURIComponent(getEmailSubject());
    const body = encodeURIComponent(getEmailBody());
    window.location.href = `mailto:care@jorique.in?subject=${subject}&body=${body}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenWhatsApp();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#100E0D] text-[#241F1C] dark:text-[#FCFAF7] transition-colors duration-500 font-sans selection:bg-[#855331]/20">
      {/* SEO METADATA */}
      <SEO
        title="JORIQUE Souvenir | Personalized Bedding & Towel Gift Sets"
        description="Discover JORIQUE Souvenir: thoughtfully crafted personalized bedding and towel gifting sets for weddings, corporate gifting, festive celebrations and bulk orders. Minimum 25 pieces."
        keywords="JORIQUE Souvenir, personalized gift sets, bulk gifting, wedding gifts, corporate gifting, bedding gift sets, towel gift sets, personalized gifts"
        canonical="https://jorique.in/souvenir"
        image="https://jorique.in/images/souvenir-hero-mockup.jpg"
      />

      <Navbar />

      {/* ─────────────────────────────────────────────────────────────
          01. HERO SECTION (Exact Match to User HTML/CSS Specification)
      ───────────────────────────────────────────────────────────── */}
      <header className="relative pt-28 lg:pt-32 pb-4 sm:pb-6 overflow-hidden border-b border-[#e6dccb] dark:border-[#2e261f] bg-[linear-gradient(100deg,#faf6ee_0%,#f3eadb_55%,#e9dcc6_100%)] dark:bg-[linear-gradient(100deg,#181411_0%,#1c1713_55%,#15120f_100%)]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_1fr] gap-6 lg:gap-8 items-center pt-8 sm:pt-10 lg:pt-14 pb-9">

            {/* Left Content */}
            <div>
              <p className="font-['Jost',sans-serif] text-[12px] tracking-[0.16em] uppercase text-[#a67c45] font-medium">
                Personalized bedding &amp; towel gift collection
              </p>
              <p className="font-mainlogo text-[34px] sm:text-[38px] tracking-[0.08em] font-medium leading-none mt-[18px] text-[#231f1a] dark:text-[#f3eadb]">
                JORIQUE
              </p>
              <h1 className="font-['Cormorant_Garamond',Georgia,serif] italic text-[64px] sm:text-[88px] leading-[0.95] text-[#8a6230] dark:text-[#d4a86a] font-medium tracking-[-0.01em]">
                Souvenir
              </h1>
              <p className="font-['Cormorant_Garamond',Georgia,serif] text-[24px] sm:text-[30px] font-semibold mt-[26px] leading-[1.2] text-[#231f1a] dark:text-[#f3eadb]">
                Your occasion. Your identity. Your gift.
              </p>
              <p className="max-w-[430px] text-[#5f574c] dark:text-[#c4b9a8] mt-[14px] text-[15px] sm:text-[16px] font-['Jost',sans-serif] leading-[1.55]">
                Thoughtfully crafted bedding and towel gifting sets for weddings, corporate gifting, festive celebrations and meaningful moments.
              </p>
              <div className="inline-block mt-[24px] bg-[rgba(255,253,249,0.85)] dark:bg-[#201a15] border border-[#e6dccb] dark:border-[#3a3227] rounded-[6px] px-[20px] py-[12px]">
                <b className="block text-[14px] sm:text-[15px] tracking-[0.06em] text-[#231f1a] dark:text-white font-['Jost',sans-serif] font-semibold">
                  BULK ORDERS · MINIMUM 25 PIECES
                </b>
                <span className="text-[12px] sm:text-[13px] text-[#5f574c] dark:text-[#a89e90] font-['Jost',sans-serif]">
                  Prices will vary according to your quantity and quality.
                </span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => scrollToForm()}
                  className="inline-flex items-center gap-2 mt-[22px] bg-[#8a6230] hover:bg-[#6f4e22] text-white font-medium tracking-[0.06em] text-[14px] px-[26px] py-[14px] rounded-[4px] transition-colors font-['Jost',sans-serif] cursor-pointer shadow-xs"
                >
                  START YOUR ENQUIRY →
                </button>
              </div>
            </div>

            {/* Right Hero Art / Image Showcase */}
            <div className="w-full flex items-center justify-center p-1 sm:p-2">
              <img
                src="/images/costume pack.jpg"
                alt="JORIQUE Souvenir personalized bedding and towel gift collection presentation box"
                className="w-full max-h-[440px] object-contain rounded-md"
              />
            </div>

          </div>

          {/* Trust Row */}
          <div className="border-t border-[#e6dccb]/70 dark:border-[#2e261f]">
            <ul className="flex flex-wrap gap-x-[34px] gap-y-[12px] py-[18px] pb-[28px]">
              <li className="flex items-center gap-[10px] text-[13px] text-[#5f574c] dark:text-[#b8ad9e] font-['Jost',sans-serif]">
                <svg viewBox="0 0 32 32" className="w-[28px] h-[28px] stroke-[#a67c45] fill-none stroke-[1.4] stroke-linecap-round stroke-linejoin-round shrink-0">
                  <path d="M6 26 C6 12 14 6 26 6 C26 18 18 26 6 26Z M6 26 L18 14" />
                </svg>
                <span>Premium Quality<br className="hidden sm:inline" /> Fabrics</span>
              </li>
              <li className="flex items-center gap-[10px] text-[13px] text-[#5f574c] dark:text-[#b8ad9e] font-['Jost',sans-serif]">
                <svg viewBox="0 0 32 32" className="w-[28px] h-[28px] stroke-[#a67c45] fill-none stroke-[1.4] stroke-linecap-round stroke-linejoin-round shrink-0">
                  <path d="M6 26 l2-7 14-14 5 5-14 14z M20 7l5 5" />
                </svg>
                <span>Fully Customizable</span>
              </li>
              <li className="flex items-center gap-[10px] text-[13px] text-[#5f574c] dark:text-[#b8ad9e] font-['Jost',sans-serif]">
                <svg viewBox="0 0 32 32" className="w-[28px] h-[28px] stroke-[#a67c45] fill-none stroke-[1.4] stroke-linecap-round stroke-linejoin-round shrink-0">
                  <rect x="5" y="12" width="22" height="15" /><path d="M4 8h24v4H4z M16 8v19 M16 8c-3-5-8-4-6-1 M16 8c3-5 8-4 6-1" />
                </svg>
                <span>Elegant Packaging</span>
              </li>
              <li className="flex items-center gap-[10px] text-[13px] text-[#5f574c] dark:text-[#b8ad9e] font-['Jost',sans-serif]">
                <svg viewBox="0 0 32 32" className="w-[28px] h-[28px] stroke-[#a67c45] fill-none stroke-[1.4] stroke-linecap-round stroke-linejoin-round shrink-0">
                  <path d="M16 27 C4 18 5 8 11 8 c3 0 5 2 5 4 0-2 2-4 5-4 6 0 7 10-5 19z" />
                </svg>
                <span>Thoughtful Gifting</span>
              </li>
            </ul>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          02. SOUVENIR EXPERIENCE SECTION (Exact Match to User HTML/CSS Specification)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-[44px] pb-[34px] bg-[#faf7f1] dark:bg-[#14100D]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-[18px] lg:gap-[40px] items-end">
            <div>
              <p className="font-['Jost',sans-serif] text-[12px] tracking-[0.16em] uppercase text-[#a67c45] font-medium">
                The JORIQUE Souvenir experience
              </p>
              <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium text-[32px] sm:text-[40px] leading-[1.1] mt-[8px] text-[#231f1a] dark:text-[#f3eadb]">
                Made for your moments. Designed around you.
              </h2>
            </div>
            <p className="text-[14.5px] text-[#5f574c] dark:text-[#c4b9a8] font-['Jost',sans-serif] leading-[1.55]">
              A premium gift collection where your identity becomes the visual hero. Customize names, logos, event details, dates, messages, colors and artwork, while JORIQUE remains the quiet signature of quality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-[34px] gap-y-[22px] sm:gap-y-[22px] lg:gap-y-0">
            {/* Pillar 1 */}
            <div className="flex gap-[16px] py-[6px] lg:pr-[22px]">
              <svg viewBox="0 0 44 44" className="w-[44px] h-[44px] shrink-0 stroke-[#a67c45] fill-none stroke-[1.3] stroke-linecap-round stroke-linejoin-round">
                <circle cx="22" cy="15" r="7" /><path d="M8 38c0-8 6-13 14-13s14 5 14 13z" />
              </svg>
              <div>
                <h3 className="font-['Jost',sans-serif] text-[12px] tracking-[0.14em] uppercase font-semibold text-[#231f1a] dark:text-white">
                  Personalized
                </h3>
                <p className="font-['Jost',sans-serif] text-[13.5px] text-[#5f574c] dark:text-[#a89e90] mt-[4px] leading-[1.4]">
                  Your name, logo, event or message.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex gap-[16px] py-[6px] sm:pl-[22px] lg:px-[22px] sm:border-l border-[#e6dccb] dark:border-[#2e261f]">
              <svg viewBox="0 0 44 44" className="w-[44px] h-[44px] shrink-0 stroke-[#a67c45] fill-none stroke-[1.3] stroke-linecap-round stroke-linejoin-round">
                <path d="M6 22 22 8l16 14M10 20v18h24V20M18 38V27h8v11" />
              </svg>
              <div>
                <h3 className="font-['Jost',sans-serif] text-[12px] tracking-[0.14em] uppercase font-semibold text-[#231f1a] dark:text-white">
                  Useful
                </h3>
                <p className="font-['Jost',sans-serif] text-[13.5px] text-[#5f574c] dark:text-[#a89e90] mt-[4px] leading-[1.4]">
                  Premium home textiles for everyday living.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex gap-[16px] py-[6px] lg:px-[22px] lg:border-l border-[#e6dccb] dark:border-[#2e261f]">
              <svg viewBox="0 0 44 44" className="w-[44px] h-[44px] shrink-0 stroke-[#a67c45] fill-none stroke-[1.3] stroke-linecap-round stroke-linejoin-round">
                <rect x="7" y="17" width="30" height="21" /><path d="M5 12h34v5H5z M22 12v26 M22 12c-4-7-11-5-8-1 M22 12c4-7 11-5 8-1" />
              </svg>
              <div>
                <h3 className="font-['Jost',sans-serif] text-[12px] tracking-[0.14em] uppercase font-semibold text-[#231f1a] dark:text-white">
                  Presentable
                </h3>
                <p className="font-['Jost',sans-serif] text-[13.5px] text-[#5f574c] dark:text-[#a89e90] mt-[4px] leading-[1.4]">
                  A complete gifting experience.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex gap-[16px] py-[6px] sm:pl-[22px] lg:pl-[22px] sm:border-l border-[#e6dccb] dark:border-[#2e261f]">
              <svg viewBox="0 0 44 44" className="w-[44px] h-[44px] shrink-0 stroke-[#a67c45] fill-none stroke-[1.3] stroke-linecap-round stroke-linejoin-round">
                <path d="M22 36c-8-4-10-12-6-20 3 4 5 8 6 12 1-4 3-8 6-12 4 8 2 16-6 20z M22 36c-14 0-18-8-16-14 6 0 12 3 16 14z M22 36c14 0 18-8 16-14-6 0-12 3-16 14z" />
              </svg>
              <div>
                <h3 className="font-['Jost',sans-serif] text-[12px] tracking-[0.14em] uppercase font-semibold text-[#231f1a] dark:text-white">
                  Thoughtfully branded
                </h3>
                <p className="font-['Jost',sans-serif] text-[13.5px] text-[#5f574c] dark:text-[#a89e90] mt-[4px] leading-[1.4]">
                  Your identity leads, JORIQUE appears subtly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          03. CHOOSE YOUR SET SECTION (Exact Match to User HTML/CSS Specification)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-[34px] pb-[60px] border-t border-[#e6dccb] dark:border-[#2e261f] bg-[#faf7f1] dark:bg-[#12100E]" id="sets">
        <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
          <div className="flex justify-between items-end gap-[30px] flex-wrap">
            <div>
              <p className="font-['Jost',sans-serif] text-[12px] tracking-[0.16em] uppercase text-[#a67c45] font-medium">
                Choose your set
              </p>
              <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium text-[32px] sm:text-[40px] leading-[1.1] mt-[8px] text-[#231f1a] dark:text-[#f3eadb]">
                Thoughtfully curated sets for every occasion.
              </h2>
            </div>
            <p className="max-w-[300px] text-[13.5px] text-[#5f574c] dark:text-[#c4b9a8] font-['Jost',sans-serif] leading-[1.55]">
              These are our suggested combinations. We can also create a custom set based on your{' '}
              <button
                type="button"
                onClick={() => scrollToForm('Both', 'Custom Combination')}
                className="text-[#231f1a] dark:text-white underline hover:text-[#8a6230] cursor-pointer font-medium"
              >
                specific requirements
              </button>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4 sm:gap-5 mt-[26px]">
            {/* BEDDING GROUP */}
            <div className="bg-[#f6f0e4] dark:bg-[#1a1612] border border-[#e6dccb] dark:border-[#2e261f] rounded-[8px] p-[18px_14px_14px] sm:p-[20px_16px_16px]">
              <h3 className="font-['Jost',sans-serif] text-[15px] tracking-[0.16em] uppercase font-semibold p-[0_6px_16px] flex items-center gap-[12px] text-[#231f1a] dark:text-white">
                <svg viewBox="0 0 28 28" className="w-[28px] h-[28px] stroke-[#a67c45] fill-none stroke-[1.4] shrink-0">
                  <path d="M3 21V8 M3 17h22v4 M25 17v-4c0-3-2-4-5-4H10v8" />
                </svg>
                Bedding gift sets
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {BEDDING_SETS.map((set) => {
                  const isSelected = formData.category === 'Bedding Sets' && formData.set === set.title;
                  return (
                    <div
                      key={set.id}
                      onClick={() => scrollToForm('Bedding Sets', set.title)}
                      className={`bg-[#fffdf9] dark:bg-[#201a16] border rounded-[6px] p-[14px_8px] sm:p-[16px_10px] text-center flex flex-col items-center justify-between cursor-pointer transition-all duration-200 hover:shadow-md group relative ${isSelected
                        ? 'border-[#8a6230] ring-2 ring-[#8a6230]/30 shadow-sm'
                        : 'border-[#efe6d6] dark:border-[#352c23] hover:border-[#a67c45]'
                        }`}
                    >
                      <div className="font-['Jost',sans-serif] text-[11.5px] tracking-[0.14em] uppercase font-semibold text-[#8a6230] dark:text-[#d4a86a]">
                        {set.badge}
                      </div>

                      <div className="w-full aspect-square my-3 overflow-hidden rounded-md bg-[#FAF5EE] dark:bg-black/20 relative">
                        <img
                          src={set.image}
                          alt={set.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="mt-auto w-full">
                        <strong
                          className="block font-['Cormorant_Garamond',Georgia,serif] text-[16.5px] font-semibold leading-[1.25] text-[#231f1a] dark:text-white"
                          dangerouslySetInnerHTML={{ __html: set.formattedIncludes }}
                        />
                        <span className="block font-['Jost',sans-serif] text-[12.5px] text-[#5f574c] dark:text-[#a89e90] mt-[8px] leading-[1.35]">
                          {set.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TOWEL GROUP */}
            <div className="bg-[#f6f0e4] dark:bg-[#1a1612] border border-[#e6dccb] dark:border-[#2e261f] rounded-[8px] p-[18px_14px_14px] sm:p-[20px_16px_16px]">
              <h3 className="font-['Jost',sans-serif] text-[15px] tracking-[0.16em] uppercase font-semibold p-[0_6px_16px] flex items-center gap-[12px] text-[#231f1a] dark:text-white">
                <svg viewBox="0 0 28 28" className="w-[28px] h-[28px] stroke-[#a67c45] fill-none stroke-[1.4] shrink-0">
                  <rect x="4" y="9" width="20" height="14" rx="2" /><path d="M8 9V5h12v4 M4 15h20" />
                </svg>
                Towel gift sets
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {TOWEL_SETS.map((set) => {
                  const isSelected = formData.category === 'Towel Sets' && formData.set === set.title;
                  return (
                    <div
                      key={set.id}
                      onClick={() => scrollToForm('Towel Sets', set.title)}
                      className={`bg-[#fffdf9] dark:bg-[#201a16] border rounded-[6px] p-[14px_8px] sm:p-[16px_10px] text-center flex flex-col items-center justify-between cursor-pointer transition-all duration-200 hover:shadow-md group relative ${isSelected
                        ? 'border-[#8a6230] ring-2 ring-[#8a6230]/30 shadow-sm'
                        : 'border-[#efe6d6] dark:border-[#352c23] hover:border-[#a67c45]'
                        }`}
                    >
                      <div className="font-['Jost',sans-serif] text-[11.5px] tracking-[0.14em] uppercase font-semibold text-[#8a6230] dark:text-[#d4a86a]">
                        {set.badge}
                      </div>

                      <div className="w-full aspect-square my-3 overflow-hidden rounded-md bg-[#FAF5EE] dark:bg-black/20 relative">
                        <img
                          src={set.image}
                          alt={set.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="mt-auto w-full">
                        <strong
                          className="block font-['Cormorant_Garamond',Georgia,serif] text-[16.5px] font-semibold leading-[1.25] text-[#231f1a] dark:text-white"
                          dangerouslySetInnerHTML={{ __html: set.formattedIncludes }}
                        />
                        <span className="block font-['Jost',sans-serif] text-[12.5px] text-[#5f574c] dark:text-[#a89e90] mt-[8px] leading-[1.35]">
                          {set.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Custom Set Note Banner */}
          <div className="mt-[20px] p-[16px_20px] rounded-[8px] bg-[#f6f0e4] dark:bg-[#1a1612] border border-[#e6dccb] dark:border-[#2e261f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="text-[#8a6230] dark:text-[#d4a86a] shrink-0" size={18} />
              <p className="text-[13px] sm:text-[13.5px] text-[#5f574c] dark:text-[#c4b9a8] font-['Jost',sans-serif] leading-relaxed">
                Designs &amp; quality may vary by occasion and requirement. For available designs, pricing and customization details, WhatsApp or email us.
              </p>
            </div>
            <button
              onClick={() => scrollToForm('Both', 'Custom Combination')}
              className="px-4 py-2 rounded-[4px] bg-[#8a6230] hover:bg-[#6f4e22] text-white text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors shrink-0 cursor-pointer font-['Jost',sans-serif] whitespace-nowrap"
            >
              Request Custom Combination
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          04. BULK ORDER ENQUIRY
      ───────────────────────────────────────────────────────────── */}
      <section
        id="enquiry-form"
        className="py-16 lg:py-24 px-5 sm:px-8 lg:px-12 bg-[#FAF7F2] dark:bg-[#14100D] border-b border-[#E8DFD3] dark:border-[#2E2925] scroll-mt-20"
      >
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-[11px] font-sans font-medium tracking-[0.25em] text-[#9A643E] dark:text-[#D4AF37] uppercase block">
              BULK ORDER ENQUIRY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#241F1C] dark:text-white tracking-tight">
              Tell us what you're planning.
            </h2>
            <p className="text-sm text-[#5C554F] dark:text-white/75 font-light">
              Fill in your details below and click directly to send via WhatsApp or Email with your customized message prefilled.
            </p>
          </div>

          {/* Centered Form */}
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleFormSubmit}
              className="bg-white dark:bg-[#1A1816] p-6 sm:p-10 rounded-2xl border border-[#E5DACD] dark:border-[#332922] shadow-sm space-y-7"
            >

              {/* 1. Occasion */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor={occasionInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                    <span className="text-[#9A643E] font-mono">1.</span> What is the occasion?
                    <span className="text-rose-500">*</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((occ) => {
                    const isSelected = formData.occasion === occ;
                    return (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, occasion: occ }))}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${isSelected
                          ? 'bg-[#855331] text-white dark:bg-[#C6A96B] dark:text-black font-semibold shadow-xs'
                          : 'bg-[#FAF6F0] dark:bg-white/5 text-[#5C554F] dark:text-white/75 border border-[#E8DFD3] dark:border-[#332922] hover:border-[#855331]'
                          }`}
                      >
                        {occ}
                      </button>
                    );
                  })}
                </div>
                {formData.occasion === 'Other' && (
                  <input
                    id={occasionInputId}
                    type="text"
                    placeholder="Please specify occasion"
                    value={formData.occasion === 'Other' ? '' : formData.occasion}
                    onChange={(e) => setFormData((p) => ({ ...p, occasion: e.target.value }))}
                    className="w-full mt-2 px-4 py-2.5 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none focus:border-[#855331]"
                  />
                )}
              </div>

              {/* 2. Quantity (min 25) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={quantityInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                    <span className="text-[#9A643E] font-mono">2.</span> How many pieces do you need?
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#9A643E] dark:text-[#C6A96B]">Minimum: 25 pieces</span>
                </div>
                <input
                  id={quantityInputId}
                  type="number"
                  min="25"
                  value={formData.quantity}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, quantity: e.target.value }));
                    if (errors.quantity) {
                      setErrors((prev) => ({ ...prev, quantity: '' }));
                    }
                  }}
                  placeholder="Enter quantity (min 25)"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-sm text-[#241F1C] dark:text-white focus:outline-none transition-colors ${errors.quantity
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
                    }`}
                />
                {errors.quantity && (
                  <p className="text-xs text-rose-500 font-medium">{errors.quantity}</p>
                )}
              </div>

              {/* 3. Product Category */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                  <span className="text-[#9A643E] font-mono">3.</span> Which product category are you interested in?
                  <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Bedding Sets', 'Towel Sets', 'Both'] as const).map((cat) => {
                    const isSelected = formData.category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryChange(cat)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer text-center ${isSelected
                          ? 'bg-[#855331] text-white dark:bg-[#C6A96B] dark:text-black shadow-xs'
                          : 'bg-[#FAF6F0] dark:bg-white/5 text-[#5C554F] dark:text-white/70 border border-[#E8DFD3] dark:border-[#332922] hover:border-[#855331]'
                          }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Which set are you considering? */}
              <div className="space-y-2">
                <label htmlFor={setInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                  <span className="text-[#9A643E] font-mono">4.</span> Which set are you considering?
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  id={setInputId}
                  value={formData.set}
                  onChange={(e) => setFormData((p) => ({ ...p, set: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#241F1C] dark:text-white focus:outline-none focus:border-[#855331]"
                >
                  {getSetOptions().map((opt) => (
                    <option key={opt} value={opt} className="bg-white dark:bg-[#1A1816]">
                      {opt}
                    </option>
                  ))}
                </select>

                {formData.set === 'Custom Combination' && (
                  <input
                    type="text"
                    placeholder="Describe your custom combination (e.g. 1 Bed sheet + 2 Bath towels)"
                    value={formData.customSet}
                    onChange={(e) => setFormData((p) => ({ ...p, customSet: e.target.value }))}
                    className="w-full mt-2 px-4 py-2.5 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-white dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none focus:border-[#855331]"
                  />
                )}
              </div>

              {/* 5. What would you like to personalize? */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                    <span className="text-[#9A643E] font-mono">5.</span> What would you like to personalize?
                  </label>
                  <span className="text-[11px] text-[#786E65] dark:text-white/50">Optional · Multi-select</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PERSONALIZATION_OPTIONS.map((item) => {
                    const isChecked = formData.personalizations.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => togglePersonalization(item)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${isChecked
                          ? 'bg-[#855331] text-white dark:bg-[#C6A96B] dark:text-black font-semibold'
                          : 'bg-[#FAF6F0] dark:bg-white/5 text-[#5C554F] dark:text-white/70 border border-[#E8DFD3] dark:border-[#332922] hover:border-[#855331]'
                          }`}
                      >
                        {isChecked && <Check size={12} />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Tell us about your idea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={ideaInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                    <span className="text-[#9A643E] font-mono">6.</span> Tell us about your idea
                  </label>
                  <span className="text-[11px] text-[#786E65] dark:text-white/50">Optional</span>
                </div>
                <textarea
                  id={ideaInputId}
                  rows={3}
                  placeholder="Share names, message, theme, colors, artwork or any special requirements..."
                  value={formData.idea}
                  onChange={(e) => setFormData((p) => ({ ...p, idea: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-[#FAF7F2] dark:bg-[#100E0D] text-xs sm:text-sm text-[#241F1C] dark:text-white focus:outline-none focus:border-[#855331] resize-none"
                />
              </div>

              {/* 7 & 8: Required By Date & Delivery Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor={dateInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                    <span className="text-[#9A643E] font-mono">7.</span> When do you need it?
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id={dateInputId}
                      type="date"
                      value={formData.date}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, date: e.target.value }));
                        if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${errors.date ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
                        }`}
                    />
                    <Calendar size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                  </div>
                  {errors.date && <p className="text-xs text-rose-500">{errors.date}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor={deliveryInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                    <span className="text-[#9A643E] font-mono">8.</span> Where should we deliver?
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id={deliveryInputId}
                      type="text"
                      placeholder="City / State"
                      value={formData.location}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, location: e.target.value }));
                        if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${errors.location ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
                        }`}
                    />
                    <MapPin size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                  </div>
                  {errors.location && <p className="text-xs text-rose-500">{errors.location}</p>}
                </div>
              </div>

              {/* 9 & 10: Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor={nameInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                    <span className="text-[#9A643E] font-mono">9.</span> Your Name
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id={nameInputId}
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, name: e.target.value }));
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${errors.name ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
                        }`}
                    />
                    <User size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                  </div>
                  {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor={companyInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                      <span className="text-[#9A643E] font-mono">10.</span> Company / Org
                    </label>
                    <span className="text-[11px] text-[#786E65] dark:text-white/50">Optional</span>
                  </div>
                  <div className="relative">
                    <input
                      id={companyInputId}
                      type="text"
                      placeholder="Company or Family Name"
                      value={formData.company}
                      onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DFD3] dark:border-[#332922] bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none focus:border-[#855331]"
                    />
                    <Building size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 11 & 12: Phone / WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor={phoneInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                    <span className="text-[#9A643E] font-mono">11.</span> Phone / WhatsApp
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id={phoneInputId}
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, phone: e.target.value }));
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${errors.phone ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
                        }`}
                    />
                    <Phone size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                  </div>
                  {errors.phone && <p className="text-xs text-rose-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor={emailInputId} className="text-xs font-bold uppercase tracking-wider text-[#241F1C] dark:text-white flex items-center gap-1.5">
                    <span className="text-[#9A643E] font-mono">12.</span> Email Address
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id={emailInputId}
                      type="email"
                      placeholder="yourname@domain.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, email: e.target.value }));
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] dark:bg-[#100E0D] text-xs text-[#241F1C] dark:text-white focus:outline-none ${errors.email ? 'border-rose-500' : 'border-[#E8DFD3] dark:border-[#332922] focus:border-[#855331]'
                        }`}
                    />
                    <Mail size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                  </div>
                  {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                </div>
              </div>

              {/* Consent & Direct Action Buttons */}
              <div className="space-y-5 pt-4 border-t border-[#E8DFD3] dark:border-[#332922]">
                <label htmlFor={consentInputId} className="flex items-start gap-3 text-xs text-[#5C554F] dark:text-white/75 cursor-pointer">
                  <input
                    id={consentInputId}
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData((p) => ({ ...p, consent: e.target.checked }))}
                    className="mt-0.5 rounded text-[#855331] focus:ring-[#855331] accent-[#855331]"
                  />
                  <span>
                    I agree that JORIQUE may contact me regarding this bulk order enquiry.
                  </span>
                </label>
                {errors.consent && <p className="text-xs text-rose-500">{errors.consent}</p>}

                {/* Direct Action Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={handleOpenWhatsApp}
                    className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-[0.14em] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <MessageSquare size={16} />
                    <span>Send via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenEmail}
                    className="w-full py-4 px-6 rounded-xl bg-[#855331] hover:bg-[#6F4324] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black font-bold text-xs uppercase tracking-[0.14em] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <Mail size={16} />
                    <span>Send via Email</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E8DFD3]/60 dark:border-[#2E2925] text-[11px] text-[#786E65] dark:text-white/60">
                  <p className="font-light">
                    Prices will vary according to quantity and quality specifications.
                  </p>
                  <p>
                    Direct call:{' '}
                    <a href="tel:9919388211" className="text-[#855331] dark:text-[#C6A96B] font-bold hover:underline">
                      9919388211
                    </a>
                  </p>
                </div>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          05. HOW IT WORKS
      ───────────────────────────────────────────────────────────── */}
      < section className="py-16 lg:py-24 px-5 sm:px-8 lg:px-12 bg-[#FAF7F2] dark:bg-[#100E0D] border-b border-[#E8DFD3] dark:border-[#2E2925]" >
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-sans font-medium tracking-[0.25em] text-[#9A643E] dark:text-[#D4AF37] uppercase block">
              HOW IT WORKS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#241F1C] dark:text-white tracking-tight">
              From your idea to a beautiful gift.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Tell us your requirements',
                desc: 'Share your occasion, quantity and customization details.',
              },
              {
                step: '02',
                title: 'Receive the concept',
                desc: 'JORIQUE prepares a personalized design for approval.',
              },
              {
                step: '03',
                title: 'Approve the artwork',
                desc: 'Final artwork is confirmed before production.',
              },
              {
                step: '04',
                title: 'Create & deliver',
                desc: 'The order is crafted with care and delivered to the requested location.',
              },
            ].map((st, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-white dark:bg-[#1C1613] border border-[#E5DACD] dark:border-[#332922] space-y-4 shadow-xs hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#FAF6F0] dark:bg-white/10 text-[#855331] dark:text-[#C6A96B] font-mono font-bold text-base flex items-center justify-center border border-[#E5DACD] dark:border-white/10 group-hover:scale-105 transition-transform">
                  {st.step}
                </div>
                <h3 className="font-serif text-xl font-normal text-[#241F1C] dark:text-white leading-snug">
                  {st.title}
                </h3>
                <p className="text-xs text-[#5C554F] dark:text-white/70 font-light leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section >

      {/* ─────────────────────────────────────────────────────────────
          06. CLOSING CTA SECTION
      ───────────────────────────────────────────────────────────── */}
      < section className="py-16 lg:py-20 px-5 sm:px-8 lg:px-12 bg-[#201A16] dark:bg-[#181412] text-white relative overflow-hidden" >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C6A96B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#C6A96B] uppercase block font-medium">
              JORIQUE SOUVENIR
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
              Your occasion. Your identity. Your gift.
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light">
              Meaningful moments deserve to be beautifully remembered.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0">
            <button
              onClick={() => scrollToForm()}
              className="px-7 py-3.5 rounded-lg bg-[#855331] hover:bg-[#9E653F] text-white font-semibold text-xs uppercase tracking-[0.18em] transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              START YOUR ENQUIRY →
            </button>
            <a
              href="tel:9919388211"
              className="px-6 py-3.5 rounded-lg border border-white/30 hover:border-white text-white font-semibold text-xs uppercase tracking-[0.15em] transition-all"
            >
              CALL 9919388211
            </a>
          </div>
        </div>
      </section >

      {/* ─────────────────────────────────────────────────────────────
          07. FOOTER
      ───────────────────────────────────────────────────────────── */}
      < Footer />
    </div >
  );
}
