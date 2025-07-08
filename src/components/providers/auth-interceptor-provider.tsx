'use client';

import { useEffect } from 'react';
import { setupAuthInterceptor } from '@/lib/auth-interceptor';

export default function AuthInterceptorProvider({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Setup global auth interceptor on client side
    if (typeof window !== 'undefined') {
      setupAuthInterceptor();
    }
  }, []);

  return <>{children}</>;
}
