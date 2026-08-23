import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Loader2, X, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  onClose?: () => void;
}

export default function QRScanner({ onScanSuccess, onScanError, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerIdRef = useRef(`qr-reader-${Math.random().toString(36).slice(2, 11)}`);
  const mountedRef = useRef(true);
  const isProcessingScanRef = useRef(false);
  const lastScanRef = useRef<{ value: string; timestamp: number } | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    const startScanner = async () => {
      if (!('mediaDevices' in navigator) || !navigator.mediaDevices?.getUserMedia) {
        if (mountedRef.current) {
          setCameraPermission(false);
          setError('This browser does not support camera scanning. Please use a modern browser.');
        }
        return;
      }

      try {
        if ('permissions' in navigator && navigator.permissions?.query) {
          const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });

          if (permissionStatus.state === 'denied' && mountedRef.current) {
            setCameraPermission(false);
            setError('Camera access is denied. Please allow camera access in your browser settings.');
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
    if (!containerRef.current || !containerRef.current.isConnected) return;

    try {
      isProcessingScanRef.current = false;
      const existing = scannerRef.current;
      if (existing) {
        try {
          await existing.stop();
        } catch {
          // ignore stale stop errors
        }
        scannerRef.current = null;
      }

      const scanner = new Html5Qrcode(scannerIdRef.current);
      scannerRef.current = scanner;

      const config = {
        fps: 10,
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
        setError(null);
      }
    } catch (err) {
      console.error('Scanner initialization error:', err);
      if (mountedRef.current) {
        setError('Failed to start camera. Please try again or use a different browser.');
        setIsScanning(false);
      }
    }
  };

  const extractSerialNumber = (decodedText: string): string => {
    const normalized = decodedText.trim();
    const serialRegex = /([A-Z]{2,4}-[A-Z]{2,4}-\d{4}-\d{3}-\d{4})/i;
    const serialMatch = normalized.match(serialRegex);

    if (!serialMatch) {
      return normalized;
    }

    return serialMatch[1].toUpperCase();
  };

  const onScanSuccessCallback = async (decodedText: string) => {
    const normalized = decodedText.trim();
    const now = Date.now();
    const lastScan = lastScanRef.current;

    if (lastScan && lastScan.value === normalized && now - lastScan.timestamp < 1500) {
      return;
    }

    if (isProcessingScanRef.current) {
      return;
    }

    isProcessingScanRef.current = true;
    lastScanRef.current = { value: normalized, timestamp: now };

    await stopScanner();
    onScanSuccess(extractSerialNumber(normalized));
  };

  const onScanErrorCallback = (errorMessage: string) => {
    // Ignore scan errors (they happen frequently during scanning)
    if (onScanError && !errorMessage.includes('No MultiFormat Readers')) {
      onScanError(errorMessage);
    }
  };

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      if (mountedRef.current) setIsScanning(false);
      return;
    }

    try {
      const state = scanner.getState && scanner.getState();
      if (state && state !== 2) {
        await scanner.stop().catch(() => undefined);
      }
      if (containerRef.current?.isConnected) {
        scanner.clear();
      }
    } catch (err) {
      console.warn('Scanner cleanup skipped:', err);
    } finally {
      scannerRef.current = null;
      if (mountedRef.current) setIsScanning(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    isProcessingScanRef.current = false;
    void initializeScanner();
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        id={scannerIdRef.current}
        className="w-full max-w-md mx-auto bg-black rounded-xl overflow-hidden"
        style={{ minHeight: '350px' }}
      />

      {!isScanning && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none rounded-xl bg-gray-900/90">
          <Camera className="w-16 h-16 text-gray-600 animate-pulse" />
          <p className="mt-4 text-gray-400 text-sm">Initializing camera...</p>
        </div>
      )}

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors z-10"
        >
          <X size={20} />
        </button>
      )}

      {/* Status Overlay */}
      {isScanning && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
          <Loader2 size={16} className="animate-spin" />
          <span>Scanning for QR code...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              {!cameraPermission && (
                <p className="mt-2 text-xs text-red-600">
                  Please allow camera access in your browser settings and refresh the page.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}