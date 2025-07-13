import { getCookie, setCookie, removeCookie, clearAuthCookies } from './token-utils';
import { extractJWTPayload } from './jwt-edge';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

export const handleAuthError = async ({ status }: { status: number }) => {
  if (status === 401) {
    // Redirect to login page
    window.location.href = '/auth/login';
  }
};

export const refreshAccessToken = async () => {
  const currentRefreshToken = getCookie('refreshToken');
  const currentUserId = getCookie('userId');

  if (!currentRefreshToken || !currentUserId) {
    console.log('No refresh token or userId available');
    return false;
  }

  try {
    console.log('🔄 Attempting to refresh access token...');

    const response = await fetch('http://localhost:3001/auth/jwt/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUserId,
        refreshToken: currentRefreshToken
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Refresh token failed:', response.status, errorText);
      throw new Error(`Refresh token failed: ${response.status}`);
    }

    const data = await response.json();

    // Update cookies with new tokens
    setCookie('accessToken', data.accessToken, 7);
    if (data.refreshToken) {
      setCookie('refreshToken', data.refreshToken, 7);
    }
    // Extract userId from new accessToken
    try {
      const payload = extractJWTPayload(data.accessToken);
      console.log('🔄 Payload:', payload);
      if (payload.userId || payload.sub) {
        setCookie('userId', payload.userId || payload.sub, 7);
      }
    } catch (e) {
      console.warn('Could not extract userId from refreshed accessToken');
    }

    console.log('✅ Token refreshed successfully');
    return data.accessToken;
  } catch (error) {
    console.error('❌ Refresh token error:', error);

    // Clear all auth cookies on refresh failure
    clearAuthCookies();

    // Redirect to login
    window.location.href = '/auth/login';
    return false;
  }
};

export const createAuthInterceptor = () => {
  const interceptor = async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return fetch(originalRequest.url, originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return fetch(originalRequest.url, originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  };

  return interceptor;
};
