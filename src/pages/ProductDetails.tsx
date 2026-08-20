import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Check, Truck, RefreshCw, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import QuantitySelector from '../components/QuantitySelector';
import Button from '../components/Button';
import { products } from '../data/products';

const shippingInfo = [
  { icon: <Truck size={14} strokeWidth={1.5} />, text: 'Free Shipping on orders above ₹1,999' },
  { icon: <RefreshCw size={14} strokeWidth={1.5} />, text: '15 Day Easy Returns' },
  { icon: <Shield size={14} strokeWidth={1.5} />, text: '100% Quality Guaranteed' },
];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-secondary">Product not found.</p>
        <Link to="/shop" className="text-xs font-medium tracking-widest uppercase text-primary border-b border-primary pb-0.5">
          Back to Shop
        </Link>
      </div>
    );
  }

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);
  const relatedFallback = products.filter((p) => p.id !== product.id).slice(0, 3);
  const relatedProducts = related.length >= 2 ? related : relatedFallback;

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const prevImage = () => setActiveImage((v) => (v - 1 + product.images.length) % product.images.length);
  const nextImage = () => setActiveImage((v) => (v + 1) % product.images.length);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 lg:pt-24">
        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between border-b border-border">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-secondary hover:text-primary transition-colors duration-200"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back
          </button>
          <button
            onClick={() => setWishlisted((v) => !v)}
            aria-label="Wishlist"
            className="p-1.5 text-secondary hover:text-primary transition-colors duration-200"
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className={wishlisted ? 'fill-primary text-primary' : ''}
            />
          </button>
        </div>

        {/* Product layout */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-cream">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={product.images[activeImage]}
                    alt={`${product.name} - view ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={14} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                    >
                      <ChevronRight size={14} strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                        activeImage === i ? 'border-primary' : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-center"
            >
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-3">
                {product.category}
              </p>
              <h1 className="text-2xl lg:text-3xl font-light text-primary leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-medium text-text mb-6">
                ₹ {product.price.toLocaleString('en-IN')}
              </p>

              <p className="text-sm text-secondary leading-relaxed mb-6 max-w-md">
                {product.description}
              </p>

              {/* Features */}
              <ul className="space-y-2.5 mb-8">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-secondary">
                    <span className="w-4 h-4 rounded-full bg-cream flex items-center justify-center flex-shrink-0">
                      <Check size={10} strokeWidth={2.5} className="text-primary" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Quantity + Add to Cart */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <QuantitySelector value={quantity} onChange={setQuantity} />
                <div className="flex-1 w-full sm:w-auto">
                  <Button onClick={handleAddToCart} fullWidth size="lg">
                    {added ? (
                      <span className="flex items-center gap-2">
                        <Check size={14} strokeWidth={2} />
                        Added to Cart
                      </span>
                    ) : (
                      'Add to Cart'
                    )}
                  </Button>
                </div>
              </div>

              {/* Shipping info */}
              <div className="border-t border-border pt-6 space-y-3">
                {shippingInfo.map((info) => (
                  <div key={info.text} className="flex items-center gap-3 text-secondary">
                    {info.icon}
                    <span className="text-xs tracking-wide">{info.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-border py-16 lg:py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-3">
                  You Might Also Like
                </p>
                <h2 className="text-2xl font-light text-primary">Related Products</h2>
              </motion.div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
