import type { Product } from '@/constants/data';

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch product');
    }

    return response.json();
  } catch (error) {
    console.error('Error in getProduct:', error);
    throw error;
  }
};

export const createProduct = async (
  product: Omit<Product, 'id'>
): Promise<Product> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  product: Partial<Product>
): Promise<Product | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to update product');
    }

    return response.json();
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }
      throw new Error('Failed to delete product');
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
};
