import axios, { 
  AxiosInstance, 
  AxiosResponse, 
  AxiosError, 
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosHeaders 
} from 'axios';
import { toast } from 'sonner';

interface BaseResponse {
  message?: string;
  status?: number;
}

export type ApiResponse<T> = T & BaseResponse;

interface ExtendedRequestConfig extends AxiosRequestConfig {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export class ApiClient {
  private api: AxiosInstance;
  private accessTokenKey: string;
  private idTokenKey: string;

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    accessTokenKey: string = 'access_token',
    idTokenKey: string = 'id_token'
  ) {
    this.accessTokenKey = accessTokenKey;
    this.idTokenKey = idTokenKey;
    
    if (!baseURL) {
      console.error('API URL not configured. Please check your environment variables.');
      toast.error('API configuration error. Please contact support.');
    }

    this.api = axios.create({
      baseURL,
      headers: new AxiosHeaders({
        'Content-Type': 'application/json',
      }),
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const idToken = localStorage.getItem(this.idTokenKey);
          
          if (!config.headers) {
            config.headers = new AxiosHeaders();
          }

          if (idToken) {
            config.headers.set('Authorization', `Bearer ${idToken}`);
          }

          config.headers.set('Content-Type', 'application/json');
        }
        return config;
      },
      (error: AxiosError) => {
        console.error('Request interceptor error:', error);
        toast.error('Request failed. Please try again.');
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.removeTokens();
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to perform this action.');
        } else if (error.response?.status === 404) {
          toast.error('Resource not found.');
        } else if (error.response?.status === 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error('An error occurred. Please try again.');
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management methods
  public setTokens(accessToken: string, idToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.idTokenKey, idToken);
  }

  public getTokens(): { accessToken: string | null; idToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      idToken: localStorage.getItem(this.idTokenKey)
    };
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.idTokenKey);
  }

  private async handleRequest<T>(
    request: Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const response = await request;
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage || 'An error occurred');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // HTTP methods with proper header handling
  public async get<T>(endpoint: string, config: ExtendedRequestConfig = {}): Promise<T> {
    const idToken = localStorage.getItem(this.idTokenKey);
    const headers = new AxiosHeaders({
      ...config.headers,
      'Authorization': idToken ? `Bearer ${idToken}` : '',
      'Content-Type': 'application/json'
    });
    return this.handleRequest<T>(this.api.get(endpoint, { ...config, headers }));
  }

  public async post<T, D = unknown>(
    endpoint: string,
    data?: D,
    config: ExtendedRequestConfig = {}
  ): Promise<T> {
    const idToken = localStorage.getItem(this.idTokenKey);
    const headers = new AxiosHeaders({
      ...config.headers,
      'Authorization': idToken ? `Bearer ${idToken}` : '',
      'Content-Type': 'application/json'
    });
    return this.handleRequest<T>(this.api.post(endpoint, data, { ...config, headers }));
  }

  public async patch<T, D = unknown>(
    endpoint: string,
    data?: D,
    config: ExtendedRequestConfig = {}
  ): Promise<T> {
    const idToken = localStorage.getItem(this.idTokenKey);
    const headers = new AxiosHeaders({
      ...config.headers,
      'Authorization': idToken ? `Bearer ${idToken}` : '',
      'Content-Type': 'application/json'
    });
    return this.handleRequest<T>(this.api.patch(endpoint, data, { ...config, headers }));
  }

  public async delete<T>(
    endpoint: string,
    config: ExtendedRequestConfig = {}
  ): Promise<T> {
    const idToken = localStorage.getItem(this.idTokenKey);
    const headers = new AxiosHeaders({
      ...config.headers,
      'Authorization': idToken ? `Bearer ${idToken}` : '',
      'Content-Type': 'application/json'
    });
    return this.handleRequest<T>(this.api.delete(endpoint, { ...config, headers }));
  }
}

// Create a singleton instance
export const api = new ApiClient();