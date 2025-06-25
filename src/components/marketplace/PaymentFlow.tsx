
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, CreditCard, Smartphone, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, calculateFees } from '@/services/stripe';
import type { MarketplaceListing, Address, ShippingOption } from '@/types/marketplace';

interface PaymentFlowProps {
  listing: MarketplaceListing;
  shippingAddress: Address;
  shippingOption: ShippingOption;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
}

export const PaymentFlow: React.FC<PaymentFlowProps> = ({
  listing,
  shippingAddress,
  shippingOption,
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');

  const subtotal = listing.price * 100; // Convert to cents
  const shipping = shippingOption.price * 100;
  const total = subtotal + shipping;
  const fees = calculateFees(total);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      // Create payment intent
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          listingId: listing.id,
          shippingAddress,
          shippingOptionId: shippingOption.id,
          paymentMethod: paymentMethod
        }
      });

      if (paymentError) throw paymentError;

      const { clientSecret, orderId } = paymentData;

      if (paymentMethod === 'card') {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error('Card element not found');

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: shippingAddress.name,
              address: {
                line1: shippingAddress.line1,
                line2: shippingAddress.line2,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postal_code: shippingAddress.postalCode,
                country: shippingAddress.country,
              }
            }
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        if (paymentIntent?.status === 'succeeded') {
          toast({
            title: "Payment Successful",
            description: "Your order has been placed successfully!"
          });
          onSuccess(orderId);
        }
      } else {
        // Handle digital wallet payments
        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/order-confirmation?order_id=${orderId}`
          }
        });

        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Secure Checkout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Item: {listing.title}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping: {shippingOption.name}</span>
            <span>{formatCurrency(shipping)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          
          {/* Fee Breakdown */}
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Platform fee ({fees.platformFeePercentage}%)</span>
              <span>{formatCurrency(fees.platformFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Seller receives</span>
              <span>{formatCurrency(fees.sellerAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('card')}
              className="h-12 flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Card
            </Button>
            <Button
              variant={paymentMethod === 'apple_pay' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('apple_pay')}
              className="h-12 flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              Apple Pay
            </Button>
            <Button
              variant={paymentMethod === 'google_pay' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('google_pay')}
              className="h-12 flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              Google Pay
            </Button>
          </div>

          {paymentMethod === 'card' && (
            <div className="border rounded-lg p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Buyer Protection</span>
            </div>
            <Badge variant="secondary">PCI Compliant</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handlePayment} 
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Processing...' : `Pay ${formatCurrency(total)}`}
        </Button>
      </div>
    </div>
  );
};
