export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  href?: string; // Optional property for the href
}

export const PRODUCT_CATEGORIES = {
  MORTAL: 'MORTAL',
  TILE_CHARON: 'TILE_CHARON',
  CT: 'CT',
  SPC: 'SPC'
};

export const PRODUCT_LABELS = {
  [PRODUCT_CATEGORIES.MORTAL]: 'Vữa trang trí',
  [PRODUCT_CATEGORIES.TILE_CHARON]: 'Keo dán gạch & keo chà ron',
  [PRODUCT_CATEGORIES.CT]: 'Vật tư chống thấm',
  [PRODUCT_CATEGORIES.SPC]: 'Sàn SPC'
};

export const productCategories = [
  {
    id: PRODUCT_CATEGORIES.MORTAL,
    name: PRODUCT_LABELS[PRODUCT_CATEGORIES.MORTAL]
  },
  {
    id: PRODUCT_CATEGORIES.TILE_CHARON,
    name: PRODUCT_LABELS[PRODUCT_CATEGORIES.TILE_CHARON]
  },
  { id: PRODUCT_CATEGORIES.CT, name: PRODUCT_LABELS[PRODUCT_CATEGORIES.CT] },
  { id: PRODUCT_CATEGORIES.SPC, name: PRODUCT_LABELS[PRODUCT_CATEGORIES.SPC] }
];

export const CATEGORY_PRODUCT_OPTIONS = productCategories.map((category) => ({
  label: category.name,
  value: category.id
}));

export const products: Product[] = [
  {
    id: 'dpc-100',
    name: 'Vữa thô DPC-100',
    image: '/images/products/dpc-100.svg',
    description: 'Chất tăng bám dính',
    category: 'vua-trang-tri',
    href: 'mortal-DPC100'
  },
  {
    id: 'dpx-200',
    name: 'Vữa mịn DPX-200',
    image: '/images/products/dpx-200.svg',
    description: 'Chất tăng bám dính',
    category: 'vua-trang-tri',
    href: 'mortal-DPX200'
  },
  {
    id: 'mj-100',
    name: 'Vữa siêu mịn MJ-100',
    image: '/images/products/mj-100.svg',
    description: 'Chất tăng bám dính',
    category: 'vua-trang-tri',
    href: 'mortal-MJ100'
  },
  {
    id: 'dr-m402',
    name: 'Vữa màu hai thành phần DR-M402',
    image: '/images/products/dr-m402.svg',
    description: 'Chất tăng bám dính',
    category: 'vua-trang-tri',
    href: ''
  },
  {
    id: 'ta-s100',
    name: 'Keo dán gạch TA-S100',
    image: '/images/products/ta-s100.svg',
    description: 'Loại siêu dính thông dụng',
    category: 'keo-dan-gach',
    href: 'products/ta-s100'
  },
  {
    id: 'ta-s101',
    name: 'Keo dán gạch tiết kiệm TA-S101',
    image: '/images/products/ta-s101.svg',
    description: 'Loại siêu dính thông dụng',
    category: 'keo-dan-gach',
    href: 'products/ta-s101'
  },
  {
    id: 'ta-s106',
    name: 'Keo dán gạch TA-S106',
    image: '/images/products/ta-s106.svg',
    description: 'Loại gạch nặng',
    category: 'keo-dan-gach',
    href: 'products/ta-s106'
  },
  {
    id: 'tf-g100',
    name: 'Keo chà ron thẩm mỹ TF-G100 Hengcai',
    image: '/images/products/tf-g100.svg',
    description: 'Loại siêu dính thông dụng',
    category: 'keo-dan-gach',
    href: 'products/tf-g100'
  },
  {
    id: 'wm-102',
    name: 'Chất phủ chống thấm WM-102',
    image: '/images/products/wm-102.svg',
    description: 'Loại polyme màu',
    category: 'vat-tu-chong-tham'
  }
];
