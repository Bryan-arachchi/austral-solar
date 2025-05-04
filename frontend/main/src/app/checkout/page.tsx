/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ordersApi } from '@/lib/orders-api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import RouteGuard from '@/components/RouteGuard';

const CheckoutContent = () => {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        products: items.map(item => ({
          product: item._id,
          quantity: item.quantity
        })),
        notes: "Order from web",
        paymentMethod: "Card"
      };

      const response = await ordersApi.createOrder(orderData);
      console.log('Checkout Response:', response); // Debug log

      if (!response?.paymentData) {
        console.error('Invalid response:', response);
        throw new Error('Payment data not received from server');
      }

      // Update return_url to point to your success page
      if (response.paymentData) {
        response.paymentData.return_url = `${window.location.origin}/payment-success`;
      }

      // Create PayHere form
      const paymentForm = document.createElement('form');
      paymentForm.method = 'POST';
      paymentForm.action = 'https://sandbox.payhere.lk/pay/checkout';

      // Add payment data fields
      Object.entries(response.paymentData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const hiddenField = document.createElement('input');
          hiddenField.type = 'hidden';
          hiddenField.name = key;
          hiddenField.value = Array.isArray(value) ? value.join(',') : value.toString();
          paymentForm.appendChild(hiddenField);
        }
      });

      // Submit form and clear cart
      document.body.appendChild(paymentForm);
      paymentForm.submit();
      clearCart();
      toast.success('Order created successfully');

    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Your cart is empty</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold">Order Summary</h3>
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>LKR{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>LKR{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <RouteGuard>
      <CheckoutContent />
    </RouteGuard>
  );
} 