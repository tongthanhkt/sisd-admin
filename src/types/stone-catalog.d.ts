export interface ICatalog {
  id: string;
  code: string;
  createdAt: string;
  products: ICatalogProduct[];
}

export interface ICatalogProduct {
  id: string;
  image_url: string;
  color_image_url: string;
  color_name: string;
  catalog_id: string;
  content: string;
  createdAt: string;
}
