import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Video,
  Clock,
  AlertCircle,
  Truck,
  CheckCircle2,
  FileText,
  Mail,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Package,
  Sparkles,
  Ban,
  Scissors,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    q: 'Can I return an item because I changed my mind or disliked the colour?',
    a: 'No. JORIQUE products are handcrafted and carefully inspected before dispatch. We do not accept returns or exchanges for change of mind, personal liking, colour preference, design preference, or subjective dissatisfaction.',
  },
  {
    q: 'What should I do if my order arrives damaged or with a defect?',
    a: 'Please contact our dedicated support team at care@jorique.in within 48 hours of delivery. You must provide your Order ID, clear photographs of the defect, and a continuous, unedited 360° unboxing video recorded from before the parcel is opened.',
  },
  {
    q: 'Why is a 360° unboxing video mandatory?',
    a: 'Because our textiles undergo thorough pre-dispatch quality checks, a complete 360° opening video beginning before the outer tamper-evident package is breached verifies whether damage or discrepancies occurred in transit. Claims without an unboxing video cannot be approved.',
  },
  {
    q: 'What is the claim window for defects or incorrect items?',
    a: 'All claims must be submitted within 48 hours of doorstep delivery confirmation. The item must remain unused, unwashed, unaltered, and retained in its original luxury packaging with all tags intact.',
  },
  {
    q: 'Can customized or monogrammed items be exchanged?',
    a: 'Customized, personalized, or made-to-order items are strictly non-returnable and non-exchangeable for change of mind. However, genuine manufacturing defect or wrong-item claims remain protected under our standard verification process.',
  },
  {
    q: 'What if an identical replacement item is out of stock?',
    a: 'If an approved defective or incorrect item cannot be replaced due to stock availability, JORIQUE will promptly communicate your options for an alternative replacement, store credit, or refund in accordance with applicable law.',
  },
];

