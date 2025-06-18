
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCards } from '@/hooks/useCards';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CardManagement } from './components/CardManagement';
import { SystemHealth } from './components/SystemHealth';
import { 
  BarChart3, 
  Settings, 
  CreditCard, 
  Activity,
  ArrowLeft,
  Shield,
  Database
} from 'lucide-react';

type BackofficeSection = 'overview' | 'analytics' | 'cards' | 'system' | 'settings';

export const BackofficeLayout = () => {
  const [activeSection, setActiveSection] = useState<BackofficeSection>('overview');
  const { cards, userCards, loading, dataSource } = useCards();
  const { user } = useAuth();

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'cards', label: 'Card Management', icon: CreditCard },
    { id: 'system', label: 'System Health', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-crd-darkGray border-crd-mediumGray">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-crd-lightGray">Total Cards</CardTitle>
                  <CreditCard className="h-4 w-4 text-crd-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{cards.length}</div>
                  <p className="text-xs text-crd-lightGray">
                    {cards.filter(c => c.is_public).length} public, {cards.filter(c => !c.is_public).length} private
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-crd-darkGray border-crd-mediumGray">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-crd-lightGray">Your Cards</CardTitle>
                  <Shield className="h-4 w-4 text-crd-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{userCards.length}</div>
                  <p className="text-xs text-crd-lightGray">Cards you created</p>
                </CardContent>
              </Card>

              <Card className="bg-crd-darkGray border-crd-mediumGray">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-crd-lightGray">Data Source</CardTitle>
                  <Database className="h-4 w-4 text-crd-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white capitalize">{dataSource}</div>
                  <Badge 
                    className={`mt-1 ${
                      dataSource === 'database' ? 'bg-green-500' : 
                      dataSource === 'mixed' ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white`}
                  >
                    {dataSource === 'database' ? 'Synced' : 
                     dataSource === 'mixed' ? 'Partial Sync' : 'Local Only'}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-crd-darkGray border-crd-mediumGray">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-crd-lightGray">System Status</CardTitle>
                  <Activity className="h-4 w-4 text-crd-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">Healthy</div>
                  <p className="text-xs text-crd-lightGray">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-crd-darkGray border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveSection('analytics')}
                    className="bg-crd-green hover:bg-crd-green/90 text-black"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button
                    onClick={() => setActiveSection('cards')}
                    variant="outline"
                    className="border-crd-mediumGray text-crd-lightGray hover:text-white"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Cards
                  </Button>
                  <Button
                    onClick={() => setActiveSection('system')}
                    variant="outline"
                    className="border-crd-mediumGray text-crd-lightGray hover:text-white"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    System Health
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'analytics':
        return <AnalyticsDashboard />;

      case 'cards':
        return <CardManagement />;

      case 'system':
        return <SystemHealth />;

      case 'settings':
        return (
          <Card className="bg-crd-darkGray border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-white">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">User Account</h3>
                    <p className="text-sm text-crd-lightGray">
                      Logged in as: {user?.email}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-crd-lightGray">
                  Additional settings will be available in future updates.
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-crd-lightGray">Loading backoffice...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darkGray border-b border-crd-mediumGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-crd-lightGray hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-white">Backoffice</h1>
            </div>
            <Badge className="bg-crd-green text-black">
              Admin Panel
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <Card className="bg-crd-darkGray border-crd-mediumGray">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? 'default' : 'ghost'}
                        className={`w-full justify-start ${
                          activeSection === item.id 
                            ? 'bg-crd-green text-black' 
                            : 'text-crd-lightGray hover:text-white hover:bg-crd-mediumGray'
                        }`}
                        onClick={() => setActiveSection(item.id as BackofficeSection)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
