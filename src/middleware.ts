import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/auth/login';

  // Check if this is an API GET request
  const isApiGet = path.startsWith('/api') && method === 'GET';

  // Get the token from the cookies
  const token = request.cookies.get('accessToken')?.value || '';

  // If the path is public and user is authenticated, redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard/overview', request.url));
  }

  // If this is an API GET request, allow access without checking token
  if (isApiGet) {
    return NextResponse.next();
  }

  // If the path is not public and user is not authenticated, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If there's a token, verify it for protected routes
  if (token && !isPublicPath) {
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'your-secret-key');
      return NextResponse.next();
    } catch (error) {
      // If token is invalid, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // For public paths without token, allow access
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
