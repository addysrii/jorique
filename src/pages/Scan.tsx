import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, Sparkles, QrCode } from 'lucide-react';
import QRScanner from '../components/QRScanner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Parallax3DCard from '../components/Parallax3DCard';
import { validateSerial } from '../lib/api/products';

type ScanStatus = 'idle' | 'scanning' | 'validating' | 'success' | 'error' | 'claimed';

export default function ScanPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const activeRequestIdRef = useRef(0);
  const scanLockedRef = useRef(false);

  const handleScanSuccess = async (serial: string) => {
    if (scanLockedRef.current) return;

    scanLockedRef.current = true;
    const requestId = ++activeRequestIdRef.current;
    setSerialNumber(serial);
    setStatus('validating');
    
    try {
      const result = await validateSerial(serial);

      if (requestId !== activeRequestIdRef.current) return;
      
      if (!result.valid) {
        setStatus('error');
        setErrorMessage(result.message || 'Invalid serial number');
        return;
      }
      
      if (result.gift_claimed) {
        setStatus('claimed');
        setProductName(result.product_name || '');
        return;
      }
      
      // Success - redirect to review page with serial
      setStatus('success');
      setProductName(result.product_name || '');
      
      // Navigate to review page after brief delay
      setTimeout(() => {
        navigate(`/review/${serial}`, { 
          state: { 
            productName: result.product_name,
            serialNumber: serial 
          } 
        });
      }, 1500);
      
    } catch (error) {
      if (requestId !== activeRequestIdRef.current) return;
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to validate serial');
    }
  };

  const handleScanError = (error: string) => {
    console.debug('Scan error:', error);
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleRetry = () => {
    activeRequestIdRef.current += 1;
    scanLockedRef.current = false;
    setStatus('idle');
    setErrorMessage('');
    setSerialNumber('');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300 overflow-hidden">
      <Navbar />
      
      <main className="max-w-lg mx-auto px-4 py-8 pt-28">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-cream dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-light text-primary dark:text-white">Authenticate Product</h1>
            <p className="text-xs text-secondary dark:text-white/60">Verify authenticity & claim bespoke gift</p>
          </div>
        </div>

        {/* 3D Holographic Scanner Card */}
        <Parallax3DCard
          maxRotation={8}
          perspective={1200}
          glareEffect={true}
          scaleOnHover={1.01}
          className="rounded-3xl shadow-xl border border-border dark:border-[#2E2925] overflow-hidden"
        >
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl p-6 transform-style-3d relative">
            {status === 'idle' && (
              <>
                <div
                  className="text-center mb-6 transform-style-3d"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream dark:bg-white/5 text-primary dark:text-[#D4AF37] text-[10px] font-semibold tracking-widest uppercase mb-2 border border-border dark:border-[#2E2925]">
                    <Sparkles size={11} className="text-[#D4AF37]" />
                    JORIQUE Authenticator
                  </div>
                  <p className="text-xs text-secondary dark:text-white/60 max-w-xs mx-auto">
                    Align the QR code on your product packaging inside the sensor grid
                  </p>
                </div>
                
                <div
                  className="transform-style-3d rounded-2xl overflow-hidden"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <QRScanner 
                    onScanSuccess={handleScanSuccess}
                    onScanError={handleScanError}
                    onClose={handleClose}
                  />
                </div>
              </>
            )}

            {/* Validating State */}
            {status === 'validating' && (
              <div className="flex flex-col items-center justify-center py-16 transform-style-3d">
                <div
                  className="w-16 h-16 rounded-2xl bg-cream dark:bg-white/10 flex items-center justify-center text-primary dark:text-[#D4AF37] shadow-inner mb-4 animate-pulse"
                  style={{ transform: 'translateZ(35px)' }}
                >
                  <Loader2 size={32} className="animate-spin" />
                </div>
                <h3
                  className="text-base font-medium text-primary dark:text-white mb-1"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  Verifying Cryptographic Tag
                </h3>
                <p
                  className="text-xs text-secondary dark:text-white/60 font-mono"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  {serialNumber}
                </p>
              </div>
            )}

            {/* Success State */}
            {status === 'success' && (
              <div className="flex flex-col items-center justify-center py-16 transform-style-3d text-center">
                <div
                  className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md mb-4"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <CheckCircle size={32} />
                </div>
                <h2
                  className="text-lg font-medium text-primary dark:text-white mb-1"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  Certified Genuine Product
                </h2>
                <p
                  className="text-xs text-secondary dark:text-white/70 max-w-xs mb-3"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {productName || 'Your product has been validated in the JORIQUE registry.'}
                </p>
                <div
                  className="flex items-center gap-2 text-xs text-secondary dark:text-white/50 font-mono"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  <Loader2 size={13} className="animate-spin" />
                  <span>Loading review studio...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="flex flex-col items-center justify-center py-14 transform-style-3d text-center">
                <div
                  className="w-16 h-16 bg-rose-100 dark:bg-rose-950/50 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-md mb-4"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <AlertCircle size={32} />
                </div>
                <h2
                  className="text-base font-medium text-primary dark:text-white mb-1"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  Authentication Notice
                </h2>
                <p
                  className="text-xs text-secondary dark:text-white/70 max-w-xs mb-6 leading-relaxed"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {errorMessage}
                </p>
                <button
                  onClick={handleRetry}
                  className="px-6 py-2.5 rounded-xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:bg-primary/90 shadow-md transition-all"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  Scan Another Code
                </button>
              </div>
            )}

            {/* Claimed State */}
            {status === 'claimed' && (
              <div className="flex flex-col items-center justify-center py-14 transform-style-3d text-center">
                <div
                  className="w-16 h-16 bg-amber-100 dark:bg-amber-950/50 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-md mb-4"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <AlertCircle size={32} />
                </div>
                <h2
                  className="text-base font-medium text-primary dark:text-white mb-1"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  Gift Voucher Already Claimed
                </h2>
                <p
                  className="text-xs text-secondary dark:text-white/70 max-w-xs mb-6 leading-relaxed"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  The complimentary gift reward for this product unit ({productName}) has already been redeemed.
                </p>
                <button
                  onClick={handleRetry}
                  className="px-6 py-2.5 rounded-xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:bg-primary/90 shadow-md transition-all"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  Scan Another Code
                </button>
              </div>
            )}
          </div>
        </Parallax3DCard>
      </main>

      <Footer />
    </div>
  );
}