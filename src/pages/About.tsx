import { motion } from 'framer-motion';
import { Leaf, Layers, Heart, Users, Star, Award, Sparkles, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import Parallax3DCard from '../components/Parallax3DCard';

const HERO_IMAGE =
  'https://images.pexels.com/photos/6186826/pexels-photo-6186826.jpeg?auto=compress&cs=tinysrgb&w=1400';

const values = [
  {
    icon: <Layers size={22} strokeWidth={1.5} />,
    title: 'Premium Materials',
    description:
      'We source only the finest natural fibres — Egyptian cotton, pure linen, and Mulberry silk — from certified, ethical mills around the world.',
  },
  {
    icon: <Star size={22} strokeWidth={1.5} />,
    title: 'Thoughtful Design',
    description:
      'Each piece is designed with intention — clean lines, muted palettes, and timeless forms that complement any interior for years to come.',
  },
  {
    icon: <Leaf size={22} strokeWidth={1.5} />,
    title: 'Sustainable Living',
    description:
      'Sustainability is woven into everything we do. Our packaging is plastic-free, our dyes are OEKO-TEX certified, and we plant one tree per order.',
  },
  {
    icon: <Heart size={22} strokeWidth={1.5} />,
    title: 'Customer First',
    description:
      'Your satisfaction is our priority. With 15-day easy returns and lifetime quality support, we stand behind every product we make.',
  },
  {
    icon: <Users size={22} strokeWidth={1.5} />,
    title: 'Community Driven',
    description:
      'We collaborate with artisans and support local communities, ensuring that every purchase creates a positive ripple effect.',
  },
  {
    icon: <Award size={22} strokeWidth={1.5} />,
    title: 'Quality Assured',
    description:
      'Every product passes through rigorous quality checks before reaching your home. We accept nothing less than perfection.',
  },
];

const stats = [
  { value: '50K+', label: 'Happy Sanctuaries' },
  { value: '100%', label: 'Organic Fibres' },
  { value: '15', label: 'Day Return Window' },
  { value: '3+', label: 'Years of Excellence' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300 overflow-hidden">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-[#2E2925] text-secondary dark:text-[#D4AF37] text-[11px] font-semibold tracking-[0.3em] uppercase mb-5">
            <Sparkles size={12} className="text-[#D4AF37]" />
            Heritage & Craft
          </div>
          <h1 className="text-3xl lg:text-5xl font-light text-primary dark:text-white tracking-wide mb-6">
            The World of JORIQUE
          </h1>
          <p className="text-secondary dark:text-white/70 text-base lg:text-lg font-light max-w-xl mx-auto leading-relaxed">
            JORIQUE was created to bring comfort and design together — making everyday living feel intentionally premium.
          </p>
        </motion.div>
      </section>

      {/* 3D Hero Stage */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <Parallax3DCard
          maxRotation={8}
          perspective={1400}
          glareEffect={true}
          scaleOnHover={1.01}
          className="rounded-3xl shadow-2xl overflow-hidden border border-border dark:border-[#2E2925]"
        >
          <div className="relative rounded-3xl overflow-hidden transform-style-3d bg-cream/40 dark:bg-[#1A1816] aspect-[16/9]">
            <img
              src={HERO_IMAGE}
              alt="Luxury bedroom lifestyle"
              className="w-full h-full object-cover brightness-95 dark:brightness-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            
            {/* Floating 3D Badge */}
            <div
              className="absolute bottom-8 left-8 z-20 pointer-events-none transform-style-3d hidden sm:block"
              style={{ transform: 'translateZ(45px)' }}
            >
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/95 dark:bg-[#1A1816]/95 backdrop-blur-md shadow-2xl text-primary dark:text-white border border-border/60 dark:border-[#2E2925]">
                <ShieldCheck size={18} className="text-primary dark:text-[#D4AF37]" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest block text-secondary dark:text-white/60">
                    Artisanal Standard
                  </span>
                  <span className="text-xs font-semibold">Guimarães Certified Weaving</span>
                </div>
              </div>
            </div>
          </div>
        </Parallax3DCard>
      </section>

      {/* Brand Story */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-secondary dark:text-[#D4AF37] mb-4">
              The JORIQUE Philosophy
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-primary dark:text-white mb-8 leading-relaxed">
              Crafted for Modern Living
            </h2>
            <div className="space-y-6 text-secondary dark:text-white/70 text-sm lg:text-base leading-[1.9] text-left">
              <p>
                JORIQUE was born from a simple belief: that your home should be a sanctuary. We believe that the textiles you surround yourself with every day — the sheets you sleep in, the towels you wrap yourself in, the cushions you sink into — have the power to transform how you feel.
              </p>
              <p>
                Founded by textile enthusiasts who were tired of choosing between quality and affordability, JORIQUE set out to create a collection of home textiles that bring the luxury of five-star hotels into everyday homes. We work directly with master weavers and ethical mills to cut out the middleman and deliver exceptional quality at honest prices.
              </p>
              <p>
                Every thread, every weave, every finish is chosen with intentionality. Our Scandinavian design philosophy keeps things minimal, clean, and enduringly beautiful — pieces that don't follow trends, but set the standard.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3D Elevated Stats Section */}
      <section className="py-20 bg-white dark:bg-[#151311] border-y border-border dark:border-[#2E2925] px-6 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-cream/40 dark:bg-white/5 border border-border/80 dark:border-[#2E2925] hover:border-primary/20 dark:hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-300"
              >
                <p className="text-3xl lg:text-4xl font-light text-primary dark:text-[#D4AF37] mb-2">{stat.value}</p>
                <p className="text-xs font-semibold tracking-widest uppercase text-secondary dark:text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Core Values Grid */}
      <section className="py-24 lg:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-secondary dark:text-[#D4AF37] mb-3">
              What We Stand For
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-primary dark:text-white tracking-wide">
              Our Core Pillars
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Parallax3DCard
                  maxRotation={10}
                  perspective={1000}
                  glareEffect={true}
                  scaleOnHover={1.03}
                  className="h-full rounded-2xl"
                >
                  <div className="h-full bg-white dark:bg-[#1A1816] p-8 rounded-2xl border border-border dark:border-[#2E2925] shadow-sm transform-style-3d flex flex-col justify-between">
                    <div>
                      <div
                        className="w-12 h-12 rounded-xl bg-cream dark:bg-white/10 flex items-center justify-center text-primary dark:text-[#D4AF37] mb-6 shadow-inner"
                        style={{ transform: 'translateZ(30px)' }}
                      >
                        {value.icon}
                      </div>
                      <h3
                        className="text-base font-semibold text-primary dark:text-white mb-3"
                        style={{ transform: 'translateZ(20px)' }}
                      >
                        {value.title}
                      </h3>
                      <p
                        className="text-xs text-secondary dark:text-white/70 leading-relaxed font-light"
                        style={{ transform: 'translateZ(10px)' }}
                      >
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Parallax3DCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center border-t border-border dark:border-[#2E2925]">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-light text-primary dark:text-white mb-4">
            Experience the JORIQUE Difference
          </h2>
          <p className="text-secondary dark:text-white/70 text-sm mb-8 leading-relaxed">
            Discover our curated collection of thoughtfully designed home textiles.
          </p>
          <Link to="/shop">
            <button className="inline-flex items-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all shadow-md">
              Shop the Collection
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
