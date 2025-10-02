import { auth } from './firebase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requireAuth = false, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add authentication token if user is logged in
  const user = auth.currentUser;
  if (user || requireAuth) {
    try {
      const token = await user?.getIdToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (requireAuth) {
        throw new Error('Authentication required');
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
      if (requireAuth) {
        throw error;
      }
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string, requireAuth = false) =>
    apiRequest<T>(endpoint, { method: 'GET', requireAuth }),

  post: <T = any>(endpoint: string, data: any, requireAuth = false) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth,
    }),

  put: <T = any>(endpoint: string, data: any, requireAuth = false) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth,
    }),

  delete: <T = any>(endpoint: string, requireAuth = false) =>
    apiRequest<T>(endpoint, { method: 'DELETE', requireAuth }),
};