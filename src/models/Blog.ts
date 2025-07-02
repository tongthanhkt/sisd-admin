import mongoose, { Schema, Document } from 'mongoose';

// Function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .trim()
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

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
  href: string;
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
      sparse: true,
      set: function (this: IBlog) {
        if (this.title) {
          return generateSlug(this.title);
        }
        return null;
      }
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
    href: String,
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

// Ensure indexes
blogSchema.index({ slug: 1 }, { unique: true, sparse: true });

export default mongoose.models.Blog ||
  mongoose.model<IBlog>('Blog', blogSchema);
