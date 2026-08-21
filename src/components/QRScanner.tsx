import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Loader2, X, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  onClose?: () => void;
}

export default function QRScanner({ onScanSuccess, onScanError, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerIdRef = useRef(`qr-reader-${Math.random().toString(36).slice(2, 11)}`);
  const mountedRef = useRef(true);
  const isStoppingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    setIsInitializing(true);

    const startScanner = async () => {
      if (!('mediaDevices' in navigator) || !navigator.mediaDevices?.getUserMedia) {
        if (mountedRef.current) {
          setCameraPermission(false);
          setError('This browser does not support camera scanning. Please use a modern browser.');
          setIsInitializing(false);
        }
        return;
      }

      try {
        if ('permissions' in navigator && navigator.permissions?.query) {
          const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
          if (permissionStatus.state === 'denied' && mountedRef.current) {
            setCameraPermission(false);
            setError('Camera access is denied. Please allow camera access in your browser settings.');
            setIsInitializing(false);
            return;
          }
        }

        if (mountedRef.current) {
          setCameraPermission(true);
          await initializeScanner();
        }
      } catch (err) {
        console.error('Camera permission error:', err);
        if (mountedRef.current) {
          setCameraPermission(false);
          setError('Unable to access camera. Please ensure your camera is connected and permissions are granted.');
          setIsInitializing(false);
        }
      }
    };

    startScanner();

    return () => {
      mountedRef.current = false;
      void stopScanner();
    };
  }, []);

  const initializeScanner = async () => {
    // CRITICAL FIX: Wait for the container DOM to exist
    await new Promise(resolve => setTimeout(resolve, 200));

    if (!containerRef.current || !containerRef.current.isConnected || !mountedRef.current) {
      setIsInitializing(false);
      return;
    }

    try {
      // CRITICAL FIX: MANUALLY CREATE the scanner div.
      // This prevents React from interfering and creating duplicate DOM nodes.
      const scannerElement = document.createElement('div');
      scannerElement.id = scannerIdRef.current;
      scannerElement.style.width = '100%';
      scannerElement.style.height = '100%';
      scannerElement.style.position = 'absolute';
      scannerElement.style.inset = '0';
      
      // Clear the container and append our manual element
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(scannerElement);

      // Clean up previous scanner instance
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {
          // ignore
        }
        scannerRef.current = null;
      }

      const scanner = new Html5Qrcode(scannerIdRef.current);
      scannerRef.current = scanner;

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await scanner.start(
        { facingMode: 'environment' },
        config,
        onScanSuccessCallback,
        onScanErrorCallback
      );

      if (mountedRef.current) {
        setIsScanning(true);
        setIsInitializing(false);
        setError(null);
      }
    } catch (err) {
      console.error('Scanner initialization error:', err);
      if (mountedRef.current) {
        setError('Failed to start camera. Please try again or use a different browser.');
        setIsScanning(false);
        setIsInitializing(false);
      }
    }
  };

  const onScanSuccessCallback = (decodedText: string) => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    stopScanner();
    
    const serialMatch = decodedText.match(/\/p\/([A-Z]{2}-[A-Z]{2}-\d{4}-\d{3}-\d{4})/);
    const serialNumber = serialMatch ? serialMatch[1] : decodedText;
    
    onScanSuccess(serialNumber);
  };

  const onScanErrorCallback = (errorMessage: string) => {
    if (onScanError && !errorMessage.includes('No MultiFormat Readers')) {
      onScanError(errorMessage);
    }
  };

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      if (mountedRef.current) setIsScanning(false);
      isStoppingRef.current = false;
      return;
    }

    try {
      await scanner.stop();
      await scanner.clear();
    } catch (err) {
      console.warn('Scanner cleanup warning:', err);
    } finally {
      scannerRef.current = null;
      if (mountedRef.current) setIsScanning(false);
      isStoppingRef.current = false;
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsInitializing(true);
    isStoppingRef.current = false;
    setTimeout(() => {
      if (mountedRef.current) {
        void initializeScanner();
      }
    }, 500);
  };

  const handleClose = () => {
    void stopScanner();
    if (onClose) onClose();
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* 
         THE ULTIMATE FIX:
         The library attaches to the ID we manually create in the useEffect.
         This outer div is just a styling wrapper.
      */}
      <div 
        ref={containerRef}
        className="w-full bg-black rounded-xl overflow-hidden relative"
        style={{ minHeight: '350px' }}
      />

      {/* Loading Overlay */}
      {isInitializing && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-gray-900/90 pointer-events-none">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <p className="mt-4 text-gray-300 text-sm">Starting camera...</p>
        </div>
      )}

      {/* Scanning Indicator */}
      {isScanning && !error && !isInitializing && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Scanning for QR code...</span>
        </div>
      )}

      {/* Close Button */}
      {onClose && (
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors z-20"
          aria-label="Close scanner"
        >
          <X size={20} />
        </button>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              {cameraPermission === false && (
                <p className="mt-2 text-xs text-red-600">
                  Please allow camera access in your browser settings and refresh the page.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}