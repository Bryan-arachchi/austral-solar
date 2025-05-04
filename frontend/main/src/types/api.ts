export interface Profile {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    phoneNumber: string;
    email: string;
    type: string[];
    address?: string;
    city?: string;
    country?: string;
    location?: {
      type: "Point";
      coordinates: [number, number];
    };
  }
  
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
  }