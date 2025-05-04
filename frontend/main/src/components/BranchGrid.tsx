"use client"
import { useState } from 'react';
import { BranchCard } from '@/components/BranchCard';
import { Button } from "@/components/ui/button";
import { CATEGORY } from '@/types/enums';

const ITEMS_PER_PAGE = 8;

type Branch = {
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
  category: CATEGORY;
};

export function BranchGrid({ branches }: { branches: Branch[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<CATEGORY>>(new Set());

  const toggleCategory = (category: CATEGORY) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(branch.category);
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBranches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBranches = filteredBranches.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search branches..."
          className="w-full p-2 border rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentBranches.map((branch) => (
          <BranchCard key={branch._id} branch={branch} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
  );
}
