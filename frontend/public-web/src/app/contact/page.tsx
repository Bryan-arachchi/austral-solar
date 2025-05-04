'use client';

import { Card } from "@/components/ui/card";
import { MapPin, Mail, Phone } from "lucide-react";
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-[50vh] flex flex-col justify-center py-16 bg-white">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Contact <span className="text-green-500">Us</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          Whether you have inquiries about our services or want to discuss a potential
          collaboration, we're just a message away.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Our Address</h3>
              <p className="text-gray-600 text-sm">
                No 55 D.S Fonseka Road, Colombo 05, Sri Lanka
              </p>
            </div>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Mail className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <Link
                href="mailto:australsolar.lk@gmail.com"
                className="text-gray-600 text-sm hover:text-green-500 transition-colors"
              >
                australsolar.lk@gmail.com
              </Link>
            </div>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-white">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Phone className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <Link
                href="tel:+94762511794"
                className="text-gray-600 text-sm hover:text-green-500 transition-colors"
              >
                +94 76 251 1794
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
