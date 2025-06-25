import { IBlog } from '@/models/Blog';
import { searchParamsCache } from '@/lib/searchparams';
import { BlogTable } from './blog-tables';
import { columns } from './blog-tables/columns';

type BlogListingPage = {};

export default async function BlogListingPage({}: BlogListingPage) {
  const page = Number(searchParamsCache.get('page') || '1');
  const pageLimit = Number(searchParamsCache.get('perPage') || '10');
  const search = searchParamsCache.get('name');
  const categories = searchParamsCache.get('category');

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(page));
  queryParams.set('perPage', String(pageLimit));
  if (search) queryParams.set('search', search);
  if (categories) queryParams.set('category', categories);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blogs?${queryParams}`,
    {
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }

  const data = await response.json();
  const totalBlogs = data.total_blogs;
  const blogs: IBlog[] = data.blogs;

  return (
    <BlogTable
      data={blogs}
      totalItems={totalBlogs}
      columns={columns}
      page={page}
      perPage={pageLimit}
    />
  );
}
