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

export interface ProductSerial {
  id: string;
  product_id: string;
  serial_number: string;
  qr_code?: string;
  barcode?: string;
  status: 'available' | 'reserved' | 'sold' | 'returned' | 'damaged';
  reviewed: boolean;
  gift_claimed: boolean;
  created_at: string;
}

export interface ProductResponse {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  images: string[];
  tags: string[];
  serials?: ProductSerial[];
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  data: {
    product: ProductResponse;
    serials: ProductSerial[];
  };
}

export interface QRCodeResponse {
  serial_number: string;
  qr_code: string;
  qr_url: string;
  barcode: string;
}

export function createProductRequest(product: Record<string, unknown>, token: string) {
  return apiRequest<CreateProductResponse>('/api/products', {
    method: 'POST',
    body: JSON.stringify(product),
    token,
  });
}

export function getProductsRequest(token?: string) {
  const options: ApiOptions = { method: 'GET' };
  if (token) options.token = token;
  return apiRequest<{ success: boolean; data: ProductResponse[] }>('/api/products', options);
}

export function getProductByIdRequest(id: string, token?: string) {
  const options: ApiOptions = { method: 'GET' };
  if (token) options.token = token;
  return apiRequest<{ success: boolean; data: ProductResponse }>(`/api/products/${id}`, options);
}

export function getProductWithSerialsRequest(id: string, token?: string) {
  const options: ApiOptions = { method: 'GET' };
  if (token) options.token = token;
  return apiRequest<{ success: boolean; data: { product: ProductResponse; serials: ProductSerial[] } }>(
    `/api/products/${id}/serials`,
    options
  );
}

export function updateProductRequest(id: string, updates: Record<string, unknown>, token: string) {
  return apiRequest<{ success: boolean; data: ProductResponse }>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
    token,
  });
}

export function deleteProductRequest(id: string, token: string) {
  return apiRequest<{ success: boolean; message: string }>(`/api/products/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function generateQRRequest(serialNumber: string, token: string) {
  return apiRequest<{ success: boolean; data: QRCodeResponse }>('/api/qr/generate', {
    method: 'POST',
    body: JSON.stringify({ serialNumber }),
    token,
  });
}

export function getQRRequest(serialNumber: string, token?: string) {
  const options: ApiOptions = { method: 'GET' };
  if (token) options.token = token;
  return apiRequest<{ success: boolean; data: QRCodeResponse }>(`/api/qr/${serialNumber}`, options);
}

export function generateBulkQRRequest(serialNumbers: string[], token: string) {
  return apiRequest<{ success: boolean; data: QRCodeResponse[] }>('/api/qr/bulk', {
    method: 'POST',
    body: JSON.stringify({ serialNumbers }),
    token,
  });
}

export function getSerialByNumberRequest(serialNumber: string, token?: string) {
  const options: ApiOptions = { method: 'GET' };
  if (token) options.token = token;
  return apiRequest<{ success: boolean; data: ProductSerial & { product: ProductResponse } }>(
    `/api/products/serial/${serialNumber}`,
    options
  );
}

export function updateSerialStatusRequest(serialNumber: string, status: string, token: string) {
  return apiRequest<{ success: boolean; data: ProductSerial }>(`/api/products/serial/${serialNumber}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
    token,
  });
}

export function claimGiftRequest(serialNumber: string, token: string) {
  return apiRequest<{ success: boolean; message: string; data: { serial: ProductSerial; reward: string } }>(
    '/api/gifts/claim',
    {
      method: 'POST',
      body: JSON.stringify({ serialNumber }),
      token,
    }
  );
}

export function checkGiftEligibilityRequest(serialNumber: string) {
  return apiRequest<{
    success: boolean;
    data: {
      serial_number: string;
      product_name: string;
      gift_claimed: boolean;
      can_claim: boolean;
    };
  }>(`/api/gifts/check/${serialNumber}`, { method: 'GET' });
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping_address: string;
  payment_method: string;
  created_at: string;
}

export function getOrdersRequest(token: string) {
  return apiRequest<{ success: boolean; data: Order[] }>('/api/orders', { token });
}

export function getOrderByIdRequest(id: string, token: string) {
  return apiRequest<{ success: boolean; data: Order }>(`/api/orders/${id}`, { token });
}

export function createOrderRequest(order: Record<string, unknown>, token: string) {
  return apiRequest<{ success: boolean; data: Order }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order),
    token,
  });
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export function getReviewsByProductRequest(productId: string) {
  return apiRequest<{ success: boolean; data: Review[] }>(`/api/reviews/product/${productId}`, {
    method: 'GET',
  });
}

export function createReviewRequest(review: Record<string, unknown>, token: string) {
  return apiRequest<{ success: boolean; data: Review }>('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
    token,
  });
}

export function getAdminAnalyticsRequest(token: string) {
  return apiRequest<{
    success: boolean;
    data: {
      stats: Array<{ label: string; value: string }>;
      activity: string[];
    };
  }>('/api/analytics/admin', { token });
}

export function getDashboardDataRequest(role: 'admin' | 'user', token: string) {
  return apiRequest<{
    success: boolean;
    data: {
      stats: Array<{ label: string; value: string }>;
      activity?: string[];
      recentOrders?: Array<{ id: string; status: string; total: string }>;
    };
  }>(`/api/dashboard/${role}`, { token });
}

export default {
  loginRequest,
  signupRequest,
  verifyOtpRequest,
  googleAuthRequest,
  meRequest,
  dashboardRequest,
  getDashboardDataRequest,
  createProductRequest,
  getProductsRequest,
  getProductByIdRequest,
  getProductWithSerialsRequest,
  updateProductRequest,
  deleteProductRequest,
  generateQRRequest,
  getQRRequest,
  generateBulkQRRequest,
  getSerialByNumberRequest,
  updateSerialStatusRequest,
  claimGiftRequest,
  checkGiftEligibilityRequest,
  getOrdersRequest,
  getOrderByIdRequest,
  createOrderRequest,
  getReviewsByProductRequest,
  createReviewRequest,
  getAdminAnalyticsRequest,
};