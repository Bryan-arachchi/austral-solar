"use client"
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";
import { branchesApi, Branch } from '@/lib/branches-api';
import { toast } from 'sonner';

export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadBranches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await branchesApi.getBranches({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        sortBy: 'createdAt:desc'
      });

      setBranches(response.docs);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading branches:', error);
      toast.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Our Branches</h1>
            <p className="mt-2 text-gray-600">Find an Austral Solar branch near you</p>
          </div>

          <div className="w-full">
            <Input
              type="text"
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {branches.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No branches found</p>
                  </div>
                ) : (
                  branches.map((branch) => (
                    <Card key={branch._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">{branch.name}</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                              <p className="text-gray-600">{branch.locationName}</p>
                              <p className="text-sm text-gray-500 mt-1">{branch.address}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <p className="text-gray-600">
                              <a href={`tel:${branch.phoneNumber}`} className="hover:text-blue-500">
                                {branch.phoneNumber}
                              </a>
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <p className="text-gray-600">
                              <a href={`mailto:${branch.email}`} className="hover:text-blue-500">
                                {branch.email}
                              </a>
                            </p>
                          </div>

                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

