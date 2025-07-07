import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  admin: Types.ObjectId; // ref tới Admin
  token: string;
  createdAt: Date;
  expiredAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiredAt: { type: Date, required: true }
});

export default mongoose.models.RefreshToken ||
  mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
