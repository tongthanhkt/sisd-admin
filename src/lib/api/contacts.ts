import { api } from './index';

export const contactsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getContacts: build.query<
      any,
      {
        page?: number;
        perPage?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
      }
    >({
      query: ({
        page = 1,
        perPage = 10,
        search = '',
        sortBy = 'createdAt',
        sortOrder = 'asc'
      }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('perPage', String(perPage));
        if (search) params.set('search', search);
        if (sortBy) params.set('sortBy', sortBy);
        if (sortOrder) params.set('sortOrder', sortOrder);
        return `/contacts?${params.toString()}`;
      },
      providesTags: ['Contact']
    })
  })
});

export const { useGetContactsQuery } = contactsApi;
