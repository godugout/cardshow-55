
export interface MarketplaceListing {
  id: string;
  sellerId: string;
  cardId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: 'mint' | 'near_mint' | 'excellent' | 'good' | 'fair' | 'poor';
  images: string[];
  listingType: 'fixed_price' | 'auction' | 'best_offer';
  auctionEndDate?: string;
  currentBid?: number;
  bidCount?: number;
  shippingOptions: ShippingOption[];
  status: 'active' | 'sold' | 'ended' | 'cancelled';
  views: number;
  watcherCount: number;
  createdAt: string;
  updatedAt: string;
  seller: SellerInfo;
  card: CardInfo;
  featured: boolean;
  authenticityVerified: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  trackingIncluded: boolean;
  insuranceIncluded: boolean;
}

export interface SellerInfo {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  sellerLevel: 'new' | 'established' | 'power' | 'top_rated';
  responseTime: string;
  shippingAccuracy: number;
  itemAccuracy: number;
  joinedDate: string;
}

export interface CardInfo {
  id: string;
  name: string;
  set: string;
  rarity: string;
  year: number;
  sport?: string;
  player?: string;
  cardNumber?: string;
  grading?: {
    company: string;
    grade: string;
    serialNumber: string;
  };
}

export interface MarketplaceOrder {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  paymentIntentId: string;
  amount: number;
  platformFee: number;
  sellerAmount: number;
  currency: string;
  shippingAddress: Address;
  shippingOption: ShippingOption;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'disputed';
  trackingNumber?: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimeline[];
  buyer: BuyerInfo;
  seller: SellerInfo;
  listing: MarketplaceListing;
}

export interface OrderTimeline {
  id: string;
  status: string;
  message: string;
  timestamp: string;
  actor: 'buyer' | 'seller' | 'system';
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface BuyerInfo {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  walletType?: 'apple_pay' | 'google_pay' | 'samsung_pay';
}

export interface SellerAccount {
  id: string;
  userId: string;
  stripeAccountId: string;
  onboardingComplete: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  requirements: string[];
  verificationStatus: 'pending' | 'verified' | 'restricted';
  businessProfile?: {
    name: string;
    supportEmail: string;
    supportPhone: string;
    supportUrl: string;
  };
  settings: {
    payoutSchedule: 'daily' | 'weekly' | 'monthly';
    automaticPayouts: boolean;
    minimumPayoutAmount: number;
  };
}

export interface MarketplaceTransaction {
  id: string;
  orderId: string;
  type: 'payment' | 'payout' | 'refund' | 'fee';
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  stripeTransactionId: string;
  description: string;
  createdAt: string;
}

export interface MarketplaceFilters {
  category?: string[];
  condition?: string[];
  priceMin?: number;
  priceMax?: number;
  seller?: string[];
  location?: string;
  shippingOptions?: string[];
  listingType?: string[];
  authenticity?: 'verified_only' | 'all';
  sortBy?: 'price_low' | 'price_high' | 'newest' | 'ending_soon' | 'popular' | 'distance';
  searchQuery?: string;
}

export interface MarketplaceStats {
  totalListings: number;
  activeListings: number;
  totalSales: number;
  totalVolume: number;
  averagePrice: number;
  topCategories: Array<{
    category: string;
    count: number;
    volume: number;
  }>;
  priceRanges: Array<{
    range: string;
    count: number;
  }>;
}
