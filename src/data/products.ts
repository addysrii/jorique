import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Organic Linen Duvet Cover Set',
    price: 4999,
    originalPrice: 6499,
    description:
      'Crafted from 100% French flax linen, this duvet cover set is stonewashed for unmatched softness, offering effortless elegance and breathable comfort for a blissful night\'s sleep.',
    images: [
      '/Products/1.jpg',
      '/Products/1.png',
      '/Products/1 (1).png',
      '/Products/1 (2).png',
      '/Products/1 (3).png',
      '/Products/1 (4).png',
    ],
    category: 'Bedsheets',
    features: [
      '100% French Flax Linen',
      'Stonewashed for Ultimate Softness',
      'Natural Temperature Regulation',
      'Includes Duvet Cover & 2 Pillowcases',
    ],
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: '2',
    name: 'Mulberry Silk Sheet & Pillowcase Set',
    price: 5499,
    originalPrice: 6999,
    description:
      'Indulge in 22-Momme pure Grade 6A Mulberry Silk. Glides frictionlessly over skin and hair, locking in hydration while providing a cooling luxury sleep experience.',
    images: [
      '/Products/2.jpg',
      '/Products/2.png',
      '/Products/2 (1).png',
      '/Products/2 (2).png',
      '/Products/2 (3).png',
      '/Products/2 (4).png',
    ],
    category: 'Bedsheets',
    features: [
      '100% Grade 6A Mulberry Silk',
      '22-Momme Weight Density',
      'Hypoallergenic & Gentle on Skin',
      'Natural Moisture Retention',
    ],
    inStock: true,
    badge: 'New Arrival',
  },
  {
    id: '3',
    name: 'Classic Waffle Towel Set',
    price: 2499,
    originalPrice: 2999,
    description:
      'Ultra-absorbent, quick-drying honeycomb waffle towels woven from long-staple organic Aegean cotton. Designed to deliver spa-like luxury every day.',
    images: [
      '/Products/3.jpg',
      '/Products/3.png',
      '/Products/3 (1).png',
      '/Products/3 (2).png',
      '/Products/3 (3).png',
      '/Products/3 (4).png',
    ],
    category: 'Towels',
    features: [
      '100% Long-Staple Organic Cotton',
      'Deep Honeycomb Waffle Weave',
      'Ultra-Absorbent & Fast Drying',
      'Lint-Free & Compact Design',
    ],
    inStock: true,
  },
  {
    id: '4',
    name: 'Elegant Knit Cushion Cover',
    price: 1299,
    originalPrice: 1599,
    description:
      'Handcrafted chunky knit cushion cover that introduces rich tactile texture and cozy minimalist aesthetic to your living room sofa or bedroom.',
    images: [
      '/Products/4.jpg',
    ],
    category: 'Cushions',
    features: [
      'Hand-Knitted Premium Blend',
      'Concealed Seamless Zipper',
      'Removable & Machine Washable',
      'Fits Standard 18"x18" Inserts',
    ],
    inStock: true,
  },
  {
    id: '5',
    name: 'Plush Cloud Terry Bathrobe',
    price: 3299,
    originalPrice: 3999,
    description:
      'Wrap yourself in cloud-like warmth with our zero-twist plush terry cloth bathrobe. Engineered for exceptional softness and quick water absorption.',
    images: [
      '/Products/5.jpg',
      '/Products/5 (1).png',
      '/Products/5 (2).png',
      '/Products/5 (3).png',
    ],
    category: 'Bathrobes',
    features: [
      'Zero-Twist Long Staple Cotton',
      'Generous Shawl Collar & Deep Pockets',
      'Adjustable Waist Tie Belt',
      'High-Absorbency Weight',
    ],
    inStock: true,
    badge: 'Popular',
  },
  {
    id: '6',
    name: 'Cashmere & Cotton Blend Throw Blanket',
    price: 2199,
    originalPrice: 2799,
    description:
      'A featherlight throw blanket expertly woven with fine cashmere and organic cotton, featuring delicate hand-twisted fringe details for year-round warmth.',
    images: [
      '/Products/859294.png',
    ],
    category: 'Blankets',
    features: [
      'Sublime Cashmere & Cotton Blend',
      'Hand-Twisted Fringe Edging',
      'All-Season Lightweight Warmth',
      'Versatile Drape for Sofa or Bed',
    ],
    inStock: true,
  },
];

export const featuredProducts = products.slice(0, 3);
