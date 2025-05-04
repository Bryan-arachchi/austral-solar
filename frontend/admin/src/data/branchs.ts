import { Branch } from '@/types/branch';

interface PaginatedBranches {
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

export const branchsData: PaginatedBranches = {
  docs: [
  {
    _id: "671348051118396f4045441c",
    name: "Malabe Main Branch",
    locationName: "Malabe City Center",
    location: {
      type: "Point",
      coordinates: [6.8991257, 79.9558501]
    },
    phoneNumber: "+94772046874",
    email: "Malabe.branch@example.com",
    image: "/branch-1.jpg"
  },
  {
    _id: "671348051118396f4045441d",
    name: "Colombo Branch",
    locationName: "Colombo 03",
    location: {
      type: "Point",
      coordinates: [6.9271, 79.8612]
    },
    phoneNumber: "+94112345678",
    email: "colombo.branch@example.com",
    image: "/branch-2.jpg"
  },
  {
    _id: "671348051118396f4045441e",
    name: "Kandy Branch",
    locationName: "Kandy City Center",
    location: {
      type: "Point",
      coordinates: [7.2906, 80.6337]
    },
    phoneNumber: "+94812345678",
    email: "kandy.branch@example.com",
    image: "/branch-3.jpg"
  }
  ],
  totalDocs: 3,
  limit: 8,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: true,
  prevPage: null,
  nextPage: null
};