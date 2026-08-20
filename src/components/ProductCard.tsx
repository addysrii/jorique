import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  // Handle different image formats
  const getProductImage = () => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image_url) {
      return product.image_url;
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
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        {/* Image */}
        <div className="relative overflow-hidden rounded-xl bg-cream aspect-[4/5]">
          <motion.img
            src={getProductImage()}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-primary text-white text-[9px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full">
              {product.badge}
            </div>
          )}

          {/* Out of Stock */}
          {/* {(product.stock_quantity === 0 || product.stock_quantity === undefined) && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full">
              Out of Stock
            </div>
          )} */}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWishlisted((v) => !v);
            }}
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
          >
            <Heart
              size={14}
              strokeWidth={1.5}
              className={wishlisted ? 'fill-primary text-primary' : 'text-secondary'}
            />
          </button>

          {/* Quick View Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <p className="text-white text-xs font-medium tracking-widest uppercase text-center">
              View Details
            </p>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-3.5 px-0.5">
          <h3 className="text-sm font-medium text-text leading-snug group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm text-secondary font-medium">
              ₹ {getDisplayPrice().toLocaleString('en-IN')}
            </p>
            {hasDiscount() && (
              <p className="text-xs text-secondary/60 line-through">
                ₹ {product.price.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {/* Category */}
          {product.category && (
            <p className="mt-1 text-xs text-secondary/60">
              {product.category}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}