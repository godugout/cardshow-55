
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, BarChart3, Users, Settings, Database } from 'lucide-react';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CardManagement } from './components/CardManagement';
import { SystemHealth } from './components/SystemHealth';
import { CollectionManager } from './components/CollectionManager';

export const BackofficeLayout = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const handleClose = () => {
    window.location.reload();
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'cards', label: 'Cards', icon: Database },
    { id: 'collections', label: 'Collections', icon: Users },
    { id: 'system', label: 'System', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'cards':
        return <CardManagement />;
      case 'collections':
        return <CollectionManager />;
      case 'system':
        return <SystemHealth />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-dark border-b border-crd-mediumGray">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-crd-white">Admin Backoffice</h1>
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    className={`flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-crd-green text-black hover:bg-crd-green/90'
                        : 'text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          <Button
            onClick={handleClose}
            variant="ghost"
            className="text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};
