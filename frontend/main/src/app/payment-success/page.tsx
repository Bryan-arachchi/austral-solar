"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [hasCleared, setHasCleared] = useState(false);

  useEffect(() => {
    // Check if this is a redirect from PayHere
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    
    if (!orderId) {
      // If no order_id, redirect to home
      router.replace('/');
      return;
    }

    // Clear cart only once
    if (!hasCleared) {
      clearCart();
      setHasCleared(true);
    }
  }, [router, clearCart, hasCleared]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Payment Successful!
          </h1>
          <p className="text-gray-500">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="pt-4">
            <Button 
              onClick={() => router.push('/orders')} 
              className="w-full"
            >
              View Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 