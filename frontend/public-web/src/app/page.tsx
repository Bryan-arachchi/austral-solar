'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="relative h-[80vh] overflow-hidden">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <Image
            src="/services/industrial_solutions.png"
            alt="Solar panels on building"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>

        {/* Content Overlay */}
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

      {/* Why Choose Us Section */}
      <WhyChooseUs />
    </>
  );
}
