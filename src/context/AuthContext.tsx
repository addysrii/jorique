import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AppUser } from '../types';
import { googleAuthRequest, loginRequest, meRequest, signupRequest, verifyOtpRequest } from '../lib/api';

interface AuthContextValue {
  user: AppUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: (idToken: string, role?: AppUser['role']) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: AppUser['role']
  ) => Promise<{ error: string | null; email?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const TOKEN_KEY = 'jorique_auth_token';

function saveToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    async function restoreSession() {
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { user: restoredUser } = await meRequest(storedToken);
        setUser(restoredUser);
        setToken(storedToken);
      } catch {
        saveToken(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const result = await loginRequest(email, password);
      setUser(result.user);
      setToken(result.token);
      saveToken(result.token);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to sign in.' };
    }
  };

  const signInWithGoogle = async (
    idToken: string,
    role: AppUser['role'] = 'user'
  ): Promise<{ error: string | null }> => {
    try {
      const result = await googleAuthRequest(idToken, role);
      setUser(result.user);
      setToken(result.token);
      saveToken(result.token);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Google sign in failed.' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: AppUser['role'] = 'user'
  ): Promise<{ error: string | null; email?: string }> => {
    try {
      const result = await signupRequest(fullName, email, password, role);
      return { error: null, email: result.email };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to create account.' };
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<{ error: string | null }> => {
    try {
      const result = await verifyOtpRequest(email, otp);
      setUser(result.user);
      setToken(result.token);
      saveToken(result.token);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to verify OTP.' };
    }
  };

  const signOut = async () => {
    saveToken(null);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signIn, signInWithGoogle, signUp, verifyOtp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
