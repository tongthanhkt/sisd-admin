import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../../../../models/Admin';
import { ensureDefaultAdmin } from '../../../../lib/mongodb/admin';
import RefreshToken from '../../../../models/RefreshToken';
import mongoose from 'mongoose';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';
const ACCESS_TOKEN_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

console.log('API login ACCESS_TOKEN_SECRET:', ACCESS_TOKEN_SECRET);

export async function POST(req: NextRequest) {
  await ensureDefaultAdmin();
  let username = '';
  let password = '';
  let isJson = false;

  // Kiểm tra content-type
  if (req.headers.get('content-type')?.includes('application/json')) {
    const body = await req.json();
    username = body.username || '';
    password = body.password || '';
    isJson = true;
  } else {
    const formData = await req.formData();
    username = String(formData.get('username') || '');
    password = String(formData.get('password') || '');
  }

  // Đảm bảo kết nối mongoose
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }

  const admin = await Admin.findOne({ username });
  if (!admin) {
    if (isJson) {
      return NextResponse.json({ message: 'Đăng nhập sai' }, { status: 401 });
    }
    return NextResponse.redirect(
      `${req.nextUrl.origin}/auth/login?error=Đăng nhập sai`,
      302
    );
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    if (isJson) {
      return NextResponse.json({ message: 'Đăng nhập sai' }, { status: 401 });
    }
    return NextResponse.redirect(
      `${req.nextUrl.origin}/auth/login?error=Đăng nhập sai`,
      302
    );
  }

  // Tạo access token
  const accessToken = jwt.sign(
    { adminId: admin._id, username: admin.username },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

  console.log('🔐 Login Success - Generated tokens for user:', admin.username);
  console.log('📅 Token expires in:', ACCESS_TOKEN_EXPIRES_IN);
  console.log(
    '🔑 Using secret:',
    ACCESS_TOKEN_SECRET?.substring(0, 10) + '...'
  );
  console.log(
    '🎫 Access token preview:',
    accessToken?.substring(0, 50) + '...'
  );

  // Tạo refresh token
  const refreshToken = jwt.sign({ adminId: admin._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  });

  // Lưu refresh token vào DB
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    admin: admin._id,
    token: refreshToken,
    expiredAt
  });

  if (isJson) {
    // For JSON requests, return JSON with cookies
    const response = NextResponse.json({
      success: true,
      message: 'Login successful'
    });

    console.log('🍪 Setting cookies for JSON response');

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    console.log('✅ Cookies set successfully');
    return response;
  }

  // For form requests, redirect with cookies
  const baseUrl = req.nextUrl.origin;
  const response = NextResponse.redirect(`${baseUrl}/dashboard`, 302);
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return response;
}
