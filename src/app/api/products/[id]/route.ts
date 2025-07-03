import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import MortalProduct from '@/models/MortalProduct';
import { connectToDatabase } from '@/lib/mongodb';
import { withCORS } from '@/lib/cors';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log('GET /api/products/[id] - ID:', id, new ObjectId(id));
    await connectToDatabase();

    const product = await MortalProduct.findOne({ _id: new ObjectId(id) });
    console.log('Found product:', product);

    if (!product) {
      console.log('Product not found');
      return withCORS(
        NextResponse.json({ error: 'Product not found' }, { status: 404 })
      );
    }

    return withCORS(NextResponse.json(product.toObject()));
  } catch (error) {
    console.error('Error fetching product:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log('PUT /api/products/[id] - ID:', id);
    await connectToDatabase();

    const body = await request.json();
    console.log('Update body:', body);

    const product = await MortalProduct.findOneAndUpdate(
      { _id: new ObjectId(id) },
      body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      console.log('Product not found for update');
      return withCORS(
        NextResponse.json({ error: 'Product not found' }, { status: 404 })
      );
    }

    return withCORS(NextResponse.json(product));
  } catch (error) {
    console.error('Error updating product:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const product = await MortalProduct.findByIdAndDelete(id);

    if (!product) {
      console.log('Product not found for deletion');
      return withCORS(
        NextResponse.json({ error: 'Product not found' }, { status: 404 })
      );
    }

    return withCORS(
      NextResponse.json({ message: 'Product deleted successfully' })
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export function OPTIONS() {
  return withCORS(NextResponse.json({}));
}
