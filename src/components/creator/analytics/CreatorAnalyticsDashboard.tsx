import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  Download, 
  Star,
  Target,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    trend: Array<{ date: string; amount: number }>;
  };
  engagement: {
    views: number;
    downloads: number;
    favorites: number;
    conversionRate: number;
  };
  audience: {
    followers: number;
    subscribers: number;
    demographics: Array<{ age: string; percentage: number }>;
    geography: Array<{ country: string; percentage: number }>;
  };
  performance: {
    topCards: Array<{ name: string; revenue: number; views: number }>;
    categories: Array<{ name: string; value: number; color: string }>;
  };
}

export const CreatorAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenue: {
      total: 2847.50,
      change: 12.5,
      trend: [
        { date: '2024-01', amount: 1200 },
        { date: '2024-02', amount: 1800 },
        { date: '2024-03', amount: 2400 },
        { date: '2024-04', amount: 2847 }
      ]
    },
    engagement: {
      views: 45620,
      downloads: 1240,
      favorites: 3850,
      conversionRate: 2.7
    },
    audience: {
      followers: 12480,
      subscribers: 340,
      demographics: [
        { age: '18-24', percentage: 35 },
        { age: '25-34', percentage: 42 },
        { age: '35-44', percentage: 18 },
        { age: '45+', percentage: 5 }
      ],
      geography: [
        { country: 'United States', percentage: 45 },
        { country: 'United Kingdom', percentage: 12 },
        { country: 'Canada', percentage: 8 },
        { country: 'Germany', percentage: 7 },
        { country: 'Others', percentage: 28 }
      ]
    },
    performance: {
      topCards: [
        { name: 'Mystic Dragon', revenue: 485.20, views: 8450 },
        { name: 'Space Warrior', revenue: 342.80, views: 6240 },
        { name: 'Forest Guardian', revenue: 298.50, views: 5180 }
      ],
      categories: [
        { name: 'Fantasy', value: 45, color: '#8B5CF6' },
        { name: 'Sci-Fi', value: 30, color: '#06B6D4' },
        { name: 'Nature', value: 15, color: '#10B981' },
        { name: 'Abstract', value: 10, color: '#F59E0B' }
      ]
    }
  });

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Creator Analytics</h2>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-gray-700 border-gray-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  ${analytics.revenue.total.toLocaleString()}
                </p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{analytics.revenue.change}%
                </p>
              </div>
              <div className="p-3 bg-green-600/20 rounded-full">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.engagement.views.toLocaleString()}
                </p>
                <p className="text-blue-400 text-sm flex items-center mt-1">
                  <Eye className="w-3 h-3 mr-1" />
                  Views this month
                </p>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-full">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Followers</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.audience.followers.toLocaleString()}
                </p>
                <p className="text-purple-400 text-sm flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  {analytics.audience.subscribers} subscribers
                </p>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-full">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.engagement.conversionRate}%
                </p>
                <p className="text-yellow-400 text-sm flex items-center mt-1">
                  <Target className="w-3 h-3 mr-1" />
                  View to purchase
                </p>
              </div>
              <div className="p-3 bg-yellow-600/20 rounded-full">
                <Target className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="revenue" className="text-white">Revenue</TabsTrigger>
          <TabsTrigger value="audience" className="text-white">Audience</TabsTrigger>
          <TabsTrigger value="performance" className="text-white">Performance</TabsTrigger>
          <TabsTrigger value="insights" className="text-white">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.revenue.trend}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '6px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={analytics.audience.demographics}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                      label={({ age, percentage }) => `${age}: ${percentage}%`}
                    >
                      {analytics.audience.demographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.audience.geography.map((country, index) => (
                    <div key={country.country} className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-gray-300">{country.country}</span>
                        <span className="text-white font-semibold">{country.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance.topCards.map((card, index) => (
                    <div key={card.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{card.name}</p>
                          <p className="text-gray-400 text-sm">{card.views.toLocaleString()} views</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">${card.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.performance.categories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="value" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2">Growth Opportunity</h4>
                  <p className="text-gray-300">
                    Your fantasy-themed cards are performing 34% better than average. 
                    Consider creating more content in this category to maximize revenue.
                  </p>
                </div>
                <div className="p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                  <h4 className="text-yellow-400 font-semibold mb-2">Timing Insight</h4>
                  <p className="text-gray-300">
                    Your audience is most active on weekends between 2-6 PM EST. 
                    Schedule your releases during this time for maximum visibility.
                  </p>
                </div>
                <div className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
                  <h4 className="text-green-400 font-semibold mb-2">Price Optimization</h4>
                  <p className="text-gray-300">
                    Based on market analysis, you could increase prices by 15-20% 
                    without significantly impacting sales volume.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
