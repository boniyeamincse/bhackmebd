import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

type RetryConfig = {
  _retry?: boolean;
  headers?: Record<string, string>;
  url?: string;
};

const REFRESH_PATH = '/auth/refresh';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api`,
});

let refreshPromise: Promise<string | null> | null = null;

const requestTokenRefresh = async (): Promise<string | null> => {
  const { refreshToken, setToken } = useAuthStore.getState();
  if (!refreshToken) return null;

  const res = await api.post(REFRESH_PATH, { refreshToken });
  const nextAccessToken = res.data?.accessToken || null;
  if (nextAccessToken) setToken(nextAccessToken);
  return nextAccessToken;
};

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = (error.config || {}) as RetryConfig;
    const status = error?.response?.status;

    if (!originalRequest || status !== 401 || originalRequest.url?.includes(REFRESH_PATH) || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = requestTokenRefresh().finally(() => {
          refreshPromise = null;
        });
      }

      const nextAccessToken = await refreshPromise;
      if (!nextAccessToken) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return api(originalRequest);
    } catch (refreshErr) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(refreshErr);
    }
  }
);

export default api;
