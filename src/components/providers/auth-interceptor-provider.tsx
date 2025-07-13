'use client';

import { useEffect } from 'react';
import { refreshAccessToken } from '@/lib/auth-interceptor';
import { getCookie } from '@/lib/token-utils';

export default function AuthInterceptorProvider({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Override fetch to intercept 401 errors
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        console.log('🔄 AuthInterceptorProvider fetch', getCookie('refreshToken'));
        const response = await originalFetch(...args);

        // If response is 401, try to refresh token
        if (response.status === 401) {
          console.log('🔄 401 error detected, attempting to refresh token...');

          try {
            // Try to refresh token
            const newToken = await refreshAccessToken();

            if (newToken) {
              console.log('✅ Token refreshed, retrying original request...');
              // If refresh successful, retry the original request
              return originalFetch(...args);
            } else {
              console.log('❌ Token refresh failed, returning 401 response');
            }
          } catch (refreshError) {
            console.error('❌ Refresh token failed:', refreshError);
          }
        }

        return response;
      } catch (error) {
        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.error('Network error:', error);
        }
        throw error;
      }
    };

    // Cleanup function
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
}
