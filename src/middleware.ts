import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt-edge';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/auth/login';

  // Allow all API requests to pass through (auth will be handled by individual routes)
  const isApiRequest = path.startsWith('/api');

  // Get the token from the cookies
  const token = request.cookies.get('accessToken')?.value || '';

  // Only log for important paths
  if (!path.startsWith('/_next') && !path.includes('.')) {
    console.log('🔍 Server Middleware:', {
      path,
      method,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
      isPublicPath,
      isApiRequest
    });
  }

  // If this is an API request, let it pass through
  if (isApiRequest) {
    return NextResponse.next();
  }

  // If the path is public and user is authenticated, redirect to dashboard
  if (isPublicPath && token) {
    try {
      const secret = process.env.ACCESS_TOKEN_SECRET || '';
      await verifyJWT(token, secret);
      return NextResponse.redirect(new URL('/dashboard/product', request.url));
    } catch (error) {
      // Token invalid, allow access to login page
      const response = NextResponse.next();
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  // If the path is not public and user is not authenticated, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If there's a token, verify it for protected routes
  if (token && !isPublicPath) {
    try {
      console.log('🎫 Verifying token:', token?.substring(0, 50) + '...');

      const decoded = await verifyJWT(
        token,
        process.env.ACCESS_TOKEN_SECRET || ''
      );

      console.log('✅ Token valid - user:', (decoded as any)?.username);
      return NextResponse.next();
    } catch (error) {
      console.log('❌ Token verification failed:', (error as Error).message);
      console.log(
        '🔑 Secret used:',
        (process.env.ACCESS_TOKEN_SECRET || 'sisdAdminAccessToken')?.substring(
          0,
          15
        ) + '...'
      );

      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(
        new URL('/auth/login', request.url)
      );
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
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
