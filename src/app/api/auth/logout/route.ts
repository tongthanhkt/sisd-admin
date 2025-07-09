import { NextRequest, NextResponse } from 'next/server';
import RefreshToken from '../../../../models/RefreshToken';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  // Đảm bảo kết nối mongoose
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }

  const refreshToken = req.cookies.get('refreshToken')?.value;
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });

  response.cookies.set('accessToken', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 0 // Expire immediately
  });
  return response;
}
