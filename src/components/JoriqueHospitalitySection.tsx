import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JoriqueHospitalitySection() {
  const whatsappUrl =
    'https://wa.me/919026260421?text=' +
    encodeURIComponent(
      'Hello JORIQUE Concierge, I am inquiring regarding JORIQUE Hospitality commercial trade orders and bespoke hotel linen collections.'
    );

  const pillars = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#C6A96B]" />,
      title: 'Commercial Laundering Endurance',
      desc: 'Mercerized long-staple fibers rigorously tested for 200+ industrial wash cycles without fiber fuzzing or luster degradation.',
    },
    {
      icon: <Award className="w-5 h-5 text-[#C6A96B]" />,
      title: 'Bespoke Crest Monogramming',
      desc: 'Precision French embroidery of your hotel emblem, crest, or custom mitered flange piping tailored to your architecture.',
    },
    {
      icon: <Building2 className="w-5 h-5 text-[#C6A96B]" />,
      title: 'Presidential Suite Weaves',
      desc: 'Crisp matte percales and heavy liquid sateens engineered to deliver an unforgettable sleep sanctuary for discerning guests.',
    },
    {
      icon: <FileText className="w-5 h-5 text-[#C6A96B]" />,
      title: 'Dedicated Trade Concierge',
      desc: 'Direct white-glove trade pricing, custom sample dossiers dispatched to your property, and guaranteed production scheduling.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-10 bg-[#FAF7F2] dark:bg-[#14100D] text-primary dark:text-[#FCFAF7] relative overflow-hidden border-t border-[#E8DFD3] dark:border-[#2E2925] transition-colors duration-500">
      {/* Subtle Ambient Gold Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-radial from-[#C6A96B]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12 sm:space-y-16">
        
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#E8DFD3] dark:border-[#332922] pb-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 dark:bg-white/5 border border-[#C6A96B]/30 text-[#851C25] dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase shadow-xs">
              <Building2 size={12} className="text-[#C6A96B]" />
              Institutional & Hospitality Atelier
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-primary dark:text-white tracking-tight leading-tight">
              JORIQUE Hospitality
            </h2>

            <p className="font-serif italic text-base sm:text-lg text-[#851C25] dark:text-[#C6A96B] font-light">
              “Commercial-grade luxury suites & boutique hotel collections.”
            </p>

            <p className="text-xs sm:text-sm text-secondary dark:text-white/75 font-light leading-relaxed max-w-xl">
              Engineered for private island villas, boutique heritage resorts, and presidential suites. 
              We blend high-tensile organic percale and silky sateen with industrial durability to ensure 
              uncompromising comfort night after night.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1A1A1A] hover:bg-[#851C25] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              <MessageCircle size={15} />
              <span>Request Hospitality Dossier</span>
            </a>
            <Link to="/connect">
              <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#E8DFD3] dark:border-[#332922] hover:border-[#C6A96B] bg-white/50 dark:bg-white/5 text-primary dark:text-white font-semibold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer">
                <span>Contact Concierge</span>
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-[#1C1613]/80 border border-[#E8DFD3] dark:border-[#332922] hover:border-[#C6A96B]/50 transition-all duration-300 space-y-4 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cream/60 dark:bg-white/5 border border-[#E8DFD3] dark:border-white/10 flex items-center justify-center text-[#C6A96B]">
                  {pillar.icon}
                </div>
                <h3 className="font-serif text-lg font-normal text-primary dark:text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs text-secondary dark:text-white/70 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8DFD3] dark:border-[#332922] flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#851C25] dark:text-[#C6A96B]">
                <CheckCircle2 size={11} />
                <span>Hospitality Standard</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner Note */}
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-secondary dark:text-white/80">
          <div className="space-y-1">
            <span className="font-semibold text-primary dark:text-white block">Custom Sizes & Volume Trade Orders:</span>
            <span className="text-secondary dark:text-white/60 font-light">
              Available across King, Queen, California King, and custom European/Asian hospitality dimensions.
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#851C25] dark:text-[#C6A96B] uppercase tracking-widest shrink-0 font-medium">
            Worldwide White-Glove Dispatch
          </span>
        </div>

      </div>
    </section>
  );
}
