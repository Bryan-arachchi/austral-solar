import { Profile } from '../types/api';
import { api } from './api-client';

interface ProfileResponse {
  user: Profile;
  'x-request-id': string;
}

export const authApi = {
  getLoginUrl: async () => {
    const response = await api.get<{ url: string }>('/v1/auth/login');
    return response;
  },

  getProfile: async (): Promise<Profile> => {
    const response = await api.get<ProfileResponse>('/v1/auth/profile');
    return response.user;
  },

  updateProfile: async (data: Partial<Profile> & { _id: string }): Promise<Profile> => {
    const response = await api.patch<ProfileResponse>(`/v1/users/${data._id}`, data);
    return response.user;
  }
};
