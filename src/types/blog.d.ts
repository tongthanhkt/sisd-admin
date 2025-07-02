import { IBlog } from '@/models/Blog';
import { IImage } from './media';

export interface IBlogPagination {
  blogs: IBlog[];
  current_page: number;
  total_pages: number;
  total_blogs: number;
}

export interface IBlogFormValues {
  title: string;
  image: string;
  imageAlt: string;
  category: string;
  description: string;
  shortDescription: string;
  slug: string;
}

type ArticleSectionContent = Partial<{
  content: string;
  images: IImage[];
}>;

type ArticleSectionSubHeadline = Partial<{
  title: string;
  subTitle: string;
  contents: ArticleSectionContent[];
}>;

export type ArticleSection = Partial<{
  id: string;
  headline: string;
  headline2: string;
  contents: ArticleSectionContent[];
  images: IImage[];
  subHeadline: ArticleSectionSubHeadline[];
}>;

export interface IMutateBlog {
  title: string;
  descriptions: string[];
  shortDescription: string;
  slug: string;
  categories: string[];
  date: string;
  image: string;
  articleSections: ArticleSection[];
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
}
