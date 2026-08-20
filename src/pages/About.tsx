import { motion } from 'framer-motion';
import { Leaf, Layers, Heart, Users, Star, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const HERO_IMAGE =
  'https://images.pexels.com/photos/6186826/pexels-photo-6186826.jpeg?auto=compress&cs=tinysrgb&w=1400';

const values = [
  {
    icon: <Layers size={20} strokeWidth={1.5} />,
    title: 'Premium Materials',
    description:
      'We source only the finest natural fibres — Egyptian cotton, pure linen, and Mulberry silk — from certified, ethical mills around the world.',
  },
  {
    icon: <Star size={20} strokeWidth={1.5} />,
    title: 'Thoughtful Design',
    description:
      'Each piece is designed with intention — clean lines, muted palettes, and timeless forms that complement any interior for years to come.',
  },
  {
    icon: <Leaf size={20} strokeWidth={1.5} />,
    title: 'Sustainable Living',
    description:
      'Sustainability is woven into everything we do. Our packaging is plastic-free, our dyes are OEKO-TEX certified, and we plant one tree per order.',
  },
  {
    icon: <Heart size={20} strokeWidth={1.5} />,
    title: 'Customer First',
    description:
      'Your satisfaction is our priority. With 15-day easy returns and lifetime quality support, we stand behind every product we make.',
  },
  {
    icon: <Users size={20} strokeWidth={1.5} />,
    title: 'Community Driven',
    description:
      'We collaborate with artisans and support local communities, ensuring that every purchase creates a positive ripple effect.',
  },
  {
    icon: <Award size={20} strokeWidth={1.5} />,
    title: 'Quality Assured',
    description:
      'Every product passes through rigorous quality checks before reaching your home. We accept nothing less than perfection.',
  },
];

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '100%', label: 'Natural Fibres' },
  { value: '15', label: 'Day Returns' },
  { value: '3+', label: 'Years of Excellence' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-4">
            Our Story
          </p>
          <h1 className="text-3xl lg:text-5xl font-light text-primary tracking-wide mb-6">
            About JORIQUE
          </h1>
          <p className="text-secondary text-base lg:text-lg font-light max-w-xl mx-auto leading-relaxed">
            JORIQUE was created to bring comfort and design together — making everyday living feel premium.
          </p>
        </motion.div>
      </section>

      {/* Hero Image */}
      <section className="px-6 pb-20">
        <motion.div
          className="max-w-5xl mx-auto overflow-hidden rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={HERO_IMAGE}
            alt="Luxury bedroom lifestyle"
            className="w-full h-64 sm:h-96 lg:h-[500px] object-cover"
          />
        </motion.div>
      </section>

      {/* Brand Story */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-6">
              The JORIQUE Philosophy
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-primary mb-8 leading-relaxed">
              Crafted for Modern Living
            </h2>
            <div className="space-y-5 text-secondary text-sm lg:text-base leading-[1.85] text-left">
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

      {/* Stats */}
      <section className="py-16 lg:py-20 bg-white border-y border-border px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="text-3xl lg:text-4xl font-light text-primary mb-2">{stat.value}</p>
                <p className="text-xs font-medium tracking-widest uppercase text-secondary">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-4">
              What We Stand For
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-primary">Our Core Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="p-7 rounded-2xl bg-white border border-border hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="w-11 h-11 flex items-center justify-center rounded-full bg-cream text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {value.icon}
                </div>
                <h3 className="text-sm font-semibold text-primary tracking-wide mb-2.5">
                  {value.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-12 lg:p-16 bg-primary rounded-2xl">
            <p className="text-white/60 text-xs font-medium tracking-[0.3em] uppercase mb-5">
              Experience JORIQUE
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-white mb-8">
              Ready to elevate your home?
            </h2>
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-white text-primary text-xs font-medium tracking-widest uppercase px-8 py-3.5 hover:bg-cream transition-colors duration-200"
              >
                Explore Collection
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
