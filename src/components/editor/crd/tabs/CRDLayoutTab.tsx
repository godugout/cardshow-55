import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, Grid, Ruler, FileImage } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CRDLayoutTabProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const CRDMKR_TEMPLATES = [
  {
    id: 'baseball-classic',
    name: 'Baseball Classic',
    category: 'Sports',
    dimensions: '2.5" × 3.5"',
    description: 'Traditional baseball card layout with player photo and stats',
    preview: '/placeholder-card-baseball.jpg'
  },
  {
    id: 'basketball-modern',
    name: 'Basketball Modern',
    category: 'Sports', 
    dimensions: '2.5" × 3.5"',
    description: 'Contemporary basketball card with dynamic layout',
    preview: '/placeholder-card-basketball.jpg'
  },
  {
    id: 'trading-standard',
    name: 'Trading Standard',
    category: 'Trading',
    dimensions: '2.5" × 3.5"',
    description: 'Classic trading card format for collectibles',
    preview: '/placeholder-card-trading.jpg'
  },
  {
    id: 'premium-foil',
    name: 'Premium Foil',
    category: 'Premium',
    dimensions: '2.5" × 3.5"',
    description: 'Luxury foil-ready template with premium elements',
    preview: '/placeholder-card-premium.jpg'
  }
];

const TEMPLATE_CATEGORIES = ['All', 'Sports', 'Trading', 'Premium', 'Custom'];

export const CRDLayoutTab: React.FC<CRDLayoutTabProps> = ({
  selectedTemplate,
  onTemplateSelect
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredTemplates = CRDMKR_TEMPLATES.filter(template => 
    selectedCategory === 'All' || template.category === selectedCategory
  );

  return (
    <div className="space-y-4">
      {/* Template Categories */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Grid className="w-4 h-4" />
            Template Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_CATEGORIES.map(category => (
              <CRDButton
                key={category}
                variant={selectedCategory === category ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </CRDButton>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Grid */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Professional Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-crd-blue bg-crd-blue/10'
                  : 'border-crd-mediumGray/20 hover:border-crd-blue/50'
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-16 bg-crd-mediumGray/20 rounded flex items-center justify-center flex-shrink-0">
                  <FileImage className="w-6 h-6 text-crd-lightGray" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-crd-white font-medium text-sm">{template.name}</h4>
                  <p className="text-crd-lightGray text-xs mb-1">{template.category} • {template.dimensions}</p>
                  <p className="text-crd-lightGray text-xs leading-relaxed">{template.description}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dimensions & Format */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Print Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-crd-lightGray block mb-1">Dimensions</label>
              <div className="text-crd-white bg-crd-darkest border border-crd-mediumGray/20 rounded px-2 py-1">
                2.5" × 3.5"
              </div>
            </div>
            <div>
              <label className="text-crd-lightGray block mb-1">Resolution</label>
              <div className="text-crd-white bg-crd-darkest border border-crd-mediumGray/20 rounded px-2 py-1">
                300 DPI
              </div>
            </div>
            <div>
              <label className="text-crd-lightGray block mb-1">Bleed</label>
              <div className="text-crd-white bg-crd-darkest border border-crd-mediumGray/20 rounded px-2 py-1">
                0.125"
              </div>
            </div>
            <div>
              <label className="text-crd-lightGray block mb-1">Color Mode</label>
              <div className="text-crd-white bg-crd-darkest border border-crd-mediumGray/20 rounded px-2 py-1">
                CMYK
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};