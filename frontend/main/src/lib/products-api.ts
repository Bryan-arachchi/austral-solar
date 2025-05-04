import { api } from './api-client';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  wattage: string;
  voltage: number;
  dimensions: string;
  weight: number;
  manufacturer: string;
  warranty: string;
  stock: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
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

export const productsApi = {
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>('/v1/products', { params });
    return response;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/v1/products/${id}`);
    return response;
  }
}; 