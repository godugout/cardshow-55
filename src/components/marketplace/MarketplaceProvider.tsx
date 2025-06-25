
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/services/stripe';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import type { PaymentMethod, SellerAccount } from '@/types/marketplace';

interface MarketplaceContextType {
  paymentMethods: PaymentMethod[];
  sellerAccount: SellerAccount | null;
  isLoadingPayments: boolean;
  isLoadingSeller: boolean;
  refreshPaymentMethods: () => Promise<void>;
  refreshSellerAccount: () => Promise<void>;
  createSellerAccount: () => Promise<string | null>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

interface MarketplaceProviderProps {
  children: ReactNode;
}

export const MarketplaceProvider: React.FC<MarketplaceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [sellerAccount, setSellerAccount] = useState<SellerAccount | null>(null);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isLoadingSeller, setIsLoadingSeller] = useState(false);

  const refreshPaymentMethods = async () => {
    if (!user) return;
    
    setIsLoadingPayments(true);
    try {
      const { data } = await supabase.functions.invoke('get-payment-methods');
      if (data?.paymentMethods) {
        setPaymentMethods(data.paymentMethods);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const refreshSellerAccount = async () => {
    if (!user) return;
    
    setIsLoadingSeller(true);
    try {
      const { data } = await supabase.functions.invoke('get-seller-account');
      if (data?.account) {
        setSellerAccount(data.account);
      }
    } catch (error) {
      console.error('Error fetching seller account:', error);
    } finally {
      setIsLoadingSeller(false);
    }
  };

  const createSellerAccount = async () => {
    if (!user) return null;
    
    try {
      const { data } = await supabase.functions.invoke('create-seller-account');
      if (data?.accountLink) {
        return data.accountLink;
      }
    } catch (error) {
      console.error('Error creating seller account:', error);
    }
    return null;
  };

  useEffect(() => {
    if (user) {
      refreshPaymentMethods();
      refreshSellerAccount();
    }
  }, [user]);

  const value: MarketplaceContextType = {
    paymentMethods,
    sellerAccount,
    isLoadingPayments,
    isLoadingSeller,
    refreshPaymentMethods,
    refreshSellerAccount,
    createSellerAccount
  };

  return (
    <MarketplaceContext.Provider value={value}>
      <Elements stripe={getStripe()}>
        {children}
      </Elements>
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within MarketplaceProvider');
  }
  return context;
};
