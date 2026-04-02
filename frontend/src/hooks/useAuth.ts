import { useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';

export const useAuth = () => {
  const { token, user, setAuth, clearAuth } = useAuthStore();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then((r) => r.data.user),
    enabled: !!token && !user,
    retry: false,
  });

  useEffect(() => {
    if (data) setAuth(data, token!);
  }, [data, setAuth, token]);

  const logout = () => {
    clearAuth();
    router.push('/');
  };

  return { user, token, logout, isAuthenticated: !!token };
};
