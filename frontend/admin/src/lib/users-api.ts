/* eslint-disable @typescript-eslint/no-empty-object-type */
import { api } from './api-client';
import { GeoJSONPoint } from './branches-api';

export type UserType = 'Admin' | 'Client';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  type: UserType[];
  email: string;
  loginEnabled: boolean;
  authState?: string;
  location?: GeoJSONPoint;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  avatar?: string;
  type: UserType[];
  email: string;
  loginEnabled?: boolean;
  authState?: string;
  location?: GeoJSONPoint;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface UsersResponse {
  docs: User[];
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

export const usersApi = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
  }): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>('/v1/users', {
      params: {
        ...params,
        pagination: true
      }
    });
    return response;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/v1/users/${id}`);
    return response;
  },

  createUser: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/v1/users', data);
    return response;
  },

  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.patch<User>(`/v1/users/${id}`, data);
    return response;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/v1/users/${id}`);
  }
}; 