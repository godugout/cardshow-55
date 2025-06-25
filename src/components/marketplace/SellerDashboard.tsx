
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Eye, 
  Star, 
  AlertCircle,
  Settings,
  Plus,
  BarChart3
} from 'lucide-react';
import { useMarketplace } from './MarketplaceProvider';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/services/stripe';
import type { MarketplaceListing, MarketplaceOrder, MarketplaceStats } from '@/types/marketplace';

export const SellerDashboard: React.FC = () => {
  const { sellerAccount, createSellerAccount } = useMarketplace();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [stats, setStats] = useState<Partial<MarketplaceStats>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sellerAccount?.onboardingComplete) {
      fetchSellerData();
    }
  }, [sellerAccount]);

  const fetchSellerData = async () => {
    setIsLoading(true);
    try {
      const [listingsResponse, ordersResponse, statsResponse] = await Promise.all([
        supabase.functions.invoke('get-seller-listings'),
        supabase.functions.invoke('get-seller-orders'),
        supabase.functions.invoke('get-seller-stats')
      ]);

      if (listingsResponse.data) setListings(listingsResponse.data.listings || []);
      if (ordersResponse.data) setOrders(ordersResponse.data.orders || []);
      if (statsResponse.data) setStats(statsResponse.data.stats || {});
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingSeller = async () => {
    const accountLink = await createSellerAccount();
    if (accountLink) {
      window.location.href = accountLink;
    }
  };

  if (!sellerAccount?.onboardingComplete) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Start Selling on Cardshow</CardTitle>
            <p className="text-muted-foreground">
              Complete your seller setup to start listing cards and earning money
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Setup Account</h3>
                <p className="text-sm text-muted-foreground">
                  Verify your identity and banking details
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">List Items</h3>
                <p className="text-sm text-muted-foreground">
                  Create listings for your cards
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Earn Money</h3>
                <p className="text-sm text-muted-foreground">
                  Get paid when your items sell
                </p>
              </div>
            </div>
            <div className="text-center">
              <Button onClick={handleOnboardingSeller} size="lg">
                Complete Seller Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your listings and track performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{formatCurrency((stats.totalVolume || 0) * 100)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                <p className="text-2xl font-bold">{stats.activeListings || 0}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">
                  {listings.reduce((sum, listing) => sum + listing.views, 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Price</p>
                <p className="text-2xl font-bold">{formatCurrency((stats.averagePrice || 0) * 100)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {listings.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by creating your first listing
                  </p>
                  <Button>Create Listing</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <div key={listing.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {listing.condition} • {listing.views} views • {listing.watcherCount} watchers
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(listing.price * 100)}</p>
                        <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                          {listing.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Orders will appear here when customers make purchases
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.buyer.displayName} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(order.sellerAmount)}</p>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'shipped' ? 'secondary' :
                          order.status === 'processing' ? 'outline' : 'destructive'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed performance insights and sales analytics will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Seller Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payout Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Automatic Payouts</p>
                        <p className="text-sm text-muted-foreground">
                          Receive payouts automatically on schedule
                        </p>
                      </div>
                      <Badge variant={sellerAccount.settings.automaticPayouts ? 'default' : 'secondary'}>
                        {sellerAccount.settings.automaticPayouts ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Payout Schedule</p>
                        <p className="text-sm text-muted-foreground">
                          How often you receive payouts
                        </p>
                      </div>
                      <Badge variant="outline">
                        {sellerAccount.settings.payoutSchedule}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
