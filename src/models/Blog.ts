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
  contents: IArticleSectionContent[];
  images?: IArticleSectionImage[];
}

interface IArticleSection {
  headline?: string;
  headline2?: string;
  contents: IArticleSectionContent[];
  images?: IArticleSectionImage[];
  subHeadline?: IArticleSectionSubHeadline[];
}

export interface IBlog extends Document {
  isOustanding: boolean;
  href: string;
  imageSrc: string;
  imageAlt: string;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  slug: string;
  categories: string[];
  date: string;
  image: string;
  content: string | string[];
  relatedPosts: { title: string; category: string; slug: string }[];
  articleSections: IArticleSection[];
  relatedProducts: any[];
  width?: number;
  height?: number;
  showArrowDesktop?: boolean;
  isVertical?: boolean;
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
  contents: [articleSectionContentSchema],
  images: [articleSectionImageSchema]
});

const articleSectionSchema = new Schema({
  headline: String,
  headline2: String,
  contents: [articleSectionContentSchema],
  images: [articleSectionImageSchema],
  subHeadline: [articleSectionSubHeadlineSchema]
});

const blogSchema = new Schema(
  {
    isOustanding: { type: Boolean, default: false },
    href: String,
    imageSrc: String,
    imageAlt: String,
    category: String,
    categoryColor: String,
    title: { type: String, required: true },
    description: String,
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
    content: { type: [String], required: false },
    relatedPosts: [
      {
        title: String,
        category: String,
        slug: String
      }
    ],
    articleSections: [articleSectionSchema],
    relatedProducts: [Schema.Types.Mixed],
    width: Number,
    height: Number,
    showArrowDesktop: Boolean,
    isVertical: Boolean
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
