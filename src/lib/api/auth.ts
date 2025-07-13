import { api } from '../api';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query for external API calls
const externalBaseQuery = fetchBaseQuery({
  baseUrl: '',
  credentials: 'omit', // Don't include credentials for external API
  prepareHeaders: (headers) => {
    headers.set('content-type', 'application/json');
    return headers;
  }
});

const authService = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string; refreshToken: string; rule: string; userId: string },
      { email: string; password: string }
    >({
      queryFn: async (credentials) => {
        try {
          const response = await fetch('http://localhost:3001/auth/jwt/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const data = await response.json();
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: 'Login failed' } };
        }
      }
    }),

    refreshToken: builder.mutation<
      { accessToken: string; refreshToken: string },
      { userId: string; refreshToken: string }
    >({
      queryFn: async (credentials) => {
        try {
          const response = await fetch('http://localhost:3001/auth/jwt/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
          });

          if (!response.ok) {
            throw new Error('Refresh token failed');
          }

          const data = await response.json();
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: 'Refresh token failed' } };
        }
      }
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      })
    })
  })
});

export const { useLoginMutation, useLogoutMutation, useRefreshTokenMutation } = authService;
