import type { AppUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jorique.onrender.com';

interface ApiOptions extends RequestInit {
  token?: string | null;
}

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data as T;
}

export interface AuthResponse {
  token: string;
  user: AppUser;
}

export interface SignupResponse {
  message: string;
  email: string;
}

export function loginRequest(email: string, password: string) {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function signupRequest(fullName: string, email: string, password: string, role: AppUser['role']) {
  return apiRequest<SignupResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password, role }),
  });
}

export function verifyOtpRequest(email: string, otp: string) {
  return apiRequest<AuthResponse>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}

export function googleAuthRequest(idToken: string, role?: AppUser['role']) {
  return apiRequest<AuthResponse>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken, role }),
  });
}

export function meRequest(token: string) {
  return apiRequest<{ user: AppUser }>('/api/auth/me', { token });
}

export function dashboardRequest<T>(role: AppUser['role'], token: string) {
  return apiRequest<T>(`/api/dashboard/${role}`, { token });
}

export function createProductRequest(product: Record<string, unknown>, token: string) {
  return apiRequest<{ success: boolean; data: unknown }>('/api/products', {
    method: 'POST',
    body: JSON.stringify(product),
    token,
  });
}
