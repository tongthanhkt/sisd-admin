interface Video {
  id: string;
  fileName: string;
  url: string;
  type: string;
  originalSize: number;
  compressedSize: number;
  createdAt: string;
}
export interface HomeVideo {
  id: string;
  name: string;
  videoId: string;
  createdAt: string;
  updatedAt: string;
  video: Video;
}

export interface HomeVideoListResponse {
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

export interface UpdateHomeVideoRequest {
  name: string;
  //   videoId?: string;
}
