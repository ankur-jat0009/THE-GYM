const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

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

  // If endpoint requires auth and no token is present, avoid doomed request
  const isProtected =
    endpoint.startsWith('/users/me') ||
    endpoint.startsWith('/attendance') ||
    endpoint.startsWith('/admin') ||
    endpoint.startsWith('/notifications');

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

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If unauthorized, clear invalid/expired token
    if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      localStorage.removeItem('thegym_token');
      localStorage.removeItem('thegym_user');
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
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
