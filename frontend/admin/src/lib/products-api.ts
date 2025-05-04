import { api } from './api-client';

export type ProductCategory = 'Panels' | 'Inverters' | 'Batteries' | 'Mounting Systems' | 'Accessories' | 'LED';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  wattage: number;
  voltage: number;
  dimensions: string;
  weight: number;
  manufacturer: string;
  warranty: string;
  stock: number;
  isAvailable: boolean;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  wattage: number;
  voltage?: number;
  dimensions?: string;
  weight?: number;
  manufacturer?: string;
  warranty?: string;
  stock?: number;
  isAvailable?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  category?: ProductCategory;
  wattage?: number;
  voltage?: number;
  dimensions?: string;
  weight?: number;
  manufacturer?: string;
  warranty?: string;
  stock?: number;
  isAvailable?: boolean;
}

export interface ProductsResponse {
  docs: Product[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface S3PresignedUrlResponse {
  presignedUrl: string;
  s3url: string;
}

export const productsApi = {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    category?: ProductCategory;
  }): Promise<ProductsResponse> {
    try {
      const response = await api.get<ProductsResponse>('/v1/products', { params });
      if (!response) {
        throw new Error('Invalid response format from server');
      }
      console.log('Products response:', response);
      return response;
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },

  async getProduct(id: string): Promise<Product> {
    try {
      const response = await api.get<Product>(`/v1/products/${id}`);
      if (!response) {
        throw new Error('Invalid response format from server');
      }
      return response;
    } catch (error) {
      console.error('Error in getProduct:', error);
      throw error;
    }
  },

  async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      const response = await api.post<Product>('/v1/products', data);
      if (!response) {
        throw new Error('Invalid response format from server');
      }
      return response;
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },

  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    try {
      const response = await api.patch<Product>(`/v1/products/${id}`, data);
      if (!response) {
        throw new Error('Invalid response format from server');
      }
      return response;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/v1/products/${id}`);
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  },

  async uploadImage(file: File): Promise<string> {
    try {
      // 1. Get presigned URL
      const presignedUrlResponse = await api.post<S3PresignedUrlResponse>('/v1/s3/generate-presigned-url', {
        fileName: file.name,
        domain: 'Product',
        contentType: file.type,
      });

      if (!presignedUrlResponse || !presignedUrlResponse.presignedUrl) {
        throw new Error('Invalid presigned URL response from server');
      }

      // 2. Upload to S3 using presigned URL
      const uploadResponse = await fetch(presignedUrlResponse.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      // 3. Return the S3 URL
      return presignedUrlResponse.s3url;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  }
};