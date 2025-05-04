export interface Location {
  type: string;
  coordinates: number[];
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  type: string[];
  email: string;
  loginEnabled: boolean;
  authState: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  address?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  location?: Location;
}

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

export const users: User[] = [
  {
    _id: "677793284bfadffe8cca1d8f",
    firstName: "Vidwa",
    lastName: "De Seram",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocLH0yaQY95HZAllilnAS3KSl94KRd9zlJlhTKqHKXvZvvhxiQ=s96-c",
    type: ["Client", "Admin"],
    email: "vidwa@xaventra.com",
    loginEnabled: true,
    authState: "Verified",
    createdAt: "2025-01-03T07:35:05.018Z",
    updatedAt: "2025-01-03T07:35:05.018Z",
    __v: 0
  },
  {
    _id: "67778cb54bfadffe8cca1d7e",
    firstName: "Vidwa",
    lastName: "De Seram",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocLWTWjmKly9cMt33-lR--NXcXCWQCbqq4g-x9h3jSqMkx8bRnaP=s96-c",
    type: ["Client", "Admin"],
    email: "vidwadeseram2002@gmail.com",
    loginEnabled: true,
    authState: "Verified",
    createdAt: "2025-01-03T07:07:33.274Z",
    updatedAt: "2025-01-20T08:59:15.035Z",
    __v: 0,
    address: "107,waga",
    phoneNumber: "+94770805444",
    city: "hanwella",
    country: "Sri Lanka",
    location: {
      type: "Point",
      coordinates: [80.016433, 7.077674]
    }
  }
];