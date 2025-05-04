import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";

type BranchType = {
  _id: string;
  name: string;
  locationName: string;
  location: {
    type: string;
    coordinates: number[];
  };
  phoneNumber: string;
  email: string;
  image: string;
};

interface BranchCardProps {
  branch: BranchType;
}

export const BranchCard = ({ branch }: BranchCardProps) => {
  const handleLocationClick = (coordinates: number[]) => {
    const [lat, lng] = coordinates;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <Card className="relative">
      <div className="relative w-full h-48">
        <Image
          src={branch.image}
          alt={branch.name}
          fill
          className="object-cover"
          priority
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{branch.name}</h3>
        <p className="text-gray-600">{branch.locationName}</p>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4">
              More Info
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{branch.name}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-48">
              <Image
                src={branch.image}
                alt={branch.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{branch.locationName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{branch.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{branch.email}</span>
              </div>
              <Button
                onClick={() => handleLocationClick(branch.location.coordinates)}
                className="w-full"
              >
                View on Google Maps
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
