
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnifiedCardCatalog } from '@/components/catalog/UnifiedCardCatalog';
import { CatalogTestPanel } from '@/components/catalog/CatalogTestPanel';
import { TestTube, Eye } from 'lucide-react';

export const CardsCatalogSection: React.FC = () => {
  const [showTestPanel, setShowTestPanel] = useState(true);

  return (
    <div className="space-y-6">
      {/* Test Panel Toggle */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Cards Catalog</h1>
        <Button
          onClick={() => setShowTestPanel(!showTestPanel)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {showTestPanel ? <Eye className="h-4 w-4" /> : <TestTube className="h-4 w-4" />}
          {showTestPanel ? 'Hide' : 'Show'} Test Panel
        </Button>
      </div>

      {/* Test Panel */}
      {showTestPanel && <CatalogTestPanel />}

      {/* Main Catalog */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardContent className="p-6">
          <UnifiedCardCatalog />
        </CardContent>
      </Card>
    </div>
  );
};
