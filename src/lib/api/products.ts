import { IMutateProduct } from '@/types';
import { api } from '../api';
import { IMortalProduct } from '@/models/MortalProduct';

// Product types based on current MortalProduct schema
export interface Product {
  _id: string;
  name?: string;
  code?: string;
  image?: string;
  shortDescription?: string;
  category?: string;
  description?: string;
  images?: {
    main?: string;
    thumbnails?: string[];
  };
  advantages?: string[];
  packaging?: string;
  technicalSpecifications?: {
    standard?: string;
    specifications?: Array<{
      stt?: number;
      category?: string;
      performance?: string;
    }>;
  };
  transportationAndStorage?: string[];
  safetyRegulations?: {
    warning?: string;
    notes?: string;
  };
  isFeatured?: boolean;
  relatedBlogs?: string[];
  relatedProduct?: string[];
  createdAt: string;
  updatedAt: string;
}

// API Response structure
export interface ProductsResponse {
  products: Product[];
  total_products: number;
  current_page: number;
  total_pages: number;
}

export interface UpdateProductRequest extends Partial<IMutateProduct> {
  id: string;
}

// Products API slice
export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query<
      ProductsResponse,
      { page: number; perPage: number; search: string; category: string }
    >({
      query: ({ page, perPage, search, category }) =>
        `products?page=${page}&perPage=${perPage}&search=${search}&category=${category}`,
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({
                type: 'Product' as const,
                id: _id
              })),
              { type: 'Product', id: 'LIST' }
            ]
          : [{ type: 'Product', id: 'LIST' }]
    }),

    // Get single product by ID
    getProduct: builder.query<IMortalProduct, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'GET'
      }),
      providesTags: ['Product']
    }),

    // Create new product
    createProduct: builder.mutation<Product, IMutateProduct>({
      query: (product) => ({
        url: 'products',
        method: 'POST',
        body: product
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }]
    }),

    // Update product
    updateProduct: builder.mutation<Product, UpdateProductRequest>({
      query: ({ id, ...product }) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: product
      }),
      invalidatesTags: ['Product']
    }),

    // Delete product
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' }
      ]
    })
  })
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productsApi;
