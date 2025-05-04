import { api } from './api-client';

export interface Branch {
  _id: string;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  locationName: string;
  email: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  openingHours: string;
  createdAt: string;
  updatedAt: string;
}

export interface BranchesResponse {
  docs: Branch[];
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

export const branchesApi = {
  getBranches: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
  }): Promise<BranchesResponse> => {
    const response = await api.get<BranchesResponse>('/v1/branches', {
      params: {
        ...params,
        pagination: 'true'
      }
    });
    return response;
  },

  getBranch: async (id: string): Promise<Branch> => {
    const response = await api.get<Branch>(`/v1/branches/${id}`);
    return response;
  }
}; 