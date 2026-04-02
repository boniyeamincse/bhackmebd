import { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/auth.store';

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  function ProtectedComponent(props: P) {
    const router = useRouter();
    const token = useAuthStore((s) => s.token);

    useEffect(() => {
      if (!token) {
        router.replace('/login');
      }
    }, [token, router]);

    if (!token) return null;

    return <WrappedComponent {...(props as P)} />;
  }

  ProtectedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return ProtectedComponent;
}
