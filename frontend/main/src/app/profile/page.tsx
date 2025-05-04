"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Pencil, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import RouteGuard from '@/components/RouteGuard';
import { authApi } from '@/lib/auth-api';
import { toast } from 'sonner';
import { Profile } from '@/types/api';
import { loadGoogleMaps } from '@/lib/google-maps';



// Separate the main profile content into its own component
function ProfileContent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    firstName: "",
    lastName: "",
    avatar: "",
    phoneNumber: "",
    email: "",
    type: ["Client"],
    _id: "",
    location: {
      type: "Point",
      coordinates: [7.077674, 80.016433]
    }
  });

  const [editedProfile, setEditedProfile] = useState<Profile>(profile);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);


  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || !searchInputRef.current) return;

    // Get initial coordinates from profile or default to a location in Sri Lanka
    // GeoJSON format: [longitude, latitude]
    const coordinates = editedProfile.location?.coordinates || [7.9731674, 80.016433];

    // Convert GeoJSON [lng, lat] to Google Maps {lat, lng}
    const mapOptions = {
      center: { 
        lat: coordinates[1], // latitude is second in GeoJSON
        lng: coordinates[0]  // longitude is first in GeoJSON
      },
      zoom: 12
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    const newMarker = new window.google.maps.Marker({
      map: newMap,
      position: mapOptions.center,
      draggable: true
    });

    // Initialize search box
    const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);
    
    // Bias searchBox results towards current map's viewport
    newMap.addListener('bounds_changed', () => {
      searchBox.setBounds(newMap.getBounds() as google.maps.LatLngBounds);
    });

    // Listen for searchBox place selection
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      // Update map and marker
      newMap.setCenter(place.geometry.location);
      newMarker.setPosition(place.geometry.location);

      // Update edited profile with new coordinates - Store as [lng, lat] for GeoJSON
      setEditedProfile(prev => ({
        ...prev,
        location: {
          type: "Point",
          coordinates: [
            place.geometry.location.lng(), // Store longitude first
            place.geometry.location.lat()  // Then latitude
          ]
        }
      }));
    });

    // Listen for marker drag end
    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      if (!position) return;

      // Store as [lng, lat] for GeoJSON
      setEditedProfile(prev => ({
        ...prev,
        location: {
          type: "Point",
          coordinates: [
            position.lng(), // Store longitude first
            position.lat()  // Then latitude
          ]
        }
      }));
    });


    setMarker(newMarker);
  }, [editedProfile.location?.coordinates]);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const profileData = await authApi.getProfile();
      if (profileData) {
        setProfile(profileData);
        setEditedProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (isEditing && mapRef.current) {
      loadGoogleMaps()
        .then(() => {
          initializeMap();
        })
        .catch((error) => {
          console.error('Error loading Google Maps:', error);
          toast.error('Failed to load map');
        });
    }
  }, [isEditing, initializeMap]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewAvatar(result);
        setEditedProfile(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCoordinates = (coordinates: [number, number]) => {
    // Convert from GeoJSON [lng, lat] to display format "lat°N, lng°E"
    return `${coordinates[1].toFixed(6)}°N, ${coordinates[0].toFixed(6)}°E`;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the current marker position
      const position = marker?.getPosition();
      const location = {
        type: "Point" as const,
        coordinates: position ? [
          position.lng(),
          position.lat()
        ] as [number, number] : editedProfile.location?.coordinates || [79.9731674, 6.9148818]
      };

      // Format coordinates for display before sending
      const displayCoords = formatCoordinates(location.coordinates);
      console.log('Sending coordinates:', displayCoords);

      const updateData = {
        _id: profile._id,
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        avatar: editedProfile.avatar,
        location
      };

      await authApi.updateProfile(updateData);
      await loadProfile();
      
      setIsEditing(false);
      setPreviewAvatar(null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setPreviewAvatar(null);
  };

  const InfoField = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1">
      <Label className="text-sm text-gray-500">{label}</Label>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );

  // Add loading state display
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your profile information
              </p>
            </div>
            <Button
              onClick={() => !isEditing && setIsEditing(true)}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Avatar Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Profile Picture</h3>
              <Separator />
              <div className="flex items-center space-x-6">
                <div className={`relative group ${isEditing ? 'cursor-pointer' : ''}`} onClick={handleAvatarClick}>
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={previewAvatar || profile.avatar}
                      alt="Profile"
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl">
                      {profile.firstName?.[0] || ''}{profile.lastName?.[0] || ''}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={editedProfile.firstName}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={editedProfile.lastName}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <InfoField label="First Name" value={profile.firstName} />
                    <InfoField label="Last Name" value={profile.lastName} />
                  </>
                )}
                <InfoField label="Email" value={profile.email} />
                <InfoField label="Phone Number" value={profile.phoneNumber || 'Not set'} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </h3>
              <Separator />
              {isEditing ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for a location..."
                      className="w-full pl-10"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <div
                    ref={mapRef}
                    className="w-full h-[400px] rounded-lg overflow-hidden"
                  />
                  {/* Display current coordinates in human-readable format */}
                  <div className="text-sm text-gray-500">
                    Current Location: {profile.location?.coordinates ? formatCoordinates(profile.location.coordinates) : 'Not set'}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Location: {profile.location?.coordinates ? formatCoordinates(profile.location.coordinates) : 'Not set'}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

// Wrap the profile content with RouteGuard
export default function ProfilePage() {
  return (
    <RouteGuard>
      <ProfileContent />
    </RouteGuard>
  );
}
