import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Gift, CheckCircle, XCircle, Sparkles, Copy } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Parallax3DCard from '../components/Parallax3DCard';
import { claimGift } from '../lib/api/products';

const GiftPage = () => {
  const [searchParams] = useSearchParams();
  const serial = searchParams.get('serial');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(false);
  const [rewardCode, setRewardCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleClaimGift = async () => {
    if (!serial) return;
    setLoading(true);
    setError(null);
    
    try {
      const result = await claimGift(serial);
      
      if (result.success) {
        setRewardCode(result.data?.reward_code || 'JORIQUE-GIFT');
        setClaimed(true);
      } else {
        setError(result.message || 'Failed to claim gift.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rewardCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] flex flex-col justify-between overflow-hidden transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-20">
        <div className="max-w-md w-full">
          
          {/* Error Screen */}
          {error && (
            <Parallax3DCard
              maxRotation={8}
              perspective={1200}
              glareEffect={true}
              className="rounded-3xl shadow-2xl"
            >
              <div className="bg-white dark:bg-[#1A1816] rounded-3xl p-8 text-center border border-border dark:border-[#2E2925] transform-style-3d">
                <div
                  className="w-16 h-16 bg-rose-100 dark:bg-rose-950/50 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-md mx-auto mb-4"
                  style={{ transform: 'translateZ(35px)' }}
                >
                  <XCircle size={32} />
                </div>
                <h1
                  className="text-xl font-light text-primary dark:text-white mb-2"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  Gift Claim Notice
                </h1>
                <p
                  className="text-xs text-secondary dark:text-white/70 mb-6 leading-relaxed"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  {error}
                </p>
                <button 
                  onClick={() => window.history.back()} 
                  className="px-6 py-2.5 bg-cream dark:bg-white/10 text-primary dark:text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-border transition-colors"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  Return
                </button>
              </div>
            </Parallax3DCard>
          )}

          {/* Success Screen */}
          {!error && claimed && (
            <Parallax3DCard
              maxRotation={10}
              perspective={1200}
              glareEffect={true}
              className="rounded-3xl shadow-2xl"
            >
              <div className="bg-white dark:bg-[#181615] text-primary dark:text-white rounded-3xl p-8 text-center border border-border dark:border-white/15 transform-style-3d relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />
                
                <div
                  className="w-16 h-16 bg-cream dark:bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#D4AF37] border border-border dark:border-white/20 shadow-md mx-auto mb-4"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <CheckCircle size={32} />
                </div>
                
                <span
                  className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4AF37] block mb-1"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  Exclusive Privilege
                </span>

                <h1
                  className="text-2xl font-light text-primary dark:text-white mb-2 tracking-wide"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  Reward Unlocked!
                </h1>

                <p
                  className="text-xs text-secondary dark:text-white/70 mb-6 leading-relaxed"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  Thank you for registering your genuine JORIQUE home textile piece.
                </p>
                
                {/* 3D Voucher Card */}
                <div
                  className="bg-cream/50 dark:bg-white/10 backdrop-blur-lg border border-border dark:border-white/20 p-5 rounded-2xl mb-6 transform-style-3d relative"
                  style={{ transform: 'translateZ(45px)' }}
                >
                  <p className="text-[10px] text-secondary dark:text-white/60 uppercase tracking-widest mb-1">Your Redemption Voucher</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-mono font-bold tracking-widest text-[#D4AF37]">
                      {rewardCode}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      aria-label="Copy code"
                      className="p-1.5 hover:bg-cream dark:hover:bg-white/20 rounded-lg text-primary dark:text-white/80 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  {copied && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block mt-1">Copied to clipboard!</span>
                  )}
                  <p className="text-[11px] text-secondary dark:text-white/60 mt-3">Apply at checkout for complimentary luxury benefits.</p>
                </div>
                
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="w-full py-3.5 bg-primary dark:bg-white text-white dark:text-primary text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 dark:hover:bg-cream transition-colors shadow-lg"
                  style={{ transform: 'translateZ(35px)' }}
                >
                  Continue Shopping
                </button>
              </div>
            </Parallax3DCard>
          )}

          {/* Default / Ready to Claim Screen */}
          {!error && !claimed && (
            <Parallax3DCard
              maxRotation={12}
              perspective={1400}
              glareEffect={true}
              className="rounded-3xl shadow-2xl"
            >
              <div className="bg-white dark:bg-[#1A1816] rounded-3xl p-8 text-center border border-border dark:border-[#2E2925] transform-style-3d relative overflow-hidden">
                <div
                  className="w-16 h-16 bg-cream dark:bg-white/10 rounded-2xl flex items-center justify-center text-primary dark:text-[#D4AF37] shadow-inner mx-auto mb-4"
                  style={{ transform: 'translateZ(35px)' }}
                >
                  <Gift size={30} strokeWidth={1.5} />
                </div>

                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream dark:bg-white/5 text-secondary dark:text-[#D4AF37] text-[10px] font-semibold tracking-widest uppercase mb-2 border border-border dark:border-[#2E2925]"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <Sparkles size={11} className="text-[#D4AF37]" />
                  Verified Registration
                </div>

                <h1
                  className="text-2xl font-light text-primary dark:text-white mb-2 tracking-wide"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  Claim Your Welcome Gift
                </h1>

                <p
                  className="text-xs text-secondary dark:text-white/70 mb-6 leading-relaxed"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  Serial Number: <span className="font-mono font-semibold text-primary dark:text-[#D4AF37]">{serial || 'PENDING'}</span>
                </p>
                
                <button
                  onClick={handleClaimGift}
                  disabled={loading}
                  className="w-full py-3.5 bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Unlocking Gift...
                    </span>
                  ) : (
                    'Claim Gift Voucher'
                  )}
                </button>
              </div>
            </Parallax3DCard>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GiftPage;