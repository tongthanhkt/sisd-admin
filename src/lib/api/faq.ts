import { IFaqRequest } from '@/types';
import { api } from '../api';

const faqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createFaq: builder.mutation<IFaqRequest, IFaqRequest>({
      query: (faq) => ({
        url: 'faqs',
        method: 'POST',
        body: faq
      }),
      invalidatesTags: ['faq']
    }),
    updateFaq: builder.mutation<
      IFaqRequest,
      { id: string; data: Omit<IFaqRequest, 'id'> }
    >({
      query: ({ id, data }) => ({
        url: `faqs/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['faq']
    }),
    getFaq: builder.query<IFaqRequest, string>({
      query: (id) => `faqs/${id}`,
      providesTags: ['faq']
    })
  })
});

export const { useCreateFaqMutation, useUpdateFaqMutation, useGetFaqQuery } =
  faqApi;
