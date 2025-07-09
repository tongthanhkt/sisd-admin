import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { handleAuthError } from './auth-interceptor';

// Define base API configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include', // Include cookies in requests
    prepareHeaders: (headers, { getState }) => {
      headers.set('content-type', 'application/json');
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
  tagTypes: ['Product', 'Blog', 'User', 'Document'],
  endpoints: () => ({})
});
