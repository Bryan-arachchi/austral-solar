/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiClient } from './api-client';

export interface OrderProductDetails {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
  };
  quantity: number;
  price: number;
}

export interface OrderBranch {
  _id: string;
  name: string;
  locationName: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface OrderClient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Order {
  _id: string;
  client: OrderClient;
  products: OrderProductDetails[];
  totalPrice: number;
  branch: OrderBranch;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  notes: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  docs: Order[];
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

export interface OrderProduct {
  product: string;
  quantity: number;
}

export interface OrderRequest {
  products: OrderProduct[];
  notes?: string;
  paymentMethod: string;
}

export interface PaymentData {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  order_id: string;
  items: string;
  currency: string;
  amount: string;
  hash: string;
}

export interface OrderResponse {
  order: {
    _id: string;
    client: string;
    products: {
      product: string;
      quantity: number;
      price: number;
    }[];
    totalPrice: number;
    branch: string;
    status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
    notes: string;
    isPaid: boolean;
    createdAt: string;
    updatedAt: string;
  };
  paymentData: {
    sandbox: boolean;
    preapprove: boolean;
    merchant_id: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    order_id: string;
    items: string[];
    currency: string;
    amount: string;
    hash: string;
  };
}

const apiClient = new ApiClient();

export class OrderError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message: string
  ) {
    super(message);
    this.name = 'OrderError';
  }
}

export const ordersApi = {
  getOrders: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<OrdersResponse> => {
    try {
      const response = await apiClient.get<OrdersResponse>('/v1/orders', {
        params: {
          ...params,
          pagination: 'true'
        }
      });
      return response;
    } catch (error: any) {
      if (error.response?.data) {
        throw new OrderError(
          error.response.data.statusCode,
          error.response.data.error,
          error.response.data.message
        );
      }
      throw error;
    }
  },
  
  createOrder: async (orderData: OrderRequest): Promise<OrderResponse> => {
    try {
      const response = await apiClient.post<OrderResponse>('/v1/orders', orderData);
      return response;
    } catch (error: any) {
      console.error('API Error:', error); // Debug log
      if (error.response?.data) {
        throw new OrderError(
          error.response.data.statusCode,
          error.response.data.error,
          error.response.data.message
        );
      }
      throw error;
    }
  }
}; 