
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Slider } from '@/components/ui/slider';
import { 
  Palette, Type, Layout, Layers, Eye, Download, 
  Undo, Redo, Settings, Magic, Zap
} from 'lucide-react';
import type { DetectedRegion } from '@/types/crdmkr';

interface LiveTemplateEditorProps {
  imageUrl: string;
  detectedRegions: DetectedRegion[];
  onTemplateGenerated: (templateData: any) => void;
}

export const LiveTemplateEditor: React.FC<LiveTemplateEditorProps> = ({
  imageUrl,
  detectedRegions,
  onTemplateGenerated
}) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'colors' | 'typography' | 'effects'>('layout');
  const [templateConfig, setTemplateConfig] = useState({
    layout: {
      padding: 20,
      borderRadius: 8,
      aspectRatio: '5:7'
    },
    colors: {
      primary: '#000000',
      secondary: '#ffffff',
      accent: '#ff0000',
      background: '#f0f0f0'
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.4
    },
    effects: {
      shadow: true,
      glow: false,
      gradient: false,
      opacity: 100
    }
  });

  const [previewMode, setPreviewMode] = useState<'split' | 'before' | 'after'>('split');

  const handleConfigUpdate = (section: string, key: string, value: any) => {
    setTemplateConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const generateTemplate = () => {
    const templateData = {
      regions: detectedRegions,
      config: templateConfig,
      timestamp: Date.now()
    };
    onTemplateGenerated(templateData);
  };

  const tabs = [
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'effects', label: 'Effects', icon: Magic }
  ];

  return (
    <div className="h-full flex gap-6">
      {/* Preview Area */}
      <div className="flex-1 space-y-4">
        {/* Preview Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CRDButton
              size="sm"
              variant={previewMode === 'split' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('split')}
            >
              Split View
            </CRDButton>
            <CRDButton
              size="sm"
              variant={previewMode === 'before' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('before')}
            >
              Original
            </CRDButton>
            <CRDButton
              size="sm"
              variant={previewMode === 'after' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('after')}
            >
              Template
            </CRDButton>
          </div>
          
          <div className="flex items-center gap-2">
            <CRDButton size="sm" variant="outline">
              <Undo className="w-4 h-4" />
            </CRDButton>
            <CRDButton size="sm" variant="outline">
              <Redo className="w-4 h-4" />
            </CRDButton>
            <CRDButton size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </CRDButton>
          </div>
        </div>

        {/* Preview Canvas */}
        <div className="relative bg-white rounded-lg border border-crd-mediumGray/30 overflow-hidden">
          {previewMode === 'split' ? (
            <div className="flex h-96">
              {/* Original */}
              <div className="flex-1 relative">
                <img src={imageUrl} alt="Original" className="w-full h-full object-contain" />
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  Original
                </div>
              </div>
              
              {/* Divider */}
              <div className="w-1 bg-crd-mediumGray/30 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                  <Eye className="w-3 h-3 text-black" />
                </div>
              </div>
              
              {/* Template Preview */}
              <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="absolute inset-4 bg-white rounded-lg shadow-lg p-4">
                  <div className="text-center text-gray-500 mt-8">
                    Template Preview
                    <div className="mt-4 space-y-2">
                      {detectedRegions.map((region, index) => (
                        <div key={region.id} className="text-xs bg-gray-100 p-2 rounded">
                          {region.type} region
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  Template
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 relative">
              <img 
                src={imageUrl} 
                alt={previewMode === 'before' ? 'Original' : 'Template'} 
                className="w-full h-full object-contain" 
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <CRDButton onClick={generateTemplate} className="flex-1">
            <Zap className="w-4 h-4 mr-2" />
            Generate Template
          </CRDButton>
          <CRDButton variant="outline">
            <Settings className="w-4 h-4" />
          </CRDButton>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-80 space-y-4">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 p-1 bg-crd-mediumGray/20 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-crd-green text-black font-medium'
                    : 'text-crd-lightGray hover:text-crd-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-lg capitalize">
              {activeTab} Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTab === 'layout' && (
              <>
                <div>
                  <label className="block text-sm text-crd-lightGray mb-2">Padding</label>
                  <Slider
                    value={[templateConfig.layout.padding]}
                    onValueChange={(value) => handleConfigUpdate('layout', 'padding', value[0])}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-crd-lightGray mt-1">
                    {templateConfig.layout.padding}px
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-crd-lightGray mb-2">Border Radius</label>
                  <Slider
                    value={[templateConfig.layout.borderRadius]}
                    onValueChange={(value) => handleConfigUpdate('layout', 'borderRadius', value[0])}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-crd-lightGray mt-1">
                    {templateConfig.layout.borderRadius}px
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-crd-lightGray mb-2">Aspect Ratio</label>
                  <select
                    value={templateConfig.layout.aspectRatio}
                    onChange={(e) => handleConfigUpdate('layout', 'aspectRatio', e.target.value)}
                    className="w-full bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded px-3 py-2 text-crd-white"
                  >
                    <option value="5:7">5:7 (Standard Card)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="4:3">4:3 (Classic)</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'colors' && (
              <>
                {Object.entries(templateConfig.colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm text-crd-lightGray mb-2 capitalize">
                      {key} Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleConfigUpdate('colors', key, e.target.value)}
                        className="w-12 h-8 rounded border border-crd-mediumGray/30"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleConfigUpdate('colors', key, e.target.value)}
                        className="flex-1 bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded px-3 py-1 text-crd-white font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'typography' && (
              <>
                <div>
                  <label className="block text-sm text-crd-lightGray mb-2">Font Family</label>
                  <select
                    value={templateConfig.typography.fontFamily}
                    onChange={(e) => handleConfigUpdate('typography', 'fontFamily', e.target.value)}
                    className="w-full bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded px-3 py-2 text-crd-white"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-crd-lightGray mb-2">Font Size</label>
                  <Slider
                    value={[templateConfig.typography.fontSize]}
                    onValueChange={(value) => handleConfigUpdate('typography', 'fontSize', value[0])}
                    min={12}
                    max={48}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-crd-lightGray mt-1">
                    {templateConfig.typography.fontSize}px
                  </div>
                </div>
              </>
            )}

            {activeTab === 'effects' && (
              <>
                <div className="space-y-3">
                  {Object.entries(templateConfig.effects).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm text-crd-lightGray capitalize">
                        {key}
                      </label>
                      {typeof value === 'boolean' ? (
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleConfigUpdate('effects', key, e.target.checked)}
                          className="w-4 h-4"
                        />
                      ) : (
                        <Slider
                          value={[value as number]}
                          onValueChange={(val) => handleConfigUpdate('effects', key, val[0])}
                          max={100}
                          step={1}
                          className="w-24"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Region Summary */}
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-sm">Template Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {detectedRegions.map((region, index) => (
                <div key={region.id} className="flex items-center justify-between text-sm">
                  <span className="text-crd-lightGray">
                    {region.type} {index + 1}
                  </span>
                  <span className="text-crd-white">
                    {Math.round(region.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
