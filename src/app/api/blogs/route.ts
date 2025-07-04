import { NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import { connectToDatabase } from '@/lib/mongodb';
import { generateSlug } from '@/lib/utils';
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';
import { withCORS } from '@/lib/cors';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    console.log('Connected to database');

    const { searchParams } = new URL(request.url);
    const page = parseInt(
      searchParams.get('page') || PAGINATION_DEFAULT_PAGE.toString()
    );
    const limit = parseInt(
      searchParams.get('perPage') || PAGINATION_DEFAULT_PER_PAGE.toString()
    );
    const search = searchParams.get('search') || '';
    const categories = searchParams.get('categories');
    const isOustanding = searchParams.get('isOustanding');

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (categories) {
      query.categories = { $in: categories.split(',') };
    }

    if (isOustanding) {
      query.isOustanding = isOustanding;
    }

    const ids = searchParams.get('ids');
    if (ids) {
      query._id = { $in: ids.split(',') };
    }

    const skip = (page - 1) * limit;
    console.log('Query:', query);
    console.log('Skip:', skip);
    console.log('Limit:', limit);

    const [blogs, total] = await Promise.all([
      Blog.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Blog.countDocuments(query)
    ]);

    console.log('Total documents:', total);
    console.log('Blogs:', blogs);

    return withCORS(
      NextResponse.json({
        blogs,
        total_blogs: total,
        current_page: page,
        total_pages: Math.ceil(total / limit)
      })
    );
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    console.log('Connected to database for POST');

    const body = await request.json();
    console.log('Received body:', body);

    if (body.title) {
      body.slug = generateSlug(body.title);
    }

    const blog = await Blog.create(body);
    console.log('Created blog:', blog);

    return withCORS(NextResponse.json(blog, { status: 201 }));
  } catch (error) {
    console.error('Error creating blog:', error);
    return withCORS(
      NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : 'Internal Server Error'
        },
        { status: 500 }
      )
    );
  }
}

export function OPTIONS() {
  return withCORS(NextResponse.json({}));
}