export default function ReturnPolicy() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0D0B0A] text-primary dark:text-[#F5F2EB] transition-colors duration-300 font-sans selection:bg-[#851C25]/20 dark:selection:bg-[#D4AF37]/30 selection:text-[#851C25] dark:selection:text-[#D4AF37]">
      <Navbar />

      {/* Hero Header */}
      <header className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 border-b border-border dark:border-[#2E2925] overflow-hidden bg-cream/40 dark:bg-[#12100E]">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-30 dark:opacity-20"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, #851C25 60%, transparent 80%)' }}
        />

        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-border dark:border-white/10 text-xs font-bold uppercase tracking-[0.25em] text-[#851C25] dark:text-[#D4AF37]">
            <ShieldCheck size={13} />
            <span>Policy Guidelines</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight text-primary dark:text-white leading-tight">
            Return & Exchange Policy
          </h1>

          <p className="text-sm sm:text-base text-secondary dark:text-white/70 max-w-2xl mx-auto font-sans leading-relaxed">
            Where Comfort Meets Design. Please review our official policy governing JORIQUE Essential, JORIQUE Signature, and JORIQUE Luxe collections.
          </p>
        </div>
      </header>

      {/* Main Policy Content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-12 py-12 sm:py-16 space-y-12">
        
        {/* CRITICAL NOTICE CALLOUT */}
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-primary dark:text-white space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-widest">
            <AlertCircle size={18} />
            <span>Customer-Facing Summary</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed font-sans text-secondary dark:text-white/80">
            <strong>IMPORTANT:</strong> JORIQUE products are carefully inspected before packaging and dispatch. We do not accept returns or exchanges based on change of mind or personal preference. If your order arrives defective, damaged, or incorrect, please contact us within <strong>48 hours</strong> of delivery. A complete <strong>360° unboxing video</strong> recorded from before opening the parcel is mandatory for claim verification.
          </p>
        </div>

        {/* 1. SCOPE */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#851C25] dark:text-[#D4AF37]">
              01
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-primary dark:text-white">
              Scope & Application
            </h2>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161412] border border-border/80 dark:border-[#2E2925] text-xs sm:text-sm text-secondary dark:text-white/70 space-y-3 leading-relaxed">
            <p>
              • These Return & Exchange guidelines apply exclusively to <strong>JORIQUE Essential</strong>, <strong>JORIQUE Signature</strong>, and <strong>JORIQUE Luxe</strong> products purchased directly through our official website.
            </p>
            <p>
              • These guidelines do not automatically apply to <em>JORIQUE Souvenir</em> or <em>JORIQUE Hospitality</em> collections, which maintain separate commercial terms.
            </p>
            <p>
              • If a specific product displays tailored terms on its product description page, those terms govern that item in conjunction with this policy.
            </p>
          </div>
        </section>

        {/* 2. CORE RETURN & EXCHANGE RULE */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#851C25] dark:text-[#D4AF37]">
              02
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-primary dark:text-white">
              Core Return & Exchange Principle
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-xs">
                <Ban size={16} />
                <span>Non-Eligible Reasons</span>
              </div>
              <p className="text-secondary dark:text-white/70 leading-relaxed">
                JORIQUE does <strong>not</strong> offer returns or exchanges for change of mind, personal liking, preference, colour preference, design preference, or subjective dissatisfaction.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-xs">
                <CheckCircle2 size={16} />
                <span>Eligible Exchange Criteria</span>
              </div>
              <p className="text-secondary dark:text-white/70 leading-relaxed">
                Exchange is offered <strong>only</strong> for genuine manufacturing defects, damage incurred during transit, or an incorrect item received, subject to verification.
              </p>
            </div>
          </div>
        </section>

        {/* 3. MANDATORY 360° UNBOXING VIDEO */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#851C25] dark:text-[#D4AF37]">
              03
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-primary dark:text-white flex items-center gap-2">
              <span>Mandatory 360° Unboxing Video</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#851C25] text-white tracking-wider">
                Required
              </span>
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#161412] border border-border/80 dark:border-[#2E2925] space-y-4 text-xs sm:text-sm text-secondary dark:text-white/70 leading-relaxed">
            <div className="flex items-start gap-3">
              <Video size={20} className="text-[#851C25] dark:text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary dark:text-white mb-1">
                  A complete, continuous 360° opening video is strictly mandatory for any defect, damage, or wrong-item claim.
                </p>
                <p>
                  Because every JORIQUE item undergoes rigorous hand-inspection and photographic logging prior to sealed dispatch, video evidence is essential to establish origin.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-cream/40 dark:bg-white/5 border border-border/60 dark:border-white/5">
                <p className="font-bold text-primary dark:text-white text-xs mb-1">What the video must show:</p>
                <ul className="space-y-1 list-disc pl-4 text-xs">
                  <li>Start recording <em>before</em> any tape or seal is cut</li>
                  <li>Clear view of the intact shipping label and tracking barcode</li>
                  <li>360-degree rotation of the outer package showing all sides</li>
                  <li>Continuous opening process without pauses or cuts</li>
                  <li>First removal and inspection of the item</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-cream/40 dark:bg-white/5 border border-border/60 dark:border-white/5">
                <p className="font-bold text-primary dark:text-white text-xs mb-1">Incomplete Evidence:</p>
                <p className="text-xs">
                  Videos started after the package has been opened, paused videos, edited clips, or photographs submitted without an opening video cannot be accepted for claim approval.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CLAIM TIMELINE & CONDITIONS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#851C25] dark:text-[#D4AF37]">
              04
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-primary dark:text-white">
              Strict 48-Hour Claim Window
            </h2>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161412] border border-border/80 dark:border-[#2E2925] text-xs sm:text-sm text-secondary dark:text-white/70 space-y-3 leading-relaxed">
            <p className="flex items-center gap-2 font-medium text-primary dark:text-white">
              <Clock size={16} className="text-[#851C25] dark:text-[#D4AF37]" />
              Claims must be registered within <strong>48 hours</strong> of doorstep delivery confirmation.
            </p>
            <p>
              The product must remain strictly <strong>unused, unwashed, unaltered, and retained in its original luxury packaging</strong> with all labels and serial tags intact until the assessment is concluded.
            </p>
          </div>
        </section>

        {/* 5. STEP-BY-STEP CLAIM PROCESS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#851C25] dark:text-[#D4AF37]">
              05
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-primary dark:text-white">
              Claim Procedure
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161412] border border-border/80 dark:border-[#2E2925] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#851C25] dark:text-[#D4AF37]">
                1
              </div>
              <h3 className="font-bold text-primary dark:text-white text-sm">Submit Evidence</h3>
              <p className="text-xs text-secondary dark:text-white/70 leading-relaxed">
                Email <a href="mailto:care@jorique.in" className="text-[#851C25] dark:text-[#D4AF37] underline">care@jorique.in</a> with your Order ID, detailed description, high-res photos, and complete 360° unboxing video.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161412] border border-border/80 dark:border-[#2E2925] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#851C25] dark:text-[#D4AF37]">
                2
              </div>
              <h3 className="font-bold text-primary dark:text-white text-sm">Quality Verification</h3>
              <p className="text-xs text-secondary dark:text-white/70 leading-relaxed">
                Our artisanal quality team examines the video against pre-dispatch footage to corroborate transit damage or defect within 24–48 working hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161412] border border-border/80 dark:border-[#2E2925] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#851C25] dark:text-[#D4AF37]">
                3
              </div>
              <h3 className="font-bold text-primary dark:text-white text-sm">Exchange Resolution</h3>
              <p className="text-xs text-secondary dark:text-white/70 leading-relaxed">
                Upon approval, JORIQUE arranges reverse collection and dispatches an identical replacement at our expense. If unavailable, alternate resolution is coordinated.
              </p>
            </div>
          </div>
        </section>

        {/* 6. CUSTOMIZED / PERSONALIZED CREATIONS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#851C25] dark:text-[#D4AF37]">
              06
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-primary dark:text-white">
              Customized & Bespoke Creations
            </h2>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161412] border border-border/80 dark:border-[#2E2925] text-xs sm:text-sm text-secondary dark:text-white/70 space-y-2 leading-relaxed">
            <p>
              For JORIQUE Essential, Signature, and Luxe products that are specifically personalized, monogrammed, custom-measured, or made-to-order, returns or exchanges for change of mind are strictly excluded.
            </p>
            <p>
              Genuine manufacturing defect or wrong-item claims remain fully protected under our standard 360° unboxing video verification process.
            </p>
          </div>
        </section>

        {/* 7. EXCLUSIONS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#851C25] dark:text-[#D4AF37]">
              07
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-primary dark:text-white">
              Exclusions from Coverage
            </h2>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161412] border border-border/80 dark:border-[#2E2925] text-xs sm:text-sm text-secondary dark:text-white/70 space-y-2 leading-relaxed">
            <ul className="space-y-2 list-disc pl-4">
              <li>Damage caused after delivery through washing, ironing, bleaching, improper detergent, cutting, stitching, or alterations.</li>
              <li>Products showing signs of use, scent, wear, or missing original packaging/tags.</li>
              <li>Normal, organic characteristics of artisanal fabrics, natural yarn slubs, handcrafted weave textures, or minor screen colour nuances disclosed before purchase.</li>
              <li>Items purchased during promotional clearance or designated as final sale.</li>
            </ul>
          </div>
        </section>

        {/* 8. SHIPPING & DELIVERY TIMELINES */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#851C25] dark:text-[#D4AF37]">
              08
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-primary dark:text-white">
              Shipping & Delivery Estimates
            </h2>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161412] border border-border/80 dark:border-[#2E2925] text-xs sm:text-sm text-secondary dark:text-white/70 space-y-3 leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-cream/40 dark:bg-white/5 border border-border/60 dark:border-white/5">
                <p className="font-bold text-primary dark:text-white text-xs mb-1">Dispatch Window</p>
                <p className="text-xs">
                  Most orders are carefully packaged and dispatched within <strong>1–2 working days</strong> following order verification.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cream/40 dark:bg-white/5 border border-border/60 dark:border-white/5">
                <p className="font-bold text-primary dark:text-white text-xs mb-1">Transit & Delivery</p>
                <p className="text-xs">
                  Most domestic orders are delivered within approximately <strong>6–8 working days</strong> after dispatch, subject to destination pincode and courier logistics.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-secondary/70 dark:text-white/50 italic">
              * Delivery timelines are estimates. If an artisanal piece is in active loom production or delayed by raw material availability, our team will proactively notify you with updated scheduling.
            </p>
          </div>
        </section>

        {/* 9. OFFICIAL CONTACT & CLAIMS DESK */}
        <section className="p-8 rounded-3xl bg-cream/60 dark:bg-[#161412] border border-border dark:border-[#2E2925] text-center space-y-4">
          <h2 className="text-2xl font-serif font-bold text-primary dark:text-white">
            Need to Register a Claim?
          </h2>
          <p className="text-xs sm:text-sm text-secondary dark:text-white/70 max-w-xl mx-auto leading-relaxed">
            Please email our client relations team with your Order ID, clear issue photographs, and continuous 360° unboxing video:
          </p>
          <div>
            <a
              href="mailto:care@jorique.in"
              className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-primary hover:bg-[#851C25] dark:bg-[#D4AF37] dark:hover:bg-[#B89628] text-white dark:text-black text-xs font-bold uppercase tracking-widest transition-all shadow-md"
            >
              <Mail size={15} />
              <span>care@jorique.in</span>
            </a>
          </div>
        </section>

        {/* 10. FREQUENTLY ASKED QUESTIONS */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#851C25] dark:text-[#D4AF37]">
              Common Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-primary dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_LIST.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white dark:bg-[#161412] border border-border/80 dark:border-[#2E2925] overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 flex items-center justify-between text-left gap-4"
                >
                  <span className="font-semibold text-xs sm:text-sm text-primary dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-secondary shrink-0 transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-secondary dark:text-white/70 leading-relaxed border-t border-border/50 dark:border-white/5 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
