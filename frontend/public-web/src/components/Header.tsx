'use client';

import React from 'react';
import Link from 'next/link';
import { Disclosure } from '@headlessui/react';
import { Menu, X } from 'lucide-react';

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Store", href: "https://store.australsolar.click" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },

];

const Header = () => {
  return (
    <header className="border-b">
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-xl font-bold">Austral Solar</span>
                  <span className="text-green-500">.</span>
                </Link>

                {/* Desktop navigation */}
                <div className="hidden md:flex space-x-6">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <X className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Menu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>

              {/* Mobile menu carousel */}
              <Disclosure.Panel className="md:hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex space-x-4 px-2 pb-3 pt-2">
                    {navigationLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex-shrink-0 px-4 py-2 text-slate-600 font-medium whitespace-nowrap hover:text-gray-900 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </div>
          </>
        )}
      </Disclosure>
    </header>
  );
};

export default Header;
