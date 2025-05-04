'use client';

import { useCallback, useEffect, useState } from 'react';
import { Product, ProductCategory, productsApi } from '@/lib/products-api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RouteGuard from '@/components/RouteGuard';

const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Panels',
  'Inverters',
  'Batteries',
  'Mounting Systems',
  'Accessories',
  'LED'
];

type CategoryFilter = ProductCategory | 'all';

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const loadProducts = useCallback(async () => {
    console.log('Loading products...');
    try {
      setLoading(true);
      setError(null);
      const response = await productsApi.getProducts({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        sortBy: 'createdAt:desc'
      });
      console.log('Products response:', response);
      
      if (response) {
        console.log('Setting products:', response.docs);
        setProducts(response.docs);
        setTotalPages(response.totalPages || 1);
      } else {
        console.error('Invalid response structure:', response);
        setError('Invalid response from server');
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error: unknown) {
      console.error('Error loading products:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load products';
      setError(errorMessage);
      toast.error(errorMessage);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    console.log('Current products:', products);
  }, [products]);

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        await productsApi.deleteProduct(selectedProduct._id);
        toast.success('Product deleted successfully');
        loadProducts();
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
        toast.error(errorMessage);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNewProduct: boolean = false) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        setIsUploading(true);
        const file = files[0];
        const imageUrl = await productsApi.uploadImage(file);
        
        if (isNewProduct) {
          setNewProduct(prev => ({ ...prev, images: [imageUrl] }));
        } else if (editingProduct) {
          setEditingProduct({
            ...editingProduct,
            images: [imageUrl]
          });
        }
        toast.success('Image uploaded successfully');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
        toast.error(errorMessage);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (editingProduct) {
      try {
        await productsApi.updateProduct(editingProduct._id, editingProduct);
        toast.success('Product updated successfully');
        loadProducts();
        setIsEditDialogOpen(false);
        setEditingProduct(null);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
        toast.error(errorMessage);
      }
    }
  };

  const handleCreateProduct = async () => {
    try {
      await productsApi.createProduct({
        name: newProduct.name || '',
        description: newProduct.description || '',
        price: newProduct.price || 0,
        images: newProduct.images || [],
        category: newProduct.category as ProductCategory || 'Panels',
        wattage: newProduct.wattage || 0,
        voltage: newProduct.voltage,
        dimensions: newProduct.dimensions,
        weight: newProduct.weight,
        manufacturer: newProduct.manufacturer,
        warranty: newProduct.warranty,
        stock: newProduct.stock,
        isAvailable: newProduct.isAvailable ?? true
      });
      toast.success('Product created successfully');
      loadProducts();
      setIsCreateDialogOpen(false);
      setNewProduct({});
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={(value: CategoryFilter) => {
                  setSelectedCategory(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
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
                {products.length === 0 ? (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    No products found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>LKR{product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(product)}
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
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={editingProduct?.name || ''}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select
                value={editingProduct?.category}
                onValueChange={(value) => setEditingProduct(prev => prev ? { ...prev, category: value as ProductCategory } : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input
                id="price"
                type="number"
                value={editingProduct?.price || 0}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wattage" className="text-right">Wattage</Label>
              <Input
                id="wattage"
                type="number"
                value={editingProduct?.wattage || 0}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, wattage: parseFloat(e.target.value) } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={editingProduct?.stock || 0}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, stock: parseInt(e.target.value) } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={editingProduct?.description || ''}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-name" className="text-right">Name</Label>
              <Input
                id="new-name"
                value={newProduct.name || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-category" className="text-right">Category</Label>
              <Select
                value={newProduct.category}
                onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value as ProductCategory }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-price" className="text-right">Price</Label>
              <Input
                id="new-price"
                type="number"
                value={newProduct.price || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-wattage" className="text-right">Wattage</Label>
              <Input
                id="new-wattage"
                type="number"
                value={newProduct.wattage || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, wattage: parseFloat(e.target.value) }))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-stock" className="text-right">Stock</Label>
              <Input
                id="new-stock"
                type="number"
                value={newProduct.stock || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-image" className="text-right">Image</Label>
              <Input
                id="new-image"
                type="file"
                onChange={(e) => handleImageUpload(e, true)}
                accept="image/*"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-description" className="text-right">Description</Label>
              <Textarea
                id="new-description"
                value={newProduct.description || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProduct} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Create Product'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {selectedProduct?.name}?</p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <RouteGuard>
      <ProductsContent />
    </RouteGuard>
  );
}