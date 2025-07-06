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
    getBlogs: builder.query<
      IBlogPagination,
      { page: number; perPage: number; search: string; categories?: string[] }
    >({
      query: ({ page, perPage, search, categories }) => {
        let url = `blogs?page=${page}&perPage=${perPage}&search=${search}`;
        if (categories && categories.length > 0) {
          url += `&categories=${categories.join(',')}`;
        }
        return url;
      },
      providesTags: ['Blog'],
      keepUnusedDataFor: 300, // Keep data for 5 minutes
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, perPage, search, categories } = queryArgs;
        return `${page}-${perPage}-${search}-${categories?.join(',') || ''}`;
      },
      merge: (currentCache, newItems) => {
        // Merge logic for pagination
        return newItems;
      }
    }),

    // Get single blog by ID
    getBlog: builder.query<IBlogDetail, string>({
      query: (id) => `blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
      keepUnusedDataFor: 600, // Keep data for 10 minutes
      transformResponse: (response: IBlogDetail) => {
        // Transform response if needed
        return response;
      }
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
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        'Blog'
      ],
      // Optimistic update
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          blogsApi.util.updateQueryData('getBlog', id, (draft) => {
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
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
