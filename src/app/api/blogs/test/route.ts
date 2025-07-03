import { withCORS } from '@/lib/cors';
import { NextResponse } from 'next/server';

export function OPTIONS() {
  return withCORS(NextResponse.json({}));
}
