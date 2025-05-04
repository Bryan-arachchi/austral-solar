/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Product } from '@/lib/products-api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Loader2 } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const fallbackImage = '/product-placeholder.jpg';

  const handleAddToCart = async (product: Product) => {
    setLoadingItems(prev => new Set(prev).add(product._id));
    try {
      await addToCart(product);
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product._id} className="overflow-hidden">
          <div className="relative aspect-square">
            <img
              src={product.images[0] || fallbackImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = fallbackImage;
              }}
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">LKR{product.price.toFixed(2)}</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={loadingItems.has(product._id)}
                >
                  {loadingItems.has(product._id) ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  {loadingItems.has(product._id) ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}