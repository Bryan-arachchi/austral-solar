'use client';

import Link from 'next/link';
import { Building2, ShoppingCart, Package, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  {
    title: 'Branches',
    description: 'Manage branch locations and details',
    icon: Building2,
    href: '/branchs',
    color: 'text-blue-600'
  },
  {
    title: 'Orders',
    description: 'View and manage customer orders',
    icon: ShoppingCart,
    href: '/orders',
    color: 'text-green-600'
  },
  {
    title: 'Products',
    description: 'Manage product inventory and details',
    icon: Package,
    href: '/products',
    color: 'text-purple-600'
  },
  {
    title: 'Users',
    description: 'Manage user accounts and permissions',
    icon: Users,
    href: '/users',
    color: 'text-orange-600'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.title} href={section.href}>
                <Card className="h-full transition-transform hover:scale-105 hover:shadow-lg cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-gray-100 ${section.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                        <p className="text-gray-500 mt-1">{section.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
