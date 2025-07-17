import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withCORS } from '@/lib/cors';
import Contact from '@/models/Contact';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('perPage') || '10');
    const search = searchParams.get('search') || '';

    const query: any = {};
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone_number: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (page - 1) * limit;
    const [contacts, total] = await Promise.all([
      Contact.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Contact.countDocuments(query)
    ]);
    return withCORS(
      NextResponse.json({
        contacts,
        total_contacts: total,
        current_page: page,
        total_pages: Math.ceil(total / limit)
      })
    );
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { fullname, phone_number, email } = body;
    if (!fullname || !phone_number || !email) {
      return withCORS(
        NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      );
    }
    const contact = await Contact.create({ fullname, phone_number, email });
    return withCORS(NextResponse.json(contact, { status: 201 }));
  } catch (error) {
    console.error('Error creating contact:', error);
    return withCORS(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export function OPTIONS() {
  return withCORS(NextResponse.json({}));
}
