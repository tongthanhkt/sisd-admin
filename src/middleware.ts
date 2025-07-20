import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { extractJWTPayload } from '@/lib/jwt-edge';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/auth/login';

  // Allow all API requests to pass through (auth will be handled by individual routes)
  const isApiRequest = path.startsWith('/api');

  // Get the token from cookies or Authorization header
  const tokenFromCookie = request.cookies.get('accessToken')?.value || '';
  const authHeader = request.headers.get('authorization');
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : '';
  const token = tokenFromCookie || tokenFromHeader;

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
      const payload = extractJWTPayload(token);
      console.log('✅ Token valid - user:', payload?.userId || payload?.email, 'role:', payload?.role || payload?.rule);
      return NextResponse.redirect(new URL('/dashboard/product', request.url));
    } catch (error) {
      // Token invalid, allow access to login page
      const response = NextResponse.next();
      // Xóa tất cả cookies liên quan đến authentication
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      response.cookies.delete('userId');
      response.cookies.delete('userRole');
      response.cookies.delete('session');
      response.cookies.delete('auth');
      response.cookies.delete('token');
      response.cookies.delete('jwt');
      response.cookies.delete('user');
      response.cookies.delete('login');
      response.cookies.delete('remember');
      response.cookies.delete('persist');
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

      const payload = extractJWTPayload(token);

      console.log('✅ Token valid - user:', payload?.userId || payload?.email, 'role:', payload?.role || payload?.rule);
      return NextResponse.next();
    } catch (error) {
      console.log('❌ Token verification failed:', (error as Error).message);

      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(
        new URL('/auth/login', request.url)
      );
      // Xóa tất cả cookies liên quan đến authentication
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      response.cookies.delete('userId');
      response.cookies.delete('userRole');
      response.cookies.delete('session');
      response.cookies.delete('auth');
      response.cookies.delete('token');
      response.cookies.delete('jwt');
      response.cookies.delete('user');
      response.cookies.delete('login');
      response.cookies.delete('remember');
      response.cookies.delete('persist');
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
