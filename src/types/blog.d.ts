import { IBlog } from '@/models/Blog';

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

interface IArticleSectionContent {
  content: string;
  images: IImage[];
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
  images: IImage[];
  subHeadline?: IArticleSectionSubHeadline[];
}

export interface IMutateBlog {
  title: string;
  description: string;
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
}
