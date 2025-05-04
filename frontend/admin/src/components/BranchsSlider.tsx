import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { BranchCard } from '@/components/BranchCard';

const branchesData = [
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
    image: "/background.jpg"
  },
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
    image: "/background.jpg"
  },
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
    image: "/background.jpg"
  },
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
    image: "/background.jpg"
  },
  // ... other branch data
];

export const BranchSlider = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 4
    },
    [Autoplay({ delay: 3000 })]
  );

  return (
    <div className="overflow-hidden w-full" ref={emblaRef}>
      <div className="flex">
        {[...branchesData, ...branchesData, ...branchesData].map((branch, index) => (
          <div key={`${branch._id}-${index}`} className="flex-[0_0_25%] min-w-0 px-2">
            <BranchCard branch={branch} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchSlider;
