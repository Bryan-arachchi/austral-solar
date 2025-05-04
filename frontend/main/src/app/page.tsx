'use client';

import { ProductGrid } from '@/components/ProductGrid';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { productsApi, Product } from '@/lib/products-api';
import { branchesApi, Branch } from '@/lib/branches-api';
import { toast } from 'sonner';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, branchesResponse] = await Promise.all([
        productsApi.getProducts({ limit: 4 }), // Load only 4 featured products
        branchesApi.getBranches({ limit: 3 }) // Load only 3 branches
      ]);

      setFeaturedProducts(productsResponse.docs);
      setBranches(branchesResponse.docs);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <Image
            src="/background.jpg"
            alt="Solar panels on building"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Welcome to <span className="text-green-500">Austral Solar</span>
          </h1>
          <p className="text-lg md:text-xl text-center mb-8 max-w-2xl">
            Harvesting Sunshine, Redefining Power: Our Commitment to Solar Excellence
          </p>
          <div className="flex gap-4">
            <Button
              variant="default"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              OUR SERVICES
            </Button>
            <Button
              variant="outline"
              className="border-black hover:border-white text-white bg-black hover:bg-white hover:text-black"
            >
              GET A QUOTE
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="mt-2 text-gray-600">Discover our latest solar solutions</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="flex items-center gap-2">
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </div>
      </section>

      {/* Branches Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Our Branches</h2>
              <p className="mt-2 text-gray-600">Find us near you</p>
            </div>
            <Link href="/branchs">
              <Button variant="outline" className="flex items-center gap-2">
                View All Branches
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <Card key={branch._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{branch.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-gray-600">{branch.locationName}</p>
                          <p className="text-sm text-gray-500 mt-1">{branch.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <p className="text-gray-600">
                          <a href={`tel:${branch.phoneNumber}`} className="hover:text-blue-500">
                            {branch.phoneNumber}
                          </a>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <p className="text-gray-600">
                          <a href={`mailto:${branch.email}`} className="hover:text-blue-500">
                            {branch.email}
                          </a>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
