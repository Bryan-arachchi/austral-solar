import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Austral Solar</h3>
            <p className="text-gray-600 text-sm">
              We are dedicated to delivering innovative, reliable, and economically viable renewable
              energy solutions to power Sri Lanka's progress.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <address className="text-gray-600 text-sm not-italic">
              <p>No 55 D.S Fonseka Road</p>
              <p>Colombo 05</p>
              <p>Sri Lanka</p>
              <p className="mt-2">Phone (Sales): +94 76 251 1794</p>
              <p>Phone (Eng): +94 76 434 6678</p>
              <p>Email: australsolar.lk@gmail.com</p>
            </address>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About Us</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link></li>
              <li><Link href="/projects" className="text-gray-600 hover:text-gray-900">Our Projects</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Our Social Networks</h4>
            <p className="text-sm text-gray-600">
              Join us on our social media platforms to stay connected, informed, and engaged.
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-sm text-gray-600 flex justify-between items-center">
          <p>© Copyright Austral Solar. All Rights Reserved</p>
          <p>Designed by Austral Solar</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
