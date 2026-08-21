import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import QRScanner from '../components/QRScanner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { validateSerial } from '../lib/api/products';

type ScanStatus = 'idle' | 'scanning' | 'validating' | 'success' | 'error' | 'claimed';

export default function ScanPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [productName, setProductName] = useState<string>('');

  const handleScanSuccess = async (serial: string) => {
    setSerialNumber(serial);
    setStatus('validating');
    
    try {
      const result = await validateSerial(serial);
      
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
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to validate serial');
    }
  };

  const handleScanError = (error: string) => {
    // Log but don't show to user (frequent during scanning)
    console.debug('Scan error:', error);
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleRetry = () => {
    setStatus('idle');
    setErrorMessage('');
    setSerialNumber('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-lg mx-auto px-4 py-8 pt-28">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-light text-gray-900">Scan QR Code</h1>
        </div>

        {/* Scanner or Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {status === 'idle' && (
            <>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  Scan the QR code on your JORIQUE product to claim your gift
                </p>
              </div>
              <QRScanner 
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
                onClose={handleClose}
              />
            </>
          )}

          {/* Validating State */}
          {status === 'validating' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="text-primary animate-spin" />
              <p className="mt-4 text-sm text-gray-600">Validating your product...</p>
              <p className="mt-1 text-xs text-gray-400 font-mono">{serialNumber}</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Valid Product!</h2>
              <p className="mt-1 text-sm text-gray-600 text-center">
                {productName || 'Your product has been verified'}
              </p>
              <p className="mt-1 text-xs text-gray-400 font-mono">{serialNumber}</p>
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                <span>Redirecting to review...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Invalid QR Code</h2>
              <p className="mt-2 text-sm text-gray-600 text-center max-w-xs">
                {errorMessage || 'The QR code you scanned is not valid. Please check the code and try again.'}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Scan Again
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Go to Shop
                </button>
              </div>
            </div>
          )}

          {/* Already Claimed State */}
          {status === 'claimed' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Gift Already Claimed</h2>
              <p className="mt-2 text-sm text-gray-600 text-center max-w-xs">
                This product's gift has already been claimed.
                {productName && ` (${productName})`}
              </p>
              <p className="mt-1 text-xs text-gray-400 font-mono">{serialNumber}</p>
              <button
                onClick={() => navigate('/shop')}
                className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Help Text */}
        {status === 'idle' && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Position the QR code within the frame to scan
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Need help? <button className="text-primary hover:underline">Contact Support</button>
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}