import { api } from '../api';

const authService = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { token: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      })
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      })
    })
  })
});

export const { useLoginMutation, useLogoutMutation } = authService;
