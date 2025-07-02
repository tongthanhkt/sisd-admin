import { IBlog } from '@/models/Blog';
import { IBlogPagination, IMutateBlog } from '@/types';
import { api } from '../api';

// Blog types

export interface IBlogDetail extends IMutateBlog {
  id: string;
}

// Blogs API slice
export const blogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all blogs
    getBlogs: builder.query<IBlogPagination, { page: number; perPage: number }>(
      {
        query: ({ page, perPage }) => `blogs?page=${page}&perPage=${perPage}`,
        providesTags: ['Blog']
      }
    ),

    // Get single blog by ID
    getBlog: builder.query<IBlogDetail, string>({
      query: (id) => `blogs/${id}`,
      providesTags: ['Blog']
    }),

    // Create new blog
    createBlog: builder.mutation<IBlog, IMutateBlog>({
      query: (blog) => ({
        url: 'blogs',
        method: 'POST',
        body: blog
      }),
      invalidatesTags: ['Blog']
    }),

    // Update blog
    updateBlog: builder.mutation<IBlog, IBlogDetail>({
      query: ({ id, ...blog }) => ({
        url: `blogs/${id}`,
        method: 'PUT',
        body: blog
      }),
      invalidatesTags: ['Blog']
    }),

    // Delete blog
    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({
        url: `blogs/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Blog']
    })
  })
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation
} = blogsApi;
