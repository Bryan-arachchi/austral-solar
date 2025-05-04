'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authApi } from '@/lib/auth-api'
import { Profile } from '@/types/api'
import { getStoredAuthData } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import RouteGuard from '@/components/RouteGuard'

declare global {
  interface Window {
    google: any;
  }
}

export default function AdditionalInformation() {
  return (
    <RouteGuard>
      <LocationForm />
    </RouteGuard>
  );
}

function LocationForm() {
  const router = useRouter();
  const mapRef = useRef(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile> & { _id?: string }>({
    location: {
      type: 'Point',
      coordinates: [80.016433, 7.077674]
    },
    phoneNumber: '',
    address: '',
    city: '',
    country: 'Sri Lanka'
  });

  useEffect(() => {
    // Remove the authentication check since RouteGuard handles it
    const { user } = getStoredAuthData();
    
    // Set initial form data from user profile
    setFormData(prev => ({
      ...prev,
      _id: user?._id,
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
      city: user?.city || '',
      location: user?.location || prev.location,
    }));

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const mapOptions = {
      center: { 
        lat: formData.location?.coordinates[1] || 7.077674, 
        lng: formData.location?.coordinates[0] || 80.016433 
      },
      zoom: 10
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    const newMarker = new window.google.maps.Marker({
      position: mapOptions.center,
      map: newMap,
      draggable: true
    });
    setMarker(newMarker);

    newMap.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      newMarker.setPosition(e.latLng);
      setFormData(prev => ({
        ...prev,
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      }));
    });

    newMarker.addListener('dragend', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setFormData(prev => ({
        ...prev,
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      }));
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData._id) {
        throw new Error('User ID is missing');
      }

      const response = await authApi.updateProfile(formData as Profile & { _id: string });

      // Update localStorage with new data
      const { user } = getStoredAuthData();
      if (user) {
        localStorage.setItem('user', JSON.stringify({
          ...user,
          ...formData
        }));
      }

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Profile updated successfully',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        timer: 3000,
        timerProgressBar: true
      });

      // Redirect to home page after successful update
      router.push('/');

    } catch (error) {
      console.error('Error updating profile:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        timer: 3000,
        timerProgressBar: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 my-24">
      <CardHeader>
        <CardTitle>Location Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            ref={mapRef}
            className="w-full h-[400px] mb-6 rounded-lg overflow-hidden"
          />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                disabled
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
