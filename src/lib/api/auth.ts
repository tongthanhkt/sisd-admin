import { api } from '../api';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuthCookies, clearAllAuthData } from '../token-utils';

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
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'description': 'OPS_LOGIN'
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
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'description': 'OPS_REFRESH_TOKEN'
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
      queryFn: async () => {
        try {
          // Gọi API logout để thông báo cho server
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'description': 'OPS_LOGOUT'
            }
          });

          // Xóa tất cả dữ liệu authentication
          clearAllAuthData();

          return { data: undefined };
        } catch (error) {
          // Ngay cả khi API call thất bại, vẫn xóa tất cả dữ liệu authentication
          clearAllAuthData();

          return { error: { status: 'FETCH_ERROR', error: 'Logout failed but cookies cleared' } };
        }
      }
    })
  })
});

export const { useLoginMutation, useLogoutMutation, useRefreshTokenMutation } = authService;
