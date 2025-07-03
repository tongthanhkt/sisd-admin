import { NextResponse } from 'next/server';
import MortalProduct from '@/models/MortalProduct';
import { connectToDatabase } from '@/lib/mongodb';
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE
} from '@/constants/pagination';
import { withCORS } from '@/lib/cors';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(
      searchParams.get('page') || PAGINATION_DEFAULT_PAGE.toString()
    );
    const limit = parseInt(
      searchParams.get('perPage') || PAGINATION_DEFAULT_PER_PAGE.toString()
    );
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = { $in: category.split(',') };
    }

    const ids = searchParams.get('ids');
    if (ids) {
      query._id = { $in: ids.split(',') };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      MortalProduct.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      MortalProduct.countDocuments(query)
    ]);

    return withCORS(
      NextResponse.json({
        products,
        total_products: total,
        current_page: page,
        total_pages: Math.ceil(total / limit)
      })
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const product = await MortalProduct.create(body);

    return withCORS(NextResponse.json(product, { status: 201 }));
  } catch (error) {
    console.error('Error creating product:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export function OPTIONS() {
  return withCORS(NextResponse.json({}));
}
