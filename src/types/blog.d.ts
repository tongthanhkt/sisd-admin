import { IBlog } from '@/models/Blog';

export interface IBlogPagination {
  blogs: IBlog[];
  current_page: number;
  total_pages: number;
  total_blogs: number;
}
