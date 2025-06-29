import { IMutateProduct, IProductPagination } from '@/types/product';
import { api } from '../api';

// Product types
export interface Product {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  images?: string[];
  technicalSpecifications?: {
    standard?: string;
    specifications?: Array<{
      id?: string;
      category?: string;
      performance?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  category?: string;
  images?: string[];
  technicalSpecifications?: {
    standard?: string;
    specifications?: Array<{
      category?: string;
      performance?: string;
    }>;
  };
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

// Products API slice
export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query<IProductPagination, void>({
      query: () => ({
        url: 'products',
        method: 'GET'
      }),
      providesTags: ['Product']
    }),

    // Get single product by ID
    getProduct: builder.query<Product, string>({
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
      invalidatesTags: ['Product']
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
      invalidatesTags: ['Product']
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
