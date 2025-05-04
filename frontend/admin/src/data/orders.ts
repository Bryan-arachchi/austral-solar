// data/orders.ts

export interface Location {
  type: string;
  coordinates: number[];
}

export interface Branch {
  _id: string;
  name: string;
  locationName: string;
  location: Location;
}

export interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface OrderProduct {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  client: Client;
  products: OrderProduct[];
  totalPrice: number;
  branch: Branch;
  status: string;
  notes: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface OrdersResponse {
  docs: Order[];
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

export const orders: Order[] = [
  {
    _id: "673754872e37adecb6d33733",
    client: {
      _id: "671e85e3466bf68670679b04",
      firstName: "sini",
      lastName: "kurulla",
      email: "dfanso@pm.me"
    },
    products: [
      {
        product: {
          _id: "6713856475c3728ec46e5c14",
          name: "LED Desk Lamp",
          description: "A sleek and modern LED desk lamp with adjustable brightness levels.",
          price: 1000,
          category: "LED"
        },
        quantity: 1,
        price: 1000
      }
    ],
    totalPrice: 1000,
    branch: {
      _id: "671348051118396f4045441c",
      name: "Malabe Main Branch",
      locationName: "Malabe City Center",
      location: {
        type: "Point",
        coordinates: [6.8991257, 79.9558501]
      }
    },
    status: "Pending",
    notes: "Test",
    isPaid: false,
    createdAt: "2024-11-15T14:02:47.138Z",
    updatedAt: "2024-11-15T14:02:47.138Z",
    __v: 0,
    id: "673754872e37adecb6d33733"
  },
  {
    _id: "67374f154867d415cc62b433",
    client: {
      _id: "671e85e3466bf68670679b04",
      firstName: "sini",
      lastName: "kurulla",
      email: "dfanso@pm.me"
    },
    products: [
      {
        product: {
          _id: "6713856475c3728ec46e5c14",
          name: "LED Desk Lamp",
          description: "A sleek and modern LED desk lamp with adjustable brightness levels.",
          price: 1000,
          category: "LED"
        },
        quantity: 1,
        price: 1000
      }
    ],
    totalPrice: 1000,
    branch: {
      _id: "671348051118396f4045441c",
      name: "Malabe Main Branch",
      locationName: "Malabe City Center",
      location: {
        type: "Point",
        coordinates: [6.8991257, 79.9558501]
      }
    },
    status: "Pending",
    notes: "Test",
    isPaid: false,
    createdAt: "2024-11-15T13:39:33.424Z",
    updatedAt: "2024-11-15T13:39:33.424Z",
    __v: 0,
    id: "67374f154867d415cc62b433"
  }
];