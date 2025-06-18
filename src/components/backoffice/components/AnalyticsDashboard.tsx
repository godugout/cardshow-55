
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCards } from '@/hooks/useCards';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, CreditCard, Activity } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { cards, userCards, loading } = useCards();
  const { user } = useAuth();

  const totalCards = cards.length;
  const publicCards = cards.filter(card => card.is_public).length;
  const privateCards = totalCards - publicCards;
  const userCardCount = userCards.length;

  const rarityData = [
    { name: 'Common', value: cards.filter(c => c.rarity === 'common').length, color: '#9CA3AF' },
    { name: 'Uncommon', value: cards.filter(c => c.rarity === 'uncommon').length, color: '#22C55E' },
    { name: 'Rare', value: cards.filter(c => c.rarity === 'rare').length, color: '#3B82F6' },
    { name: 'Epic', value: cards.filter(c => c.rarity === 'epic').length, color: '#8B5CF6' },
    { name: 'Legendary', value: cards.filter(c => c.rarity === 'legendary').length, color: '#F59E0B' }
  ];

  const visibilityData = [
    { name: 'Public', count: publicCards },
    { name: 'Private', count: privateCards }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-crd-lightGray">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-crd-darkGray border-crd-mediumGray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-crd-lightGray">Total Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-crd-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalCards}</div>
            <p className="text-xs text-crd-lightGray">Cards in system</p>
          </CardContent>
        </Card>

        <Card className="bg-crd-darkGray border-crd-mediumGray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-crd-lightGray">Public Cards</CardTitle>
            <Users className="h-4 w-4 text-crd-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{publicCards}</div>
            <p className="text-xs text-crd-lightGray">Publicly visible</p>
          </CardContent>
        </Card>

        <Card className="bg-crd-darkGray border-crd-mediumGray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-crd-lightGray">Your Cards</CardTitle>
            <Activity className="h-4 w-4 text-crd-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userCardCount}</div>
            <p className="text-xs text-crd-lightGray">Cards you created</p>
          </CardContent>
        </Card>

        <Card className="bg-crd-darkGray border-crd-mediumGray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-crd-lightGray">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-crd-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+12%</div>
            <p className="text-xs text-crd-lightGray">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-crd-darkGray border-crd-mediumGray">
          <CardHeader>
            <CardTitle className="text-white">Card Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={visibilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#crd-lightGray" />
                <YAxis stroke="#crd-lightGray" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="count" fill="#00C851" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-crd-darkGray border-crd-mediumGray">
          <CardHeader>
            <CardTitle className="text-white">Rarity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={rarityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                >
                  {rarityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
