
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatorSubscriptionTiers } from '@/components/creator/monetization/CreatorSubscriptionTiers';
import { CreatorAnalyticsDashboard } from '@/components/creator/analytics/CreatorAnalyticsDashboard';
import { CreatorCommunityHub } from '@/components/creator/community/CreatorCommunityHub';
import { CreatorFundProgram } from '@/components/creator/monetization/CreatorFundProgram';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { Navigate } from 'react-router-dom';

export const CreatorEconomyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Creator Economy Dashboard</h1>
          <p className="text-gray-400">
            Manage your monetization, analytics, and community engagement
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700 grid w-full grid-cols-4">
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
            <TabsTrigger value="monetization" className="text-white">Monetization</TabsTrigger>
            <TabsTrigger value="community" className="text-white">Community</TabsTrigger>
            <TabsTrigger value="fund" className="text-white">Creator Fund</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <CreatorAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="monetization">
            <CreatorSubscriptionTiers />
          </TabsContent>

          <TabsContent value="community">
            <CreatorCommunityHub />
          </TabsContent>

          <TabsContent value="fund">
            <CreatorFundProgram />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
