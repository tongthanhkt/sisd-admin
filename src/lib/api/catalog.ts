import { ICatalog } from '@/types/stone-catalog';
import { api } from '../api';

const catalogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all documents
    getStoneCatalogs: builder.query<ICatalog[], void>({
      query: () => `stone-catalogs/with-products`
    })
  })
});

export const { useGetStoneCatalogsQuery } = catalogsApi;
