"use client"
import { useState, useEffect, useCallback } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { productsApi, Product } from '@/lib/products-api';
import { CATEGORY } from '@/types/enums';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CATEGORY | ''>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsApi.getProducts({
        page: currentPage,
        limit: 8,
        search: searchQuery || undefined,
        category: selectedCategory || undefined
      });

      console.log('API Response:', response); // Debug log
      setProducts(response.docs);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCategoryChange = (category: CATEGORY) => {
    setSelectedCategory(prev => prev === category ? '' : category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  return (
    <section className="py-16 px-20">
      <h2 className="text-3xl font-bold mb-6">Our Products</h2>

      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border rounded-lg"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
        />

        <div className="flex flex-wrap gap-4">
          {Object.values(CATEGORY).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg border ${
                selectedCategory === category 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
          
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded ${
                    currentPage === page ? 'bg-blue-500 text-white' : ''
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
