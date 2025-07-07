import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';

console.log('Middleware ACCESS_TOKEN_SECRET:', ACCESS_TOKEN_SECRET);

export default async function middleware(req: NextRequest) {
  // Custom auth cho dashboard UI và API
  if (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/api')
  ) {
    // Bỏ qua các route auth
    if (
      req.nextUrl.pathname.startsWith('/api/auth/login') ||
      req.nextUrl.pathname.startsWith('/api/auth/logout')
    ) {
      return NextResponse.next();
    }
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    if (!token) {
      token = req.cookies.get('accessToken')?.value;
    }
    console.log('🚀 ~ middleware ~ token:', token);
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    console.log('errorrrrrr');
    try {
      const decoded = await jwtVerify(
        token,
        new TextEncoder().encode(ACCESS_TOKEN_SECRET)
      );
      console.log('🚀 ~ middleware ~ decoded:', decoded);
    } catch {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
