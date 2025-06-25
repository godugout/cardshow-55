
import React from 'react';
import { Users, Shield, DollarSign, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ActivityFeed } from './ActivityFeed';
import { QuickActions } from './QuickActions';

export const AdminOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Monitor platform performance and manage operations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value="12,547"
          change="+8.2%"
          changeType="positive"
          icon={Users}
        />
        <MetricCard
          title="Pending Reviews"
          value="23"
          change="-15%"
          changeType="positive"
          icon={Shield}
        />
        <MetricCard
          title="Revenue (30d)"
          value="$45,230"
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
        />
        <MetricCard
          title="Active Issues"
          value="7"
          change="+2"
          changeType="negative"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        
        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};
