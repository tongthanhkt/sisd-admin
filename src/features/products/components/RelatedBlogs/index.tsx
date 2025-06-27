'use client';

import { IBlog } from '@/models/Blog';
import { useEffect, useState } from 'react';
import { RelatedItem, RelatedSections } from '../RelatedSections';

export interface RelatedProduct {
  id: string;
}

export function RelatedBlogs() {
  const [relatedBlogs, setRelatedBlogs] = useState<{ id: string }[]>([]);
  const [allBlogs, setAllBlogs] = useState<IBlog[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      const queryParams = new URLSearchParams();
      queryParams.set('page', '1');
      queryParams.set('perPage', '100');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs?${queryParams}`,
        { cache: 'no-store' }
      );
      if (response.ok) {
        const data = await response.json();
        setAllBlogs(data.blogs);
      }
    }
    fetchBlogs();
  }, []);

  const validBlogs: RelatedItem[] = allBlogs
    .filter(
      (item): item is IBlog => typeof item.id === 'string' && item.id.length > 0
    )
    .map((item) => ({
      id: item.id,
      name: item.title,
      image: item.image,
      category: item.category
    }));

  return (
    <RelatedSections
      items={validBlogs}
      value={relatedBlogs.map((p) => p.id)}
      onChange={(ids) => setRelatedBlogs(ids.map((id) => ({ id })))}
      label='Related Blogs'
      addButtonText='Add blog'
      itemLabel={(item) => item.name || ''}
      itemImage={(item) => item.image || ''}
    />
  );
}
