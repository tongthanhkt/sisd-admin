import { api } from './index';

const getContactsExternal = async ({ page = 1, perPage = 10, search = '', sortBy = 'createdAt', sortOrder = 'asc' }) => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('perPage', String(perPage));
  if (search) params.set('search', search);
  if (sortBy) params.set('sortBy', sortBy);
  if (sortOrder) params.set('sortOrder', sortOrder);

  // Lấy accessToken từ cookie nếu cần
  let accessToken = '';
  if (typeof document !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; accessToken=`);
    if (parts.length === 2) accessToken = parts.pop()?.split(';').shift() || '';
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    },
    credentials: 'omit'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contacts');
  }

  return response.json();
};

export const contactsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getContacts: build.query<any, {
      page?: number;
      perPage?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
    }>({
      queryFn: async (params) => {
        try {
          const data = await getContactsExternal(params);
          return { data };
        } catch (error: any) {
          return { error: { status: 'FETCH_ERROR', error: error.message || 'Failed to fetch contacts' } };
        }
      },
      providesTags: ['Contact']
    })
  })
});

export const { useGetContactsQuery } = contactsApi;
