import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { handleAuthError } from './auth-interceptor';
import { getCookie, shouldRefreshToken } from './token-utils';

// Đổi baseUrl sang backend mới
const BACKEND_API_URL = `${process.env.NEXT_PUBLIC_API_URL}`; // <-- Đổi thành URL backend thật của bạn

// Define base API configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_API_URL,
    credentials: 'include', // Include cookies in requests
    prepareHeaders: async (headers, { getState, endpoint }) => {
      headers.set('content-type', 'application/json');
      headers.set('description', 'SIS_OPS');
      // Don't include credentials for external API calls
      if (endpoint === 'login' || endpoint === 'refreshToken') {
        headers.delete('cookie');
        return headers;
      }

      // Add Authorization header for internal API calls
      const accessToken = getCookie('accessToken');
      if (accessToken) {
        // Check if token is about to expire and should be refreshed
        if (shouldRefreshToken(accessToken, 30)) {
          console.log('🔄 Token is about to expire, triggering refresh...');
          // Note: The actual refresh will be handled by the auth interceptor
        }

        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      return headers;
    },
    responseHandler: async (response) => {
      // Handle 401 errors globally
      if (response.status === 401) {
        handleAuthError({ status: 401 });
        throw new Error('Authentication failed');
      }

      // For successful responses, parse as JSON if possible
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }

      return response.text();
    }
  }),
  tagTypes: [
    'Product',
    'Blog',
    'User',
    'Document',
    'Contact',
    'ActivityLog',
    'Catalog',
    'faq',
    'HomeVideo'
  ],
  endpoints: () => ({})
});
