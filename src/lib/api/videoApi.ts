import { api } from '../api';

interface HomeVideo {
  id: string;
  name: string;
  videoId: string;
  createdAt: string;
  updatedAt: string;
  video: {
    id: string;
    fileName: string;
    url: string;
    type: string;
    originalSize: number;
    compressedSize: number;
    createdAt: string;
  };
}

interface HomeVideoListResponse {
  data: HomeVideo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreateHomeVideoRequest {
  name: string;
  videoId: string;
}

interface UpdateHomeVideoRequest {
  name: string;
  //   videoId?: string;
}

export const videoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHomeVideos: builder.query<
      HomeVideoListResponse,
      {
        page: number;
        limit: number;
      }
    >({
      query: ({ page, limit }) => `/homepage-video?page=${page}&limit=${limit}`,
      providesTags: ['HomeVideo']
    }),
    getHomeVideoById: builder.query<HomeVideo, string>({
      query: (id) => `/homepage-video/${id}`,
      providesTags: (result, error, id) => [{ type: 'HomeVideo', id }]
    }),
    createHomeVideo: builder.mutation<HomeVideo, CreateHomeVideoRequest>({
      query: (data) => ({
        url: '/homepage-video',
        method: 'POST',
        body: {
          name: data.name,
          videoId: data.videoId
        }
      }),
      invalidatesTags: ['HomeVideo']
    }),
    updateHomeVideo: builder.mutation<
      HomeVideo,
      { id: string } & UpdateHomeVideoRequest
    >({
      query: ({ id, ...data }) => ({
        url: `/homepage-video/${id}`,
        method: 'PATCH',
        body: {
          ...(data.name && { name: data.name })
        }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'HomeVideo', id },
        'HomeVideo'
      ]
    }),
    deleteHomeVideo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/homepage-video/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['HomeVideo']
    })
  })
});

export const {
  useGetHomeVideosQuery,
  useGetHomeVideoByIdQuery,
  useCreateHomeVideoMutation,
  useUpdateHomeVideoMutation,
  useDeleteHomeVideoMutation
} = videoApi;
