import mongoose, { Schema, Document } from 'mongoose';

interface IArticleSectionImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface IArticleSectionContent {
  content: string;
  images?: IArticleSectionImage[];
}

interface IArticleSectionSubHeadline {
  title: string;
  subTitle: string;
  contents: IArticleSectionContent[];
}

interface IArticleSection {
  id?: string;
  headline?: string;
  headline2?: string;
  contents: IArticleSectionContent[];
  images?: IArticleSectionImage[];
  subHeadline?: IArticleSectionSubHeadline[];
}

export interface IBlog extends Document {
  title: string;
  descriptions: string[];
  shortDescription: string;
  slug: string;
  categories: string[];
  date: string;
  image: string;
  articleSections: IArticleSection[];
  relatedProducts: string[];
  relatedPosts: string[];
  showArrowDesktop: boolean;
  isVertical: boolean;
  thumbnail: string;
  banner: string;
  isOustanding: boolean;
  summary: string;
  contact: string;
  // Legacy fields for backward compatibility
  imageSrc?: string;
  imageAlt?: string;
  category?: string;
  categoryColor?: string;
  description?: string;
  content?: string | string[];
  width?: number;
  height?: number;
  createdAt?: Date;
  updatedAt?: Date;
  id: string;
}

const articleSectionImageSchema = new Schema({
  src: String,
  alt: String,
  caption: String
});

const articleSectionContentSchema = new Schema({
  content: String,
  images: [articleSectionImageSchema]
});

const articleSectionSubHeadlineSchema = new Schema({
  title: String,
  subTitle: String,
  contents: [articleSectionContentSchema]
});

const articleSectionSchema = new Schema({
  id: String,
  headline: String,
  headline2: String,
  contents: [articleSectionContentSchema],
  images: [articleSectionImageSchema],
  subHeadline: [articleSectionSubHeadlineSchema]
});

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    descriptions: [String],
    shortDescription: String,
    slug: {
      type: String,
      unique: true,
      sparse: true
    },
    categories: [String],
    date: String,
    image: String,
    articleSections: [articleSectionSchema],
    relatedProducts: [String],
    relatedPosts: [String],
    showArrowDesktop: { type: Boolean, default: false },
    isVertical: { type: Boolean, default: false },
    thumbnail: String,
    banner: String,
    isOustanding: { type: Boolean, default: false },
    summary: String,
    contact: String,
    // Legacy fields for backward compatibility
    imageSrc: String,
    imageAlt: String,
    category: String,
    categoryColor: String,
    description: String,
    content: { type: [String], required: false },
    width: Number,
    height: Number
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ensure indexes for better query performance
blogSchema.index({ slug: 1 }, { unique: true, sparse: true });
blogSchema.index({ title: 1 }); // For title searches
blogSchema.index({ categories: 1 }); // For category filtering
blogSchema.index({ date: -1 }); // For date sorting
blogSchema.index({ isOustanding: 1 }); // For outstanding blog filtering
blogSchema.index({ createdAt: -1 }); // For creation date sorting
blogSchema.index({ updatedAt: -1 }); // For update date sorting
blogSchema.index({ relatedProducts: 1 }); // For related products queries
blogSchema.index({ relatedPosts: 1 }); // For related posts queries

// Compound indexes for common query patterns
blogSchema.index({ categories: 1, date: -1 }); // Category + date sorting
blogSchema.index({ isOustanding: 1, date: -1 }); // Outstanding + date sorting

export default mongoose.models.Blog ||
  mongoose.model<IBlog>('Blog', blogSchema);
