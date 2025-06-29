export interface IProductPagination {
  products: IProduct[];
  current_page: number;
  total_pages: number;
  total_products: number;
}
