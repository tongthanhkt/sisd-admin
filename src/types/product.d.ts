export interface IProductPagination {
  products: IProduct[];
  current_page: number;
  total_pages: number;
  total_products: number;
}

export interface IMutateProduct {
  code: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  images: { main: string; thumbnails: string[] };
  packaging: string;
  advantages: string[];
  technicalSpecifications: ITechnicalSpecifications;
  transportationAndStorage: string[];
  safetyRegulations: SafetyRegulations;
}

interface ITechnicalSpecifications {
  standard: string;
  specifications: {
    category: string;
    performance: string;
  }[];
}

interface SafetyRegulations {
  warning: string;
  notes?: string;
}
