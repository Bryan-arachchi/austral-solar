import axios, { 
  AxiosInstance, 
  AxiosResponse, 
  AxiosError, 
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosHeaders 
} from 'axios';

interface BaseResponse {
  message?: string;
  status?: number;
}

export type ApiResponse<T> = T & BaseResponse;

interface ExtendedRequestConfig extends AxiosRequestConfig {
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
}

export class ApiClient {
  private api: AxiosInstance;
  private accessTokenKey: string;
  private idTokenKey: string;

  constructor(
    baseURL: string = `${process.env.NEXT_PUBLIC_API_URL}`, 
    accessTokenKey: string = 'access_token',
    idTokenKey: string = 'id_token'
  ) {
    this.accessTokenKey = accessTokenKey;
    this.idTokenKey = idTokenKey;
    
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
          
          // Initialize headers if they don't exist
          if (!config.headers) {
            config.headers = new AxiosHeaders();
          }

          // Set authorization header if token exists
          if (idToken) {
            config.headers.set('Authorization', `Bearer ${idToken}`);
            console.log('Setting Authorization header:', config.headers.get('Authorization'));
          } else {
            console.warn('No ID token found in localStorage');
          }

          // Ensure content type is set
          config.headers.set('Content-Type', 'application/json');
        }
        return config;
      },
      (error: AxiosError) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('Response headers:', response.config.headers);
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          console.warn('Unauthorized access, clearing tokens');
          this.removeTokens();
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management methods
  public setTokens(accessToken: string, idToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.idTokenKey, idToken);
    console.log('Tokens set in localStorage');
  }

  public getTokens(): { accessToken: string | null; idToken: string | null } {
    const tokens = {
      accessToken: localStorage.getItem(this.accessTokenKey),
      idToken: localStorage.getItem(this.idTokenKey)
    };
    console.log('Retrieved tokens:', tokens);
    return tokens;
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.idTokenKey);
    console.log('Tokens removed from localStorage');
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
        console.error('Request error:', errorMessage);
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
}

// Create a singleton instance
export const api = new ApiClient();