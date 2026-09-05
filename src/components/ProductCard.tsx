import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, MessageCircle, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import Parallax3DCard from './Parallax3DCard';
import ViewInYourRoomModal from './ViewInYourRoomModal';
import { useCart } from '../context/CartContext';
import { getBadgeColors } from '../lib/constants/collections';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [isArOpen, setIsArOpen] = useState(false);
  const { addToCart, buyNow } = useCart();

  // Handle different image formats
  const getProductImage = () => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return '/placeholder-image.jpg';
  };

  const getDisplayPrice = () => {
    return product.discount_price || product.price;
  };

  const hasDiscount = () => {
    return product.discount_price && product.discount_price < product.price;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product.sku}`} className="group block focus:outline-none">
        <Parallax3DCard
          maxRotation={9}
          perspective={1100}
          glareEffect={true}
          scaleOnHover={1.025}
          className="rounded-2xl transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-black/10"
        >
          {/* Image Container with 3D Depth */}
          <div className="relative overflow-hidden rounded-2xl bg-cream dark:bg-[#1C1A18] aspect-[4/5] transform-style-3d border border-border/60 dark:border-[#2E2925]">
            <motion.img
              src={getProductImage()}
              alt={product.name}
              className="w-full h-full object-cover will-change-transform brightness-[0.97] dark:brightness-[0.88]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transform: 'translateZ(0px)' }}
            />
            
            {/* 3D Floating Badge with Brand Collection Colors */}
            {product.badge && (() => {
              const bCol = getBadgeColors(product.badge);
              return (
                <div
                  className="absolute top-3.5 left-3.5 border backdrop-blur-md text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-md z-20 pointer-events-none"
                  style={{
                    backgroundColor: bCol.bg,
                    color: bCol.text,
                    borderColor: bCol.border || 'rgba(255,255,255,0.25)',
                    transform: 'translateZ(30px)',
                  }}
                >
                  {product.badge}
                </div>
              );
            })()}

            {/* 3D Floating AR Studio & Wishlist Buttons */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsArOpen(true);
                }}
                title="View in Your Room (AR)"
                className="p-2 bg-[#100E0D]/90 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-md rounded-full shadow-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300 hover:scale-110"
                style={{ transform: 'translateZ(35px)' }}
              >
                <Camera size={14} strokeWidth={2} />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setWishlisted((v) => !v);
                }}
                aria-label="Add to wishlist"
                className="p-2 bg-white/95 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 hover:bg-white dark:hover:bg-black hover:scale-110"
                style={{ transform: 'translateZ(35px)' }}
              >
                <Heart
                  size={14}
                  strokeWidth={1.5}
                  className={wishlisted ? 'fill-primary dark:fill-[#D4AF37] text-primary dark:text-[#D4AF37]' : 'text-secondary dark:text-white/70'}
                />
              </button>
            </div>

            {/* 3D Quick Action Overlay */}
            <div
              className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-30 flex items-center gap-2"
              style={{ transform: 'translateZ(25px)' }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="flex-1 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-1 shadow-md"
              >
                <ShoppingBag size={12} />
                <span>+ Bag</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  buyNow(product, 1);
                }}
                className="flex-1 py-2 rounded-xl bg-[#25D366] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-1 shadow-md"
              >
                <MessageCircle size={12} />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Product Info with Depth */}
          <div className="mt-3.5 px-1 transform-style-3d">
            <h3
              className="font-serif text-base font-semibold text-text dark:text-[#FCFAF7] leading-snug group-hover:text-[#C6A96B] transition-colors duration-200"
              style={{ transform: 'translateZ(10px)' }}
            >
              {product.name}
            </h3>
            
            {/* Price */}
            <div
              className="mt-1 flex items-center gap-2 font-sans"
              style={{ transform: 'translateZ(15px)' }}
            >
              <p className="text-sm text-primary dark:text-[#C6A96B] font-semibold">
                ₹ {getDisplayPrice().toLocaleString('en-IN')}
              </p>
              {hasDiscount() && (
                <p className="text-xs text-secondary/60 dark:text-white/40 line-through">
                  ₹ {product.price.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* Category */}
            {product.category && (
              <p
                className="mt-0.5 text-xs text-secondary/70 dark:text-white/50 tracking-wide font-sans"
                style={{ transform: 'translateZ(8px)' }}
              >
                {product.category}
              </p>
            )}
          </div>
        </Parallax3DCard>
      </Link>

      <ViewInYourRoomModal product={product} isOpen={isArOpen} onClose={() => setIsArOpen(false)} />
    </motion.div>
  );
}