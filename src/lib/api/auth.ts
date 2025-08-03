import { api } from '../api';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string; refreshToken: string; rule: string; userId: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: 'auth/jwt/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation<
      { accessToken: string; refreshToken: string },
      { userId: string; refreshToken: string }
    >({
      query: (credentials) => ({
        url: 'auth/jwt/refresh',
        method: 'POST',
        body: credentials,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/jwt/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
