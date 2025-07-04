import { connectToDatabase } from '@/lib/mongodb';
import { generateSlug } from '@/lib/utils';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { withCORS } from '@/lib/cors';

export async function GET(
  request: Request,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await context.params;
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return NextResponse.json({ error: 'Invalid blog id' }, { status: 400 });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return withCORS(NextResponse.json(blog));
  } catch (error) {
    console.error('Error fetching blog:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await context.params;
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return NextResponse.json({ error: 'Invalid blog id' }, { status: 400 });
    }

    const body = await request.json();

    if (body.title) {
      body.slug = generateSlug(body.title);
    }

    const blog = await Blog.findByIdAndUpdate(blogId, body, {
      new: true,
      runValidators: true
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return withCORS(NextResponse.json(blog));
  } catch (error) {
    console.error('Error updating blog:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await context.params;
    console.log('DELETE /api/blogs/[blogId] - ID:', blogId);
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return NextResponse.json({ error: 'Invalid blog id' }, { status: 400 });
    }

    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
      console.log('Blog not found for deletion');
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return withCORS(
      NextResponse.json({ message: 'Blog deleted successfully' })
    );
  } catch (error) {
    console.error('Error deleting blog:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export function OPTIONS() {
  return withCORS(NextResponse.json({}));
}
