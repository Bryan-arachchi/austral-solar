// app/orders/page.tsx
"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ordersApi, Order } from '@/lib/orders-api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import RouteGuard from '@/components/RouteGuard';

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadOrders();
  }, [currentPage]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getOrders({
        page: currentPage,
        limit: 5
      });

      setOrders(response.docs);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="mt-2 text-gray-600">Track and manage your orders</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                orders.map((order) => (
                  <Card key={order._id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order._id.slice(-8)}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {format(new Date(order.createdAt), 'PPP')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Products</h4>
                          <div className="space-y-2">
                            {order.products.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center text-sm"
                              >
                                <div>
                                  <span className="font-medium">{item.product.name}</span>
                                  <span className="text-gray-500"> × {item.quantity}</span>
                                </div>
                                <span>LKR{item.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-500">Branch</p>
                            <p className="font-medium">{order.branch.name}</p>
                            <p className="text-sm text-gray-500">{order.branch.locationName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-xl font-bold">LKR{order.totalPrice.toFixed(2)}</p>
                            <Badge variant={order.isPaid ? "success" : "error"}>  
                              {order.isPaid ? 'Paid' : 'Unpaid'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

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
          )}
        </div>
      </div>
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
