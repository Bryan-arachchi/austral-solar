import { api } from './api-client';
import { User } from './users-api';

interface ProfileResponse {
  user: User;
  'x-request-id': string;
}

export const authApi = {
  getLoginUrl: async () => {
    const response = await api.get<{ url: string }>('/v1/auth/login');
    return response;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ProfileResponse>('/v1/auth/profile');
    return response.user;
  },

  updateProfile: async (data: Partial<User> & { _id: string }): Promise<User> => {
    const response = await api.patch<ProfileResponse>(`/v1/users/${data._id}`, data);
    return response.user;
  }
};
