import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import Document from '@/models/Document';
import { connectToDatabase } from '@/lib/mongodb';
import { withCORS } from '@/lib/cors';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log('GET /api/documents/[id] - ID:', id, new ObjectId(id));
    await connectToDatabase();

    const document = await Document.findOne({ _id: new ObjectId(id) });
    console.log('Found document:', document);

    if (!document) {
      console.log('Document not found');
      return withCORS(
        NextResponse.json({ error: 'Document not found' }, { status: 404 })
      );
    }

    return withCORS(NextResponse.json(document.toObject()));
  } catch (error) {
    console.error('Error fetching document:', error);
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
    console.log('PUT /api/documents/[id] - ID:', id);
    await connectToDatabase();

    const body = await request.json();
    console.log('Update body:', body);

    const document = await Document.findOneAndUpdate(
      { _id: new ObjectId(id) },
      body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!document) {
      console.log('Document not found for update');
      return withCORS(
        NextResponse.json({ error: 'Document not found' }, { status: 404 })
      );
    }

    return withCORS(NextResponse.json(document));
  } catch (error) {
    console.error('Error updating document:', error);
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

    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      console.log('Document not found for deletion');
      return withCORS(
        NextResponse.json({ error: 'Document not found' }, { status: 404 })
      );
    }

    return withCORS(
      NextResponse.json({ message: 'Document deleted successfully' })
    );
  } catch (error) {
    console.error('Error deleting document:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export function OPTIONS() {
  return withCORS(NextResponse.json({}));
}
