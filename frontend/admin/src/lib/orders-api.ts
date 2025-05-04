import { api } from './api-client';

export interface OrderProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface OrderItem {
  product: OrderProduct;
  quantity: number;
  price: number;
}

export interface OrderClient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface OrderBranchLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface OrderBranch {
  _id: string;
  name: string;
  locationName: string;
  location: OrderBranchLocation;
}

export interface Order {
  _id: string;
  client: OrderClient;
  products: OrderItem[];
  totalPrice: number;
  branch: OrderBranch;
  status: 'Pending' | 'Paid' | 'Processing' | 'Completed' | 'Cancelled';
  notes?: string;
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface CreateOrderDto {
  products: OrderItem[];
  notes?: string;
  status?: string;
  isPaid?: boolean;
}

export interface UpdateOrderDto {
  products?: OrderItem[];
  notes?: string;
  status?: string;
  isPaid?: boolean;
}

export interface PaginatedOrdersResponse {
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

export const ordersApi = {
  // Get paginated list of orders
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    pagination?: boolean;
    sortBy?: string;
  }): Promise<PaginatedOrdersResponse> => {
    const response = await api.get<PaginatedOrdersResponse>('/v1/orders', { params });
    return response;
  },

  // Get single order by ID
  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/v1/orders/${id}`);
    return response;
  },

  // Create new order
  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    const response = await api.post<Order>('/v1/orders', data);
    return response;
  },

  // Update order
  updateOrder: async (id: string, data: UpdateOrderDto): Promise<Order> => {
    const response = await api.patch<Order>(`/v1/orders/${id}`, data);
    return response;
  },

  // Delete order
  deleteOrder: async (id: string): Promise<void> => {
    await api.delete<void>(`/v1/orders/${id}`);
  },
}; 