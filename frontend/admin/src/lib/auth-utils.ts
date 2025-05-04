import { User } from "./users-api";

export interface AuthResponse {
  user: string; // URL encoded JSON string
  access_token: string;
  id_token: string;
}

export const parseAuthCallback = (searchParams: URLSearchParams): AuthResponse | null => {
  try {
    const userStr = searchParams.get('user');
    const access_token = searchParams.get('access_token');
    const id_token = searchParams.get('id_token');

    if (!userStr || !access_token || !id_token) {
      return null;
    }

    return {
      user: userStr,
      access_token,
      id_token
    };
  } catch (error) {
    console.error('Error parsing auth callback:', error);
    return null;
  }
};

export const saveAuthData = (authResponse: AuthResponse): User => {
  const user = JSON.parse(decodeURIComponent(authResponse.user)) as User;
  
  // Check if user has Admin role
  if (!user.type.includes('Admin')) {
    throw new Error('Access denied. Admin privileges required.');
  }

  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('access_token', authResponse.access_token);
  localStorage.setItem('id_token', authResponse.id_token);
  return user;
};

export const getStoredAuthData = (): { user: User | null; tokens: { accessToken: string | null; idToken: string | null } } => {
  if (typeof window === 'undefined') {
    return { user: null, tokens: { accessToken: null, idToken: null } };
  }
  
  const userStr = localStorage.getItem('user');
  const accessToken = localStorage.getItem('access_token');
  const idToken = localStorage.getItem('id_token');
  
  const user = userStr ? JSON.parse(userStr) as User : null;
  
  // Check if stored user has Admin role
  if (user && !user.type.includes('Admin')) {
    clearAuthData();
    return { user: null, tokens: { accessToken: null, idToken: null } };
  }

  return {
    user,
    tokens: { accessToken, idToken }
  };
};

export const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
};