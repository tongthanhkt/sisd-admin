import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Admin from '../../models/Admin';
import clientPromise from './mongodb';

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'Abc1234@'
};

export async function ensureDefaultAdmin() {
  await clientPromise;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
  const existing = await Admin.findOne({ username: DEFAULT_ADMIN.username });
  if (!existing) {
    const hashed = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    await Admin.create({ username: DEFAULT_ADMIN.username, password: hashed });
    console.log('Default admin created');
  } else {
    console.log('Default admin already exists');
  }
}
