import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { AppUser } from '../types';

interface GoogleAuthButtonProps {
  role?: AppUser['role'];
  onSuccess?: () => void;
  onError?: (error: string) => void;
  text?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          prompt: () => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; width?: number; text?: string }
          ) => void;
        };
      };
    };
  }
}

export default function GoogleAuthButton({
  role = 'user',
  onSuccess,
  onError,
  text = 'Continue with Google',
}: GoogleAuthButtonProps) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [gsiLoaded, setGsiLoaded] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID') return;

    function initGsi() {
      if (window.google?.accounts?.id) {
        setGsiLoaded(true);
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse,
          });
        } catch (e) {
          console.warn('GSI init:', e);
        }
      }
    }

    if (window.google?.accounts?.id) {
      initGsi();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initGsi();
    };
    document.body.appendChild(script);
  }, [googleClientId, role]);

  async function handleCredentialResponse(response: { credential: string }) {
    if (!response.credential) return;

    setLoading(true);
    const result = await signInWithGoogle(response.credential, role);
    setLoading(false);

    if (result.error) {
      onError?.(result.error);
    } else {
      onSuccess?.();
    }
  }

  function handleClick() {
    if (loading) return;

    if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID') {
      onError?.(
        'Google Client ID is missing. Please configure VITE_GOOGLE_CLIENT_ID in your .env file.'
      );
      return;
    }

    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.prompt();
      } catch {
        onError?.('Failed to launch Google Sign-In.');
      }
    } else if (!gsiLoaded) {
      onError?.('Google Sign-In SDK is loading. Please try again in a moment.');
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1A1816] hover:bg-neutral-50 dark:hover:bg-[#221F1C] text-primary dark:text-white border border-border dark:border-[#2E2925] rounded-xl py-3.5 px-4 text-xs font-semibold tracking-widest uppercase transition-all shadow-sm hover:shadow hover:border-gray-300 dark:hover:border-[#D4AF37]/50 disabled:opacity-60"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin text-primary dark:text-[#D4AF37]" />
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      )}
      <span>{text}</span>
    </button>
  );
}
