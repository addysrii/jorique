import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { claimGift, validateSerial } from '../lib/api/products';
import { Loader2, Gift, CheckCircle, XCircle } from 'lucide-react';

const GiftPage = () => {
  const [searchParams] = useSearchParams();
  const serial = searchParams.get('serial');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [claimed, setClaimed] = useState(false);
  const [rewardCode, setRewardCode] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!serial) {
        setError("Missing serial number.");
        setLoading(false);
        return;
      }

      try {
        // 1. Validate the serial and get product details
        const validation = await validateSerial(serial);
        
        if (!validation.valid) {
          setError(validation.message || 'Invalid QR Code');
          setLoading(false);
          return;
        }

        setProductName(validation.product_name || 'Unknown Product');

        if (validation.gift_claimed) {
          setError('Gift already claimed');
        }
      } catch (err) {
        setError('Failed to load gift details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serial]);

  const handleClaimGift = async () => {
    if (!serial) return;
    setClaimLoading(true);
    
    try {
      // Call your backend API or the service function
      const result = await claimGift(serial);
      
      if (result.success) {
        setRewardCode(result.data?.reward_code || 'GIFT-CLAIMED');
        setClaimed(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to claim gift.');
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="mt-4 text-gray-500">Validating your product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <XCircle className="w-16 h-16 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-red-700">Invalid Code</h1>
        <p className="mt-2 text-gray-600 text-center">{error}</p>
        <button 
          onClick={() => window.history.back()} 
          className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        {claimed ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="mt-4 text-2xl font-bold text-gray-800">Gift Claimed!</h1>
            <p className="mt-2 text-gray-600">You have successfully claimed your reward.</p>
            
            {rewardCode && (
              <div className="mt-6 bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Your Reward Code:</p>
                <p className="text-2xl font-bold text-orange-600 tracking-wider mt-1">{rewardCode}</p>
                <p className="mt-3 text-xs text-gray-400">Use this code at checkout to get your discount.</p>
              </div>
            )}
            
            <button 
              onClick={() => window.location.href = '/'} 
              className="mt-6 w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
            >
              Continue Shopping
            </button>
          </>
        ) : (
          <>
            <Gift className="w-16 h-16 text-orange-500 mx-auto" />
            <h1 className="mt-4 text-2xl font-bold text-gray-800">Congratulations!</h1>
            <p className="mt-2 text-gray-600">You found a valid product:</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{productName}</p>
            <p className="mt-4 text-sm text-gray-500">Serial: {serial}</p>
            
            <button
              onClick={handleClaimGift}
              disabled={claimLoading}
              className="mt-6 w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {claimLoading ? 'Claiming...' : 'Claim Your Gift'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GiftPage;