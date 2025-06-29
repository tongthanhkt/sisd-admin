import { api } from '../api';

// Blog types
export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  tags?: string[];
  publishedAt?: string;
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
  id: string;
}

// Blogs API slice
export const blogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all blogs
    getBlogs: builder.query<Blog[], void>({
      query: () => 'blogs',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Blog' as const, id: _id })),
              { type: 'Blog', id: 'LIST' }
            ]
          : [{ type: 'Blog', id: 'LIST' }]
    }),

    // Get single blog by ID
    getBlog: builder.query<Blog, string>({
      query: (id) => `blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }]
    }),

    // Create new blog
    createBlog: builder.mutation<Blog, CreateBlogRequest>({
      query: (blog) => ({
        url: 'blogs',
        method: 'POST',
        body: blog
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }]
    }),

    // Update blog
    updateBlog: builder.mutation<Blog, UpdateBlogRequest>({
      query: ({ id, ...blog }) => ({
        url: `blogs/${id}`,
        method: 'PUT',
        body: blog
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' }
      ]
    }),

    // Delete blog
    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({
        url: `blogs/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' }
      ]
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
