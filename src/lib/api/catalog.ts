import { ICatalog, ICatalogProduct } from '@/types/stone-catalog';
import { api } from '../api';

const catalogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all documents
    getStoneCatalogs: builder.query<ICatalog[], void>({
      query: () => `stone-catalogs/with-products`,
      providesTags: ['Catalog']
    }),
    createStoneProduct: builder.mutation<
      ICatalogProduct,
      Omit<ICatalogProduct, 'id' | 'createdAt'>
    >({
      query: (product) => ({
        url: `stone-products`,
        method: 'POST',
        body: product
      }),
      invalidatesTags: ['Catalog']
    }),
    deleteStoneProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `stone-products/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Catalog']
    })
  })
});

export const {
  useGetStoneCatalogsQuery,
  useCreateStoneProductMutation,
  useDeleteStoneProductMutation
} = catalogsApi;
