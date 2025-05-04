// data/products.ts

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  wattage: number | string;
  voltage: number;
  dimensions: string;
  weight: number;
  manufacturer: string;
  warranty: string;
  stock: number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ProductsResponse {
  docs: Product[];
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

export const products: Product[] = [
  {
    _id: "6713858175c3728ec46e5c1a",
    name: 'Solar Panel Pro X1',
    description: 'High-efficiency monocrystalline solar panel with advanced technology for maximum power output',
    price: 299.99,
    images: ['/product-images/panel1.jpg'],
    category: 'Panels',
    wattage: 400,
    voltage: 24,
    dimensions: '1956 x 992 x 40mm',
    weight: 22.5,
    manufacturer: 'SolarTech Industries',
    warranty: '25 years',
    stock: 50,
    isAvailable: true
  },
  {
    _id: "6713857375c3728ec46e5c18",
    name: 'EcoPanel 2000',
    description: 'Eco-friendly solar panel with excellent low-light performance',
    price: 249.99,
    images: ['/product-images/panel2.jpg'],
    category: 'Panels',
    wattage: 350,
    voltage: 24,
    dimensions: '1765 x 1048 x 35mm',
    weight: 20.0,
    manufacturer: 'GreenEnergy Co',
    warranty: '20 years',
    stock: 30,
    isAvailable: true
  },
  {
    _id: '3',
    name: 'PowerMax Solar',
    description: 'Premium solar panel designed for residential installations',
    price: 399.99,
    images: ['/product-images/panel3.jpg'],
    category: 'Panels',
    wattage: 450,
    voltage: 48,
    dimensions: '2050 x 1052 x 35mm',
    weight: 25.0,
    manufacturer: 'PowerTech Solutions',
    warranty: '30 years',
    stock: 0,
    isAvailable: false
  }
];