import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Gift, CheckCircle, XCircle } from 'lucide-react';

const GiftPage = () => {
  const [searchParams] = useSearchParams();
  const serial = searchParams.get('serial');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(false);
  const [rewardCode, setRewardCode] = useState('');
  const [productName] = useState(''); // We don't need to fetch this here; QR scanner already handled it.

  const handleClaimGift = async () => {
    if (!serial) return;
    setLoading(true);
    setError(null);
    
    try {
      // Call the backend API (from your gifts.js router)
      const response = await fetch('/api/gifts/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serial_number: serial })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Success! Get the reward code from the backend response
        setRewardCode(result.data?.redemption?.reward_code || 'JORIQUE-GIFT');
        setClaimed(true);
      } else {
        // Show the error message from the backend (e.g., "Gift already claimed")
        setError(result.message || 'Failed to claim gift.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- ERROR SCREEN ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <XCircle className="w-16 h-16 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-red-700">Gift Claim Failed</h1>
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

  // --- SUCCESS SCREEN ---
  if (claimed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="mt-4 text-2xl font-bold text-gray-800">Gift Claimed!</h1>
          <p className="mt-2 text-gray-600">You have successfully claimed your reward.</p>
          
          <div className="mt-6 bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Your Reward Code:</p>
            <p className="text-2xl font-bold text-orange-600 tracking-wider mt-1">{rewardCode}</p>
            <p className="mt-3 text-xs text-gray-400">Use this code at checkout to get your discount.</p>
          </div>
          
          <button 
            onClick={() => window.location.href = '/'} 
            className="mt-6 w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // --- DEFAULT / CLAIM SCREEN ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <Gift className="w-16 h-16 text-orange-500 mx-auto" />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Congratulations!</h1>
        <p className="mt-2 text-gray-600">You found a valid product.</p>
        <p className="mt-4 text-sm text-gray-500">Serial Number: <span className="font-bold text-gray-800">{serial}</span></p>
        
        <button
          onClick={handleClaimGift}
          disabled={loading}
          className="mt-6 w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Claiming...
            </span>
          ) : (
            'Claim Your Gift'
          )}
        </button>
      </div>
    </div>
  );
};

export default GiftPage;