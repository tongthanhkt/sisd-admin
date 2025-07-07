import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Admin from '../../../../models/Admin';
import RefreshToken from '../../../../models/RefreshToken';
import mongoose from 'mongoose';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';
const ACCESS_TOKEN_EXPIRES_IN = '15m';

export async function POST(req: NextRequest) {
  // Đảm bảo kết nối mongoose
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }

  const refreshToken = req.cookies.get('refreshToken')?.value;
  if (!refreshToken) {
    return NextResponse.json(
      { message: 'Missing refresh token' },
      { status: 401 }
    );
  }

  // Kiểm tra refresh token trong DB
  const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
  if (!tokenDoc) {
    return NextResponse.json(
      { message: 'Invalid refresh token' },
      { status: 401 }
    );
  }
  if (tokenDoc.expiredAt < new Date()) {
    return NextResponse.json(
      { message: 'Refresh token expired' },
      { status: 401 }
    );
  }

  // Xác thực refresh token
  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
      adminId: string;
    };
  } catch {
    return NextResponse.json(
      { message: 'Invalid refresh token' },
      { status: 401 }
    );
  }

  // Lấy thông tin admin
  const admin = await Admin.findById(payload.adminId);
  if (!admin) {
    return NextResponse.json({ message: 'Admin not found' }, { status: 401 });
  }

  // Cấp lại access token mới
  const accessToken = jwt.sign(
    { adminId: admin._id, username: admin.username },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

  return NextResponse.json({ accessToken });
}
