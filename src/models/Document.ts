import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  filename: string;
  file: {
    name: string;
    size: number;
    url: string;
    type: string;
  };
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id: string;
}

const DocumentSchema: Schema = new Schema(
  {
    filename: { type: String, required: true },
    file: {
      name: { type: String, required: true },
      size: { type: Number, required: true },
      url: { type: String, required: true },
      type: { type: String, required: true }
    },
    category: { type: String, required: true }
  },
  { timestamps: true }
);

delete mongoose.models.Document;
export default mongoose.models.Document ||
  mongoose.model<IDocument>('Document', DocumentSchema);
