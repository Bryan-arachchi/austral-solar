"use client";
import { BranchCard } from "@/components/BranchCard";
import { Button } from "@/components/ui/button";
import { CATEGORY } from "@/types/enums";
import { Branch } from "@/types/branch";

const ITEMS_PER_PAGE = 8;

interface BranchGridProps {
  branches: Branch[];
  searchQuery: string;
  selectedCategories: Set<CATEGORY>;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
}

export function BranchGrid({
  branches,
  searchQuery,
  selectedCategories,
  currentPage,
  onPageChange,
  onSearch,
}: BranchGridProps) {
  // Filter branches based on search query and selected categories
  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.size === 0 ||
      (branch.category && selectedCategories.has(branch.category as CATEGORY));
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredBranches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBranches = filteredBranches.slice(startIndex, endIndex);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search branches..."
          className="w-full p-2 border rounded-lg"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentBranches.map((branch) => (
          <BranchCard key={branch._id} branch={branch} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
