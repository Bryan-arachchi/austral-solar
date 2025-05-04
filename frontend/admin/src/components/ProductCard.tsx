// components/ProductCard.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={product.images[0]}
            alt={product.name}
            className="object-cover rounded-t-lg"
            fill
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <Badge variant={product.isAvailable ? "default" : "destructive"}>
            {product.isAvailable ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <Badge variant="secondary" className="mb-2">
          {product.category}
        </Badge>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <p className="text-lg font-bold mt-2">LKR{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={!product.isAvailable}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
