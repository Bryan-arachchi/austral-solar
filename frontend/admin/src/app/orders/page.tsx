'use client';

import { useCallback, useEffect, useState } from 'react';
import { Order, ordersApi } from '@/lib/orders-api';
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
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Pencil, Trash2, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RouteGuard from '@/components/RouteGuard';

const ORDER_STATUSES = ['Pending', 'Paid', 'Processing', 'Completed', 'Cancelled'] as const;

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersApi.getOrders({
        page: currentPage,
        limit: 10,
        sortBy: 'createdAt:desc'
      });
      
      if (response) {
        setOrders(response.docs);
        setTotalPages(response.totalPages || 1);
      } else {
        setError('Invalid response from server');
        setOrders([]);
        setTotalPages(1);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load orders';
      setError(errorMessage);
      toast.error(errorMessage);
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleEdit = (order: Order) => {
    setEditingOrder({ ...order });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedOrder) {
      try {
        await ordersApi.deleteOrder(selectedOrder._id);
        toast.success('Order deleted successfully');
        loadOrders();
        setIsDeleteDialogOpen(false);
        setSelectedOrder(null);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete order';
        toast.error(errorMessage);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (editingOrder) {
      try {
        await ordersApi.updateOrder(editingOrder._id, {
          notes: editingOrder.notes,
          status: editingOrder.status,
          isPaid: editingOrder.isPaid
        });
        toast.success('Order updated successfully');
        loadOrders();
        setIsEditDialogOpen(false);
        setEditingOrder(null);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update order';
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8"
                />
              </div>
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
                {orders.length === 0 ? (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    No orders found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">{order._id}</TableCell>
                          <TableCell>
                            {order.client.firstName} {order.client.lastName}
                            <br />
                            <span className="text-sm text-gray-500">{order.client.email}</span>
                          </TableCell>
                          <TableCell>
                            {order.products.map((item, index) => (
                              <div key={index} className="mb-1">
                                {item.product.name} x {item.quantity}
                                <br />
                                <span className="text-sm text-gray-500">
                                  LKR {item.price.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>LKR {order.totalPrice.toFixed(2)}</TableCell>
                          <TableCell>{order.branch.name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>{order.notes || '-'}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(order)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(order)}
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Update order information. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select
                value={editingOrder?.status}
                onValueChange={(value) => setEditingOrder(prev => prev ? { ...prev, status: value as Order['status'] } : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPaid" className="text-right">Payment Status</Label>
              <Select
                value={editingOrder?.isPaid ? 'true' : 'false'}
                onValueChange={(value) => setEditingOrder(prev => prev ? { ...prev, isPaid: value === 'true' } : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Unpaid</SelectItem>
                  <SelectItem value="true">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Notes</Label>
              <Input
                id="notes"
                value={editingOrder?.notes || ''}
                onChange={(e) => setEditingOrder(prev => prev ? { ...prev, notes: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete this order?
            </DialogDescription>
          </DialogHeader>
          <p>Are you sure you want to delete order {selectedOrder?._id}?</p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <RouteGuard>
      <OrdersContent />
    </RouteGuard>
  );
}