import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || 'sisdAdminAccessToken';

export function withAuth(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    // Allow certain methods without auth
    if (req.method === 'GET') {
      return handler(req, context);
    }

    const token = req.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      console.log(
        '✅ API Auth: Token valid for user:',
        (decoded as any)?.username
      );

      // Add user info to request if needed
      (req as any).user = decoded;

      return handler(req, context);
    } catch (error) {
      console.log('❌ API Auth: Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  };
}
