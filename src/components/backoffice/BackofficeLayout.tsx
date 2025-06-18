
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Upload, 
  Users, 
  Image, 
  FileText, 
  Palette,
  Database,
  ArrowLeft
} from 'lucide-react';
import { BulkCardUploader } from '@/components/catalog/BulkCardUploader';

type BackofficeSection = 'overview' | 'bulk-upload' | 'media' | 'users' | 'collections' | 'content' | 'branding';

interface BackofficeLayoutProps {
  onBack: () => void;
}

export const BackofficeLayout = ({ onBack }: BackofficeLayoutProps) => {
  const [activeSection, setActiveSection] = useState<BackofficeSection>('overview');

  const sections = [
    { id: 'overview' as const, label: 'Overview', icon: Database },
    { id: 'bulk-upload' as const, label: 'Bulk Upload', icon: Upload },
    { id: 'media' as const, label: 'Media Manager', icon: Image },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'collections' as const, label: 'Collections', icon: FileText },
    { id: 'branding' as const, label: 'Branding', icon: Palette },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'bulk-upload':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Bulk Card Upload</h2>
              <p className="text-crd-lightGray">Upload and process multiple cards at once</p>
            </div>
            <BulkCardUploader />
          </div>
        );
      case 'media':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Media Manager</h2>
              <p className="text-crd-lightGray">Manage uploaded images and media assets</p>
            </div>
            <div className="bg-crd-darkGray rounded-lg p-8 border border-crd-mediumGray/30 text-center">
              <Image className="w-16 h-16 mx-auto mb-4 text-crd-lightGray" />
              <p className="text-crd-lightGray">Media management coming soon</p>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
              <p className="text-crd-lightGray">Manage user accounts and permissions</p>
            </div>
            <div className="bg-crd-darkGray rounded-lg p-8 border border-crd-mediumGray/30 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-crd-lightGray" />
              <p className="text-crd-lightGray">User management coming soon</p>
            </div>
          </div>
        );
      case 'collections':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Collections Manager</h2>
              <p className="text-crd-lightGray">Organize and manage card collections</p>
            </div>
            <div className="bg-crd-darkGray rounded-lg p-8 border border-crd-mediumGray/30 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-crd-lightGray" />
              <p className="text-crd-lightGray">Collections management coming soon</p>
            </div>
          </div>
        );
      case 'branding':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Brand Customization</h2>
              <p className="text-crd-lightGray">Customize branding and visual identity</p>
            </div>
            <div className="bg-crd-darkGray rounded-lg p-8 border border-crd-mediumGray/30 text-center">
              <Palette className="w-16 h-16 mx-auto mb-4 text-crd-lightGray" />
              <p className="text-crd-lightGray">Brand customization coming soon</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">CRD Backoffice</h2>
              <p className="text-crd-lightGray">Manage your cards, media, users, and branding</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.slice(1).map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="bg-crd-darkGray rounded-lg p-6 border border-crd-mediumGray/30 hover:border-crd-green/50 transition-colors text-left group"
                  >
                    <Icon className="w-8 h-8 text-crd-green mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-white font-semibold mb-2">{section.label}</h3>
                    <p className="text-crd-lightGray text-sm">
                      {section.id === 'bulk-upload' && 'Upload multiple cards at once'}
                      {section.id === 'media' && 'Manage images and assets'}
                      {section.id === 'users' && 'User accounts and permissions'}
                      {section.id === 'collections' && 'Organize card collections'}
                      {section.id === 'branding' && 'Customize visual identity'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darkest border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-crd-lightGray hover:text-white hover:bg-crd-mediumGray"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-crd-green" />
              <h1 className="text-xl font-semibold text-white">CRD Backoffice</h1>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-crd-mediumGray/20 rounded-lg p-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-crd-green text-black'
                      : 'text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};
