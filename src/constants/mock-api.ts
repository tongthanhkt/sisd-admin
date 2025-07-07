////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering
import { mortalProductsData } from './data';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export interface Product {
  id: string;
  name: string;
  image?: string;
  description: string;
  category: string;
  href?: string; // Optional property for the href
  created_at: any;

  photo_url: any;
  updated_at: any;
}
const products: Product[] = [
  {
    id: 'dpc-100',
    name: 'Vữa thô DPC-100',
    image: '/images/products/dpc-100.svg',
    description: 'Chất tăng bám dính',
    category: 'vua-trang-tri',
    href: 'mortal-DPC100',
    created_at: 'http://localhost:3000',

    photo_url: `https://api.slingacademy.com/public/sample-products/1.png`,
    updated_at: 'http://localhost:3000'
  },
  {
    id: 'dpx-200',
    name: 'Vữa mịn DPX-200',
    image: '/images/products/dpx-200.svg',
    description: 'Chất tăng bám dính',
    category: 'vua-trang-tri',
    href: 'mortal-DPX200',
    created_at: 'http://localhost:3000',

    photo_url: `https://api.slingacademy.com/public/sample-products/1.png`,
    updated_at: 'http://localhost:3000'
  },
  {
    id: 'mj-100',
    name: 'Vữa siêu mịn MJ-100',
    image: '/images/products/mj-100.svg',
    description: 'Chất tăng bám dính',
    category: 'vua-trang-tri',
    href: 'mortal-MJ100',
    created_at: 'http://localhost:3000',

    photo_url: `https://api.slingacademy.com/public/sample-products/1.png`,
    updated_at: 'http://localhost:3000'
  },
  {
    id: 'dr-m402',
    name: 'Vữa màu hai thành phần DR-M402',
    image: '/images/products/dr-m402.svg',
    description: 'Chất tăng bám dính',
    category: 'vua-trang-tri',
    href: 'http://localhost:3000',
    created_at: 'http://localhost:3000',

    photo_url: `https://api.slingacademy.com/public/sample-products/1.png`,
    updated_at: 'http://localhost:3000'
  },
  {
    id: 'ta-s100',
    name: 'Keo dán gạch TA-S100',
    image: '/images/products/ta-s100.svg',
    description: 'Loại siêu dính thông dụng',
    category: 'keo-dan-gach',
    href: 'products/ta-s100',
    created_at: 'http://localhost:3000',

    photo_url: `https://api.slingacademy.com/public/sample-products/1.png`,
    updated_at: 'http://localhost:3000'
  },
  {
    id: 'ta-s101',
    name: 'Keo dán gạch tiết kiệm TA-S101',
    image: '/images/products/ta-s101.svg',
    description: 'Loại siêu dính thông dụng',
    category: 'keo-dan-gach',
    href: 'products/ta-s101',
    created_at: 'http://localhost:3000',

    photo_url: `https://api.slingacademy.com/public/sample-products/1.png`,
    updated_at: 'http://localhost:3000'
  },
  {
    id: 'ta-s106',
    name: 'Keo dán gạch TA-S106',
    image: '/images/products/ta-s106.svg',
    description: 'Loại gạch nặng',
    category: 'keo-dan-gach',
    href: 'products/ta-s106',
    created_at: 'http://localhost:3000',

    photo_url: `https://api.slingacademy.com/public/sample-products/1.png`,
    updated_at: 'http://localhost:3000'
  },
  {
    id: 'tf-g100',
    name: 'Keo chà ron thẩm mỹ TF-G100 Hengcai',
    image: '/images/products/tf-g100.svg',
    description: 'Loại siêu dính thông dụng',
    category: 'keo-dan-gach',
    href: 'products/tf-g100',
    created_at: 'http://localhost:3000',

    photo_url: `https://api.slingacademy.com/public/sample-products/1.png`,
    updated_at: 'http://localhost:3000'
  },
  {
    id: 'wm-102',
    name: 'Chất phủ chống thấm WM-102',
    image: '/images/products/wm-102.svg',
    description: 'Loại polyme màu',
    category: 'vat-tu-chong-tham',
    created_at: 'http://localhost:3000',

    photo_url: `https://api.slingacademy.com/public/sample-products/1.png`,
    updated_at: 'http://localhost:3000'
  }
];

// Mock product data store
export const fakeProducts = {
  records: [] as Product[], // Holds the list of product objects

  // Initialize with sample data
  initialize() {
    const sampleProducts: Product[] = [];
    function generateRandomProductData(id: string): Product {
      const categories = [
        'Electronics',
        'Furniture',
        'Clothing',
        'Toys',
        'Groceries',
        'Books',
        'Jewelry',
        'Beauty Products'
      ];

      return {
        id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        photo_url: `https://api.slingacademy.com/public/sample-products/1.png`,
        category: faker.helpers.arrayElement(categories),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleProducts.push(generateRandomProductData(i.toString()));
    }

    this.records = products;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ['name', 'description', 'category']
      });
    }

    return products;
  },

  // Get paginated results with optional category filtering and search
  async getProducts({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allProducts = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalProducts = allProducts.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_products: totalProducts,
      offset,
      limit,
      products: paginatedProducts
    };
  },

  // Get a specific product by its ID
  async getProductById(id: string) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = mortalProductsData.find((product) => product.id === id);

    if (!product) {
      return {
        success: false,
        message: `Product with ID 1 not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID 1 found`,
      product
    };
  }
};

// Initialize sample products
fakeProducts.initialize();
