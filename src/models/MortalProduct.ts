import mongoose, { Schema, Document } from 'mongoose';

export interface IMortalProduct extends Document {
  name?: string;
  code?: string;
  image?: string;
  shortDescription?: string;
  category?: string;
  description?: string;
  images?: {
    main?: string;
    thumbnails?: string[];
  };
  advantages?: string[];
  packaging?: string;
  technicalSpecifications?: {
    standard?: string;
    specifications?: {
      stt?: number;
      category?: string;
      performance?: string;
    }[];
  };
  transportationAndStorage?: string[];
  safetyRegulations?: {
    warning?: string;
    notes?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  id: string;
  _id: string;
}

const MortalProductSchema: Schema = new Schema(
  {
    name: { type: String, required: false },
    code: { type: String, required: false },
    image: { type: String, required: false },
    shortDescription: { type: String, required: false },
    category: { type: String, required: false },
    description: { type: String, required: false },
    images: {
      main: { type: String, required: false },
      thumbnails: [{ type: String, required: false }]
    },
    advantages: [{ type: String, required: false }],
    packaging: { type: String, required: false },
    technicalSpecifications: {
      standard: { type: String, required: false },
      specifications: [
        {
          stt: { type: Number, required: false },
          category: { type: String, required: false },
          performance: { type: String, required: false }
        }
      ]
    },
    transportationAndStorage: [{ type: String, required: false }],
    safetyRegulations: {
      warning: { type: String, required: false },
      notes: { type: String, required: false }
    }
  },
  { timestamps: true }
);
delete mongoose.models.MortalProduct; // 👈 xóa cache
export default mongoose.models.MortalProduct ||
  mongoose.model<IMortalProduct>('MortalProduct', MortalProductSchema);
