
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export const PLATFORM_FEE_PERCENTAGE = 5; // 5% platform fee

export const calculateFees = (amount: number) => {
  const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENTAGE / 100));
  const stripeFee = Math.round(amount * 0.029 + 30); // Stripe's standard fee
  const sellerAmount = amount - platformFee - stripeFee;
  
  return {
    total: amount,
    platformFee,
    stripeFee,
    sellerAmount,
    platformFeePercentage: PLATFORM_FEE_PERCENTAGE
  };
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2
  }).format(amount / 100);
};

export const formatPrice = (price: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2
  }).format(price);
};
