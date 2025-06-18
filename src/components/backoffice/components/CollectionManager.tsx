import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedCardSearch } from './collection-manager/AdvancedCardSearch';
import { CollectionBuilder } from './collection-manager/CollectionBuilder';
import { TemplateManager } from './collection-manager/TemplateManager';
import { GroupManager } from './collection-manager/GroupManager';
import { Search, Users, Settings } from 'lucide-react';

export const CollectionManager = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-crd-white mb-2">Collection Manager</h2>
        <p className="text-crd-lightGray">
          Create collections, manage templates, and organize groups
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-crd-mediumGray">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Card Search
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Collection Builder
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-crd-white">Advanced Card Search</CardTitle>
            </CardHeader>
            <CardContent>
              <AdvancedCardSearch 
                onSelectionChange={setSelectedCards}
                selectedCards={selectedCards}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-crd-white">Collection Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <CollectionBuilder selectedCards={selectedCards} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-crd-white">Template Management</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-crd-white">Group Management</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
