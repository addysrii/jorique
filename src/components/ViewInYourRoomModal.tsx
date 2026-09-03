import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Camera,
  RotateCw,
  Sun,
  Moon,
  Sparkles,
  Maximize2,
  Check,
  ShoppingBag,
  MessageCircle,
  Sliders,
  Layers,
  Image as ImageIcon,
  Compass,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ViewInYourRoomModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ROOM_TEMPLATES = [
  {
    id: 'master-bedroom',
    name: 'Master Suite',
    subtitle: 'Luxury Modern Bedroom',
    image: '/images/hero.png',
  },
  {
    id: 'nordic-suite',
    name: 'Nordic Loft',
    subtitle: 'Minimalist Natural Light',
    image: '/Products/1.jpg',
  },
  {
    id: 'penthouse-lounge',
    name: 'Penthouse Lounge',
    subtitle: 'Atmospheric Evening Setting',
    image: '/Products/2.jpg',
  },
];

const LIGHT_MODES = [
  { id: 'daylight', name: 'Natural Daylight', class: 'brightness-100 contrast-100' },
  { id: 'warm', name: 'Warm Evening Glow', class: 'brightness-95 sepia-[0.25] contrast-[1.05]' },
  { id: 'candle', name: 'Ambient Candlelight', class: 'brightness-85 sepia-[0.4] contrast-110' },
];

export default function ViewInYourRoomModal({ product, isOpen, onClose }: ViewInYourRoomModalProps) {
  const { buyNow, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'virtual' | 'camera'>('virtual');
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [activeLight, setActiveLight] = useState('daylight');
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Camera AR State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen && activeTab === 'camera') {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
            setCameraActive(true);
            setCameraError(null);
          }
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          setCameraError('Camera access required for AR view. Please allow camera permissions or use Virtual Room Simulator.');
          setCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, activeTab]);

  if (!isOpen || !product) return null;

  const currentRoom = ROOM_TEMPLATES[activeRoomIndex];
  const currentLightConfig = LIGHT_MODES.find((l) => l.id === activeLight) || LIGHT_MODES[0];
  const productImage = product.images[0] || '/placeholder-image.jpg';

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setRotation(0);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-lg overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl bg-[#12100E] text-white rounded-3xl border border-white/15 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/15 bg-white/5 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-inner">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#D4AF37]">
                    JORIQUE AR SPATIAL STUDIO
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                    Live 3D Room Visualizer
                  </span>
                </div>
                <h3 className="text-lg font-light text-white tracking-wide truncate max-w-md">
                  View "{product.name}" in Your Space
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Tab Selector */}
              <div className="flex bg-white/10 p-1 rounded-xl border border-white/15">
                <button
                  onClick={() => setActiveTab('virtual')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === 'virtual'
                      ? 'bg-[#D4AF37] text-black shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Layers size={13} />
                  <span>3D Room Studio</span>
                </button>
                <button
                  onClick={() => setActiveTab('camera')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === 'camera'
                      ? 'bg-[#D4AF37] text-black shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Camera size={13} />
                  <span>Live Camera AR</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/15 text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Interactive Stage */}
          <div className="relative flex-1 min-h-[380px] sm:min-h-[480px] bg-[#0A0908] flex items-center justify-center overflow-hidden">
            
            {activeTab === 'virtual' ? (
              /* Virtual 3D Room Stage */
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Background Room Canvas with Light Atmosphere Filter */}
                <div className={`absolute inset-0 transition-all duration-700 ${currentLightConfig.class}`}>
                  <img
                    src={currentRoom.image}
                    alt={currentRoom.name}
                    className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
                </div>

                {/* Overlaid 3D Product Texture Canvas */}
                <motion.div
                  animate={{
                    rotate: rotation,
                    scale: scale,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className="relative z-20 cursor-grab active:cursor-grabbing max-w-[320px] sm:max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-2 border-white/40 group"
                >
                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-full object-cover brightness-[0.95] contrast-[1.08] pointer-events-none"
                  />

                  {/* Dimension Overlay Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-mono text-white/90 shadow-lg">
                    <span>90" × 108" • King Standard</span>
                  </div>

                  {/* Texture Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
                </motion.div>

                {/* Room Info Tag */}
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-white">
                  <Compass size={14} className="text-[#D4AF37]" />
                  <span>{currentRoom.name} — {currentLightConfig.name}</span>
                </div>
              </div>
            ) : (
              /* Live Camera AR Stage */
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
                {cameraError ? (
                  <div className="p-8 text-center max-w-md space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg">
                      <AlertCircle size={28} />
                    </div>
                    <p className="text-xs text-white/80 font-light leading-relaxed">
                      {cameraError}
                    </p>
                    <button
                      onClick={() => setActiveTab('virtual')}
                      className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider shadow-md hover:bg-opacity-90 transition-all"
                    >
                      Switch to 3D Room Simulator
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover brightness-[0.95]"
                    />

                    {/* Projected AR Product Cutout */}
                    <motion.div
                      animate={{ rotate: rotation, scale: scale }}
                      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                      className="absolute z-20 w-64 sm:w-80 aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-white/50 cursor-move"
                    >
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover brightness-100"
                      />
                      <div className="absolute top-2 left-2 bg-emerald-500 text-black font-bold text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <Zap size={10} /> Live AR Tracking
                      </div>
                    </motion.div>

                    {/* Camera Guidance Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs text-white/90 text-center shadow-2xl z-30">
                      Point camera at your bed/sofa to place "{product.name}"
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-4 right-4 z-40 flex items-center gap-2 bg-black/80 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
              <button
                onClick={handleRotate}
                title="Rotate 90°"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
              >
                <RotateCw size={16} />
              </button>
              <button
                onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
                title="Zoom In"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 font-bold text-xs"
              >
                +
              </button>
              <button
                onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}
                title="Zoom Out"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 font-bold text-xs"
              >
                -
              </button>
              <button
                onClick={handleReset}
                title="Reset Position"
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all text-xs font-semibold uppercase tracking-wider"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Footer Controls & Room Selectors */}
          <div className="p-5 border-t border-white/15 bg-white/5 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
            
            {/* Room Template & Lighting Selector */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <span className="text-xs text-white/60 font-semibold uppercase tracking-wider">Interiors:</span>
              <div className="flex gap-2">
                {ROOM_TEMPLATES.map((room, idx) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoomIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                      idx === activeRoomIndex
                        ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                        : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>

              <span className="text-xs text-white/60 font-semibold uppercase tracking-wider ml-2">Light:</span>
              <div className="flex gap-1.5">
                {LIGHT_MODES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLight(l.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      activeLight === l.id
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Purchase Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => {
                  addToCart(product, 1);
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <ShoppingBag size={15} />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => {
                  buyNow(product, 1);
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
              >
                <MessageCircle size={17} />
                <span>Buy via WhatsApp</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
