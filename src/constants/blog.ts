export const BLOG_CATEGORIES = {
  TRENDING: 'TRENDING',
  EVENTS: 'EVENTS',
  TECHNICAL: 'TECHNICAL',
  MATERIAL: 'MATERIAL',
  WATERPROOFING: 'WATERPROOFING'
};

export const BLOG_CATEGORIES_LABELS = {
  [BLOG_CATEGORIES.TRENDING]: 'Xu hướng',
  [BLOG_CATEGORIES.EVENTS]: 'Sự kiện',
  [BLOG_CATEGORIES.TECHNICAL]: 'Kỹ thuật',
  [BLOG_CATEGORIES.MATERIAL]: 'Vật liệu',
  [BLOG_CATEGORIES.WATERPROOFING]: 'Chống thấm'
};

export const BLOG_CATEGORIES_COLORS = {
  [BLOG_CATEGORIES.TRENDING]: 'text-[#9000FF]',
  [BLOG_CATEGORIES.EVENTS]: 'text-blue-600',
  [BLOG_CATEGORIES.TECHNICAL]: 'text-blue-600',
  [BLOG_CATEGORIES.MATERIAL]: '#00A738',
  [BLOG_CATEGORIES.WATERPROOFING]: 'text-orange-500'
};

export const BLOG_CATEGORIES_OPTIONS = Object.entries(
  BLOG_CATEGORIES_LABELS
).map(([key, value]) => ({
  label: value,
  value: key
}));
