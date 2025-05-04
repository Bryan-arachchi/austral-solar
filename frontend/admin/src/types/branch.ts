import { CATEGORY } from './enums';

export interface Branch {
  _id: string;
  name: string;
  locationName: string;
  location: {
    type: string;
    coordinates: number[];
  };
  phoneNumber: string;
  email: string;
  image: string;
  category?: CATEGORY;
  createdAt?: string;
  updatedAt?: string;
}