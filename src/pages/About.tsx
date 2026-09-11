import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Feather,
  Layers,
  HeartHandshake,
  ShieldCheck,
  Compass,
  ShoppingBag,
  Sparkle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function About() {
  const aboutStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About JORIQUE | Where Comfort Meets Design',
    description:
      'JORIQUE is a premium Indian lifestyle brand offering beautifully designed everyday essentials—from luxurious home linens to refined apparel and fragrances—blending comfort and style.',
    url: 'https://jorique.in/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'JORIQUE',
      url: 'https://jorique.in/',
      logo: 'https://jorique.in/favicon.svg'
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: custom * 0.15, ease: [0.22, 1, 0.36, 1] }
    })
  };

  const categories = [
    {
      title: "Bed Sheets",
      subtitle: "Ultra-soft cottons & dobby weaves",
      image: "/images/luxury-products/bedsheet_clean.png",
      link: "/shop?category=bedsheets",
      tag: "Signature Bedding"
    },
    {
      title: " Cushion Covers",
      subtitle: "Handwoven textures & rich tones",
      image: "/images/luxury-products/cushion_clean.png",
      link: "/shop?category=cushions",
      tag: "Artisanal Living"
    },
    {
      title: "Suits",
      subtitle: "Crisp shirts & structured suiting",
      image: "/images/luxury-products/suit_clean.png",
      link: "/shop?category=apparel",
      tag: "Modern Wardrobe"
    },
    {
      title: "Table Runners",
      subtitle: "High-absorbency cloud towels",
      image: "/images/luxury-products/towel_clean.png",
      link: "/shop?category=towels",
      tag: "Daily Rituals"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F2] dark:bg-[#100E0D] text-[#231C16] dark:text-[#F5F2EB] transition-colors duration-300 selection:bg-[#C6A96B]/20">
      <SEO
        title="About JORIQUE | Where Comfort Meets Design — Luxury Everyday Essentials"
        description="JORIQUE is a premium Indian lifestyle brand offering beautifully designed everyday essentials—from luxurious home linens to refined apparel and fragrances—blending comfort and style."
        canonical="https://jorique.in/about"
        structuredData={aboutStructuredData}
      />
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION: Aspirational Headline & Brand Purpose
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-32 px-6 overflow-hidden">
        {/* Ambient Warmth Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial from-[#D4AF37]/15 via-[#C6A96B]/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-[#C6A96B]/30 backdrop-blur-md text-[#851C25] dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] uppercase shadow-xs"
          >
            <Sparkles size={13} className="text-[#C6A96B]" />
            The JORIQUE Narrative
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1A1816] dark:text-white leading-[1.15]"
          >
            Everything You Need, <br className="hidden sm:inline" />
            <span className="italic font-light text-[#851C25] dark:text-[#E5C158]">Beautifully.</span>
          </motion.h1>

          {/* Golden Sub-filigree divider */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="h-[1px] w-24 sm:w-36 mx-auto bg-gradient-to-r from-transparent via-[#C6A96B] to-transparent my-4"
          />

          <motion.p
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="text-sm sm:text-base lg:text-lg text-[#665D55] dark:text-white/70 max-w-2xl mx-auto font-light leading-relaxed"
          >
            JORIQUE is your destination for premium everyday essentials. We unite luxury home linens,
            tailored apparel, and sensorial living into a singular, cohesive aesthetic—where comfort,
            smart design, and Indian artisanship meet without compromise.
          </motion.p>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link to="/shop">
              <button className="group inline-flex items-center gap-2.5 bg-[#231C16] hover:bg-[#851C25] dark:bg-[#D4AF37] dark:hover:bg-[#E5C158] text-white dark:text-[#100E0D] px-7 py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
                <span>Shop Collection</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href="#heritage-story">
              <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#C6A96B]/40 hover:border-[#C6A96B] bg-white/40 dark:bg-white/5 backdrop-blur-sm text-xs font-semibold tracking-[0.2em] uppercase text-[#4A423B] dark:text-white/80 hover:text-[#1A1816] dark:hover:text-white transition-all duration-300 cursor-pointer">
                <span>Our Heritage</span>
              </button>
            </a>
          </motion.div>
        </div>

        {/* Floating Category Badges */}
        <div className="max-w-4xl mx-auto mt-14 pt-8 border-t border-[#E8E1D5]/80 dark:border-[#2E2925]/80">
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-center text-[#8A8177] dark:text-white/40 mb-4">
            Curated Everyday Lifestyle Essentials
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#524A42] dark:text-white/70">
            {['Luxury Bed Linens', 'Handcrafted Cushions', 'Plush Cloud Towels', 'Crisp Cotton Shirts', 'Refined Suiting', 'Signature Fragrance'].map((tag, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-[#E0D8CB] dark:border-[#2E2925] text-[11px] font-medium tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CHAPTER 1: HERITAGE & CRAFT FOCUS
          "Rooted in Tradition, Crafted for Today"
          ═══════════════════════════════════════════════════════════════ */}
      <section id="heritage-story" className="py-20 lg:py-28 px-6 bg-white/60 dark:bg-[#151311]/60 border-y border-[#E8E1D5] dark:border-[#2E2925]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Narrative Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#851C25] dark:text-[#D4AF37] block">
                  Chapter I • Artisanal Origin
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1A1816] dark:text-white leading-snug">
                  Rooted in Tradition, <br />
                  <span className="italic font-light text-[#C6A96B]">Crafted for Today.</span>
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#5A524A] dark:text-white/75 font-light leading-relaxed">
                <p>
                  JORIQUE was born from an enduring admiration for India’s timeless textile traditions.
                  Across generations, weaving and handloom techniques have transformed humble raw cotton
                  and rich natural fibers into woven poetry. We celebrate this mastery by bringing handwoven
                  textures, authentic weaves, and thoughtful details into modern, contemporary homes.
                </p>
                <p>
                  Each bedsheet, cushion cover, and textile reflects generations of artisanship—craft traditions
                  passed down and reimagined into luxurious linens for your sanctuary. Our apparel carries
                  the exact same ethos: from breathable bath towels to finely structured shirts and suits,
                  every piece is created with deliberate attention to detail and tactile comfort.
                </p>
                <p>
                  Our collections celebrate familiar textures and motifs in a fresh, understated light.
                  We embrace natural fibers and rich earthy palettes inspired by the subcontinent’s landscape—whether
                  it is a subtle chai-spice print or an intricate dobby weave, authentic craftsmanship shines through every fold.
                </p>
              </div>

              <blockquote className="p-4 sm:p-5 rounded-2xl bg-[#FBF8F2] dark:bg-white/5 border-l-2 border-[#C6A96B] text-xs sm:text-sm font-serif italic text-[#4A423B] dark:text-white/90">
                “Because every day is meant to be enjoyed beautifully—bridging the quiet elegance of the past with the rhythm of modern living.”
              </blockquote>
            </motion.div>

            {/* Right Visual Composition */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#F7F2E7] to-[#EDE5D5] dark:from-[#1E1B18] dark:to-[#141210] border border-[#C6A96B]/30 shadow-xl overflow-hidden text-center">
                {/* Background filigree star */}
                <div className="absolute -top-6 -right-6 text-[#C6A96B]/15 text-8xl font-serif pointer-events-none select-none">
                  ✦
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="w-28 h-28 mx-auto flex items-center justify-center rounded-full bg-white/70 dark:bg-white/5 border border-[#C6A96B]/30 shadow-inner">
                    <Feather size={42} className="text-[#C6A96B]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-[#1A1816] dark:text-white">
                      The Artisan Standard
                    </h3>
                    <p className="text-xs text-[#7A7168] dark:text-white/60 leading-relaxed font-light">
                      Natural long-staple cottons, hand-finished hems, and responsibly woven fibers tested for lasting softness.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#C6A96B]/20 text-left">
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-white/5">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#851C25] dark:text-[#D4AF37] block font-semibold">100%</span>
                      <span className="text-[11px] text-[#4A423B] dark:text-white/80 font-medium">Breathable Cotton</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-white/5">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#851C25] dark:text-[#D4AF37] block font-semibold">Subtle</span>
                      <span className="text-[11px] text-[#4A423B] dark:text-white/80 font-medium">Dobby & Weaves</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CHAPTER 2: MODERN MINIMAL LUXURY
          "Elegance Made Essential — Form Meets Function"
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#851C25] dark:text-[#D4AF37]">
              Chapter II • Modern Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1816] dark:text-white">
              Elegance Made Essential
            </h2>
            <p className="text-xs sm:text-sm text-[#665D55] dark:text-white/70 font-light leading-relaxed">
              We curate an elegantly pared-back collection where form intuitively meets function. Every item
              is designed to be both undeniably beautiful and deeply practical in your daily rituals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-7 sm:p-8 rounded-3xl bg-white/60 dark:bg-white/5 border border-[#E8E1D5] dark:border-[#2E2925] hover:border-[#C6A96B]/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C6A96B]/10 flex items-center justify-center text-[#C6A96B]">
                  <Layers size={22} />
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-[#1A1816] dark:text-white">
                  Form Meets Function
                </h3>
                <p className="text-xs sm:text-sm text-[#665D55] dark:text-white/70 font-light leading-relaxed">
                  No excess, no superficial ornament. Each piece is refined down to clean silhouettes,
                  comfortable seams, and durable weaves that withstand daily washing and wear.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E8E1D5]/60 dark:border-[#2E2925]/60">
                <span className="text-[10px] font-mono tracking-widest text-[#8A8177] dark:text-white/40 uppercase">
                  Pared-Back Sophistication
                </span>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-7 sm:p-8 rounded-3xl bg-white/60 dark:bg-white/5 border border-[#E8E1D5] dark:border-[#2E2925] hover:border-[#C6A96B]/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C6A96B]/10 flex items-center justify-center text-[#C6A96B]">
                  <Sparkle size={22} />
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-[#1A1816] dark:text-white">
                  Sensory Comfort
                </h3>
                <p className="text-xs sm:text-sm text-[#665D55] dark:text-white/70 font-light leading-relaxed">
                  Imagine opening a box to find ultra-soft sheets in calming earthen hues, or stepping into
                  apparel whose fabric feels as good against the skin as it looks in the mirror.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E8E1D5]/60 dark:border-[#2E2925]/60">
                <span className="text-[10px] font-mono tracking-widest text-[#8A8177] dark:text-white/40 uppercase">
                  Tactile Delight
                </span>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-7 sm:p-8 rounded-3xl bg-white/60 dark:bg-white/5 border border-[#E8E1D5] dark:border-[#2E2925] hover:border-[#C6A96B]/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C6A96B]/10 flex items-center justify-center text-[#C6A96B]">
                  <Compass size={22} />
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-[#1A1816] dark:text-white">
                  Unified Living
                </h3>
                <p className="text-xs sm:text-sm text-[#665D55] dark:text-white/70 font-light leading-relaxed">
                  A seamless continuum from your bedroom to your personal wardrobe. JORIQUE curates everything
                  you touch every single day under one harmonious, trusted design language.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E8E1D5]/60 dark:border-[#2E2925]/60">
                <span className="text-[10px] font-mono tracking-widest text-[#8A8177] dark:text-white/40 uppercase">
                  Enduring Quality
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CHAPTER 3: THE 3 CORE PILLARS
          What JORIQUE Stands For
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 px-6 bg-[#F5EFE4]/60 dark:bg-[#151311]/80 border-t border-[#E8E1D5] dark:border-[#2E2925]">
        <div className="max-w-5xl mx-auto space-y-14">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#851C25] dark:text-[#D4AF37]">
              Our Guiding Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1816] dark:text-white">
              The Three Pillars
            </h2>
            <p className="text-xs sm:text-sm text-[#665D55] dark:text-white/70 font-light">
              Every creation bearing the JORIQUE seal is guided by three non-negotiable commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#1A1715] border border-[#E8E1D5] dark:border-[#2E2925] space-y-4">
              <span className="font-serif text-3xl font-light text-[#C6A96B]">01</span>
              <h3 className="font-serif text-lg font-medium text-[#1A1816] dark:text-white">
                Artisanal Integrity
              </h3>
              <p className="text-xs text-[#665D55] dark:text-white/70 leading-relaxed font-light">
                We honor the master weavers, artisans, and tailors across India. We preserve heritage
                dobby, handloom, and print traditions while adapting them to modern lifestyles.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#1A1715] border border-[#E8E1D5] dark:border-[#2E2925] space-y-4">
              <span className="font-serif text-3xl font-light text-[#C6A96B]">02</span>
              <h3 className="font-serif text-lg font-medium text-[#1A1816] dark:text-white">
                Honest Materials
              </h3>
              <p className="text-xs text-[#665D55] dark:text-white/70 leading-relaxed font-light">
                No synthetic shortcuts. We source natural cottons, linen blends, and skin-friendly dyes
                to ensure exceptional breathability, softness, and skin comfort through all seasons.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#1A1715] border border-[#E8E1D5] dark:border-[#2E2925] space-y-4">
              <span className="font-serif text-3xl font-light text-[#C6A96B]">03</span>
              <h3 className="font-serif text-lg font-medium text-[#1A1816] dark:text-white">
                Quiet Luxury For All Days
              </h3>
              <p className="text-xs text-[#665D55] dark:text-white/70 leading-relaxed font-light">
                True luxury is not reserved for special occasions; it belongs in your morning coffee,
                your nightly rest, and your everyday wardrobe without costing an exorbitant fortune.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SIGNATURE CATEGORY SHOWCASE: Visual Explore
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E1D5] dark:border-[#2E2925] pb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#851C25] dark:text-[#D4AF37]">
                The Portfolio
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1A1816] dark:text-white mt-1">
                Explore The Collections
              </h2>
            </div>
            <Link to="/shop" className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#851C25] dark:text-[#D4AF37]">
              <span>View Entire Catalogue</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="group relative rounded-3xl p-6 bg-white/70 dark:bg-white/5 border border-[#E8E1D5] dark:border-[#2E2925] hover:border-[#C6A96B] transition-all duration-300 flex flex-col items-center text-center shadow-xs hover:shadow-lg"
              >
                {/* <span className="absolute top-4 left-4 text-[9px] font-mono tracking-widest uppercase text-[#8A8177] dark:text-white/40">
                  {cat.tag}
                </span> */}

                <div className="w-full h-44 sm:h-48 my-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 pointer-events-none select-none drop-shadow-sm"
                  />
                </div>

                <div className="space-y-1 w-full pt-2 border-t border-[#E8E1D5]/70 dark:border-[#2E2925]/70">
                  <h3 className="font-serif text-base text-[#1A1816] dark:text-white group-hover:text-[#851C25] dark:group-hover:text-[#D4AF37] transition-colors">
                    {cat.title}
                  </h3>
                  {/* <p className="text-[11px] text-[#7A7168] dark:text-white/60 font-light">
                    {cat.subtitle}
                  </p> */}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          GRAND ATELIER BANNER & CLOSING CALL TO ACTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 text-center border-t border-[#E8E1D5] dark:border-[#2E2925] bg-gradient-to-b from-[#FBF8F2] via-[#F6F0E4] to-[#EFE7D8] dark:from-[#100E0D] dark:via-[#161311] dark:to-[#1C1815] relative overflow-hidden">
        {/* Subtle decorative corner stars */}
        <div className="absolute top-8 left-8 text-[#C6A96B] text-xl opacity-30 font-serif pointer-events-none select-none">
          ✦
        </div>
        <div className="absolute bottom-8 right-8 text-[#C6A96B] text-xl opacity-30 font-serif pointer-events-none select-none">
          ✦
        </div>

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#C6A96B] uppercase">
            <span>The Luxury Atelier</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#1A1816] dark:text-white tracking-wide">
            Experience JORIQUE
          </h2>

          <p className="text-xs sm:text-sm text-[#665D55] dark:text-white/70 font-light max-w-md mx-auto leading-relaxed">
            Elevate your home and personal wardrobe with pieces designed for enduring beauty, tactile bliss, and modern living.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop">
              <button className="inline-flex items-center gap-2.5 bg-[#851C25] hover:bg-[#68131B] text-white dark:bg-[#D4AF37] dark:hover:bg-[#E5C158] dark:text-[#100E0D] px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                <ShoppingBag size={14} />
                <span>Explore The Collection</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
