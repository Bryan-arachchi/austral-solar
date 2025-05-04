import { api } from './api-client';

export interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Branch {
  _id: string;
  name: string;
  locationName: string;
  location: GeoJSONPoint;
  phoneNumber?: string;
  email?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchDto {
  name: string;
  locationName: string;
  location: GeoJSONPoint;
  phoneNumber?: string;
  email?: string;
  image: string;
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {
  _id: string;
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

export interface S3PresignedUrlResponse {
  presignedUrl: string;
  s3url: string;
}

type FindNearestParams = Record<string, string | number | boolean>;

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
        pagination: true
      }
    });
    return response;
  },

  getBranch: async (id: string): Promise<Branch> => {
    const response = await api.get<Branch>(`/v1/branches/${id}`);
    return response;
  },

  createBranch: async (data: CreateBranchDto): Promise<Branch> => {
    const response = await api.post<Branch>('/v1/branches', data);
    return response;
  },

  updateBranch: async (id: string, data: UpdateBranchDto): Promise<Branch> => {
    const response = await api.patch<Branch>(`/v1/branches/${id}`, data);
    return response;
  },

  deleteBranch: async (id: string): Promise<void> => {
    await api.delete(`/v1/branches/${id}`);
  },

  findNearest: async (params: FindNearestParams): Promise<Branch[]> => {
    const response = await api.get<Branch[]>('/v1/branches/nearest', { params });
    return response;
  },

  uploadImage: async (file: File): Promise<string> => {
    try {
      // 1. Get presigned URL
      const presignedUrlResponse = await api.post<S3PresignedUrlResponse>('/v1/s3/generate-presigned-url', {
        fileName: file.name,
        domain: 'Branch',
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