"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { Branch, branchesApi } from "@/lib/branches-api";
import { loadGoogleMaps } from "@/lib/google-maps";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import RouteGuard from "@/components/RouteGuard";

declare global {
  interface Window {
    google: typeof google;
  }
}

// Define Google Maps types
type GoogleMap = google.maps.Map;
type GoogleMarker = google.maps.Marker;
type LatLngLiteral = google.maps.LatLngLiteral;
type MapMouseEvent = google.maps.MapMouseEvent;

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  position: "relative" as const,
  backgroundColor: "#f1f5f9",
  borderRadius: "0.5rem",
};

function BranchesContent() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBranch, setNewBranch] = useState<Partial<Branch>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Map refs and states with proper types
  const mapRef = useRef<HTMLDivElement>(null);
  const editMapRef = useRef<HTMLDivElement>(null);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [editMap, setEditMap] = useState<GoogleMap | null>(null);
  const [marker, setMarker] = useState<GoogleMarker | null>(null);
  const [editMarker, setEditMarker] = useState<GoogleMarker | null>(null);
  const [searchAutocomplete, setSearchAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [editSearchAutocomplete, setEditSearchAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const editSearchBoxRef = useRef<HTMLInputElement>(null);

  // Track if Google Maps is loaded
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    let isMounted = true;

    const loadGoogleMapsScript = async () => {
      try {
        await loadGoogleMaps();
        if (isMounted) {
          setIsGoogleMapsLoaded(true);
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        toast.error("Failed to load Google Maps");
      }
    };

    if (!isGoogleMapsLoaded && (isCreateDialogOpen || isEditDialogOpen)) {
      loadGoogleMapsScript();
    }

    return () => {
      isMounted = false;
    };
  }, [isGoogleMapsLoaded, isCreateDialogOpen, isEditDialogOpen]);

  const loadBranches = useCallback(async () => {
    console.log("Loading branches...");
    try {
      setLoading(true);
      setError(null);
      const response = await branchesApi.getBranches({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        sortBy: "createdAt:desc",
      });
      console.log("Branches response:", response);

      if (response) {
        console.log("Setting branches:", response.docs);
        setBranches(response.docs);
        setTotalPages(response.totalPages || 1);
      } else {
        console.error("Invalid response structure:", response);
        setError("Invalid response from server");
        setBranches([]);
        setTotalPages(1);
      }
    } catch (error: unknown) {
      console.error("Error loading branches:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load branches";
      setError(errorMessage);
      toast.error(errorMessage);
      setBranches([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const handleEdit = (branch: Branch) => {
    setEditingBranch({ ...branch });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedBranch) {
      try {
        await branchesApi.deleteBranch(selectedBranch._id);
        toast.success("Branch deleted successfully");
        loadBranches();
        setIsDeleteDialogOpen(false);
        setSelectedBranch(null);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete branch";
        toast.error(errorMessage);
      }
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isNewBranch: boolean = false
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        setIsUploading(true);
        const file = files[0];
        const imageUrl = await branchesApi.uploadImage(file);

        if (isNewBranch) {
          setNewBranch((prev) => ({ ...prev, image: imageUrl }));
        } else if (editingBranch) {
          setEditingBranch({
            ...editingBranch,
            image: imageUrl,
          });
        }
        toast.success("Image uploaded successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to upload image";
        toast.error(errorMessage);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (editingBranch) {
      try {
        await branchesApi.updateBranch(editingBranch._id, editingBranch);
        toast.success("Branch updated successfully");
        loadBranches();
        setIsEditDialogOpen(false);
        setEditingBranch(null);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update branch";
        toast.error(errorMessage);
      }
    }
  };

  const handleCreateBranch = async () => {
    try {
      if (!newBranch.name || !newBranch.locationName || !newBranch.location) {
        toast.error("Please fill in all required fields");
        return;
      }

      await branchesApi.createBranch({
        name: newBranch.name,
        locationName: newBranch.locationName,
        location: newBranch.location as {
          type: "Point";
          coordinates: [number, number];
        },
        phoneNumber: newBranch.phoneNumber,
        email: newBranch.email,
        image: newBranch.image || "",
      });
      toast.success("Branch created successfully");
      loadBranches();
      setIsCreateDialogOpen(false);
      setNewBranch({});
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create branch";
      toast.error(errorMessage);
    }
  };

  // Initialize map for create dialog
  const initializeCreateMap = useCallback(async () => {
    if (!mapRef.current || !searchBoxRef.current || !isGoogleMapsLoaded) return;

    try {
      // Wait for the DOM to be ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      const defaultLocation: LatLngLiteral = { lat: 7.077674, lng: 80.016433 }; // Sri Lanka center
      const mapOptions: google.maps.MapOptions = {
        center: defaultLocation,
        zoom: 8,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      };

      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);

      // Trigger a resize event after map initialization
      window.google.maps.event.trigger(newMap, "resize");

      const newMarker = new google.maps.Marker({
        position: defaultLocation,
        map: newMap,
        draggable: true,
      });
      setMarker(newMarker);

      // Initialize Places Autocomplete with proper options
      const autocomplete = new google.maps.places.Autocomplete(
        searchBoxRef.current,
        {
          componentRestrictions: { country: ["LK"] }, // Restrict to Sri Lanka
          types: ["geocode"],
          fields: ["formatted_address", "geometry", "name"], // Specify the fields we need
        }
      );

      // Bind Autocomplete to the map
      autocomplete.bindTo("bounds", newMap);

      setSearchAutocomplete(autocomplete);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          toast.error("No location found for this place");
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Update map view
        if (place.geometry.viewport) {
          newMap.fitBounds(place.geometry.viewport);
        } else {
          newMap.setCenter({ lat, lng });
          newMap.setZoom(17);
        }

        // Update marker
        newMarker.setPosition({ lat, lng });

        // Update form data
        setNewBranch((prev) => ({
          ...prev,
          locationName: place.formatted_address || place.name || "",
          location: {
            type: "Point",
            coordinates: [lng, lat], // longitude first, latitude second
          },
        }));
      });

      newMap.addListener("click", (e: MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        newMarker.setPosition(e.latLng);
        setNewBranch((prev) => ({
          ...prev,
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
        }));
      });

      newMarker.addListener("dragend", () => {
        const position = newMarker.getPosition();
        if (!position) return;
        const lat = position.lat();
        const lng = position.lng();
        setNewBranch((prev) => ({
          ...prev,
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
        }));
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Failed to initialize map");
    }
  }, [isGoogleMapsLoaded]);

  // Initialize map for edit dialog
  const initializeEditMap = useCallback(async () => {
    if (
      !editMapRef.current ||
      !editingBranch ||
      !editSearchBoxRef.current ||
      !isGoogleMapsLoaded
    )
      return;

    try {
      // Wait for the DOM to be ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      const location: LatLngLiteral = {
        lng: editingBranch.location.coordinates[0], // longitude first
        lat: editingBranch.location.coordinates[1], // latitude second
      };

      const mapOptions: google.maps.MapOptions = {
        center: location,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      };

      const newMap = new google.maps.Map(editMapRef.current, mapOptions);
      setEditMap(newMap);

      // Trigger a resize event after map initialization
      window.google.maps.event.trigger(newMap, "resize");

      const newMarker = new google.maps.Marker({
        position: location,
        map: newMap,
        draggable: true,
      });
      setEditMarker(newMarker);

      // Initialize Places Autocomplete with proper options
      const autocomplete = new google.maps.places.Autocomplete(
        editSearchBoxRef.current,
        {
          componentRestrictions: { country: ["LK"] }, // Restrict to Sri Lanka
          types: ["geocode"],
          fields: ["formatted_address", "geometry", "name"], // Specify the fields we need
        }
      );

      // Bind Autocomplete to the map
      autocomplete.bindTo("bounds", newMap);

      setEditSearchAutocomplete(autocomplete);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          toast.error("No location found for this place");
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Update map view
        if (place.geometry.viewport) {
          newMap.fitBounds(place.geometry.viewport);
        } else {
          newMap.setCenter({ lat, lng });
          newMap.setZoom(17);
        }

        // Update marker
        newMarker.setPosition({ lat, lng });

        // Update form data
        setEditingBranch((prev) =>
          prev
            ? {
                ...prev,
                locationName: place.formatted_address || place.name || "",
                location: {
                  type: "Point",
                  coordinates: [lng, lat], // longitude first, latitude second
                },
              }
            : null
        );
      });

      newMap.addListener("click", (e: MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        newMarker.setPosition(e.latLng);
        setEditingBranch((prev) =>
          prev
            ? {
                ...prev,
                location: {
                  type: "Point",
                  coordinates: [lng, lat], // longitude first, latitude second
                },
              }
            : null
        );
      });

      newMarker.addListener("dragend", () => {
        const position = newMarker.getPosition();
        if (!position) return;
        const lat = position.lat();
        const lng = position.lng();
        setEditingBranch((prev) =>
          prev
            ? {
                ...prev,
                location: {
                  type: "Point",
                  coordinates: [lng, lat], // longitude first, latitude second
                },
              }
            : null
        );
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Failed to initialize map");
    }
  }, [editingBranch, isGoogleMapsLoaded]);

  // Initialize maps when dialogs open and Google Maps is loaded
  useEffect(() => {
    if (isCreateDialogOpen && isGoogleMapsLoaded) {
      initializeCreateMap();
    }
  }, [isCreateDialogOpen, isGoogleMapsLoaded, initializeCreateMap]);

  useEffect(() => {
    if (isEditDialogOpen && editingBranch && isGoogleMapsLoaded) {
      initializeEditMap();
    }
  }, [isEditDialogOpen, editingBranch, isGoogleMapsLoaded, initializeEditMap]);

  // Cleanup maps when dialogs close
  useEffect(() => {
    if (!isCreateDialogOpen) {
      setMap(null);
      setMarker(null);
      setSearchAutocomplete(null);
      // Reset Google Maps loaded state when dialog closes
      setIsGoogleMapsLoaded(false);
    }
  }, [isCreateDialogOpen]);

  useEffect(() => {
    if (!isEditDialogOpen) {
      setEditMap(null);
      setEditMarker(null);
      setEditSearchAutocomplete(null);
      // Reset Google Maps loaded state when dialog closes
      setIsGoogleMapsLoaded(false);
    }
  }, [isEditDialogOpen]);

  // Handle dialog open/close
  const handleCreateDialogChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      // Reset states when dialog closes
      setMap(null);
      setMarker(null);
      setSearchAutocomplete(null);
      setIsGoogleMapsLoaded(false);
      setNewBranch({});
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      // Reset states when dialog closes
      setEditMap(null);
      setEditMarker(null);
      setEditSearchAutocomplete(null);
      setIsGoogleMapsLoaded(false);
      setEditingBranch(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Branches</h1>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search branches..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8"
                />
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Branch
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                {branches.length === 0 ? (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    No branches found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {branches.map((branch) => (
                        <TableRow key={branch._id}>
                          <TableCell className="font-medium">
                            {branch.name}
                          </TableCell>
                          <TableCell>{branch.locationName}</TableCell>
                          <TableCell>{branch.phoneNumber || "-"}</TableCell>
                          <TableCell>{branch.email || "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(branch)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(branch)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>
              Update branch information and location. Search for a location or
              click/drag the marker on the map.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Search Location</Label>
              <Input
                ref={editSearchBoxRef}
                type="text"
                placeholder="Search for a location..."
                className="mb-2"
              />
              <div ref={editMapRef} style={mapContainerStyle} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editingBranch?.name || ""}
                onChange={(e) =>
                  setEditingBranch((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationName" className="text-right">
                Location Name
              </Label>
              <Input
                id="locationName"
                value={editingBranch?.locationName || ""}
                onChange={(e) =>
                  setEditingBranch((prev) =>
                    prev ? { ...prev, locationName: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                value={editingBranch?.phoneNumber || ""}
                onChange={(e) =>
                  setEditingBranch((prev) =>
                    prev ? { ...prev, phoneNumber: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editingBranch?.email || ""}
                onChange={(e) =>
                  setEditingBranch((prev) =>
                    prev ? { ...prev, email: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Branch</DialogTitle>
            <DialogDescription>
              Add a new branch by providing the required information. Search for
              a location or click/drag the marker on the map.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Search Location</Label>
              <Input
                ref={searchBoxRef}
                type="text"
                placeholder="Search for a location..."
                className="mb-2"
              />
              <div ref={mapRef} style={mapContainerStyle} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-name" className="text-right">
                Name
              </Label>
              <Input
                id="new-name"
                value={newBranch.name || ""}
                onChange={(e) =>
                  setNewBranch((prev) => ({ ...prev, name: e.target.value }))
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-locationName" className="text-right">
                Location Name
              </Label>
              <Input
                id="new-locationName"
                value={newBranch.locationName || ""}
                onChange={(e) =>
                  setNewBranch((prev) => ({
                    ...prev,
                    locationName: e.target.value,
                  }))
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-phone" className="text-right">
                Phone
              </Label>
              <Input
                id="new-phone"
                value={newBranch.phoneNumber || ""}
                onChange={(e) =>
                  setNewBranch((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-email" className="text-right">
                Email
              </Label>
              <Input
                id="new-email"
                type="email"
                value={newBranch.email || ""}
                onChange={(e) =>
                  setNewBranch((prev) => ({ ...prev, email: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-image" className="text-right">
                Image
              </Label>
              <Input
                id="new-image"
                type="file"
                onChange={(e) => handleImageUpload(e, true)}
                accept="image/*"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateBranch} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Create Branch"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete this
              branch?
            </DialogDescription>
          </DialogHeader>
          <p>Are you sure you want to delete {selectedBranch?.name}?</p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function BranchesPage() {
  return (
    <RouteGuard>
      <BranchesContent />
    </RouteGuard>
  );
}
