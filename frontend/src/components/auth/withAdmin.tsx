import { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/auth.store';

export function withAdmin<P extends object>(WrappedComponent: ComponentType<P>) {
  function AdminComponent(props: P) {
    const router = useRouter();
    const token = useAuthStore((s) => s.token);
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
      if (!token) {
        router.replace('/login');
        return;
      }
      if (user && user.role !== 'admin') {
        router.replace('/dashboard');
      }
    }, [token, user, router]);

    if (!token || !user || user.role !== 'admin') return null;

    return <WrappedComponent {...(props as P)} />;
  }

  AdminComponent.displayName = `withAdmin(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AdminComponent;
}
