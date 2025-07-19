import mongoose, { Schema, Document, models } from 'mongoose';

export interface IContact extends Document {
  fullname: string;
  phone_number: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    fullname: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true }
  },
  { timestamps: true }
);

export default models.Contact ||
  mongoose.model<IContact>('Contact', ContactSchema);
