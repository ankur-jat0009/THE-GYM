const rawBase =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? '/api/v1'
    : 'https://the-gym-pc5f.onrender.com/api/v1');
const BASE_URL = rawBase.replace(/\/+$/, '');

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('thegym_token');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If endpoint requires auth and no token is present, avoid doomed request
  const isProtected =
    cleanEndpoint.startsWith('/users/me') ||
    cleanEndpoint.startsWith('/attendance') ||
    cleanEndpoint.startsWith('/admin') ||
    cleanEndpoint.startsWith('/notifications');

  if (isProtected && !token) {
    if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin')) {
      window.location.href = '/login';
    }
    throw new ApiError(401, 'Please sign in to access your gym portal');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If unauthorized, clear invalid/expired token
    if (!cleanEndpoint.includes('/auth/login') && !cleanEndpoint.includes('/auth/register')) {
      localStorage.removeItem('thegym_token');
      localStorage.removeItem('thegym_user');
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
  }

  if (response.status === 405) {
    throw new ApiError(
      405,
      'Backend API endpoint not reached. Please verify that VITE_API_BASE_URL in your Vercel settings points to your live Render backend (e.g. https://your-backend.onrender.com/api/v1) and not the static frontend domain.'
    );
  }

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      responseData?.detail || responseData?.message || `Request failed with status ${response.status}`;
    throw new ApiError(response.status, errorMsg, responseData);
  }

  return responseData as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
