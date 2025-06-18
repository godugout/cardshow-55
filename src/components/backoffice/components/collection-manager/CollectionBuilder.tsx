
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Users, Hash, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from 'sonner';

interface CollectionBuilderProps {
  selectedCards: string[];
}

export const CollectionBuilder: React.FC<CollectionBuilderProps> = ({ selectedCards }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'private' as 'public' | 'private' | 'shared',
    isGroup: false,
    allowMemberCardSharing: false,
    templateName: '',
    makeTemplate: false,
    templatePublic: false
  });
  const [loading, setLoading] = useState(false);
  const [groupCode, setGroupCode] = useState('');

  const generateGroupCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setGroupCode(code);
  };

  const handleCreateCollection = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to create collections');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Collection title is required');
      return;
    }

    if (selectedCards.length === 0) {
      toast.error('Please select at least one card');
      return;
    }

    setLoading(true);
    try {
      // Create collection template if requested
      let templateId = null;
      if (formData.makeTemplate && formData.templateName.trim()) {
        const templateHash = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const { data: template, error: templateError } = await supabase
          .from('collection_templates')
          .insert({
            name: formData.templateName,
            description: formData.description,
            template_hash: templateHash,
            creator_id: user.id,
            is_public: formData.templatePublic,
            card_filters: {
              selected_card_ids: selectedCards
            }
          })
          .select()
          .single();

        if (templateError) throw templateError;
        templateId = template.id;
      }

      // Create collection
      const collectionData: any = {
        title: formData.title,
        description: formData.description,
        owner_id: user.id,
        visibility: formData.visibility,
        is_group: formData.isGroup,
        allow_member_card_sharing: formData.allowMemberCardSharing
      };

      if (templateId) {
        collectionData.template_id = templateId;
      }

      if (formData.isGroup && groupCode) {
        collectionData.group_code = groupCode;
      }

      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .insert(collectionData)
        .select()
        .single();

      if (collectionError) throw collectionError;

      // Add cards to collection
      const collectionCards = selectedCards.map((cardId, index) => ({
        collection_id: collection.id,
        card_id: cardId,
        display_order: index
      }));

      const { error: cardsError } = await supabase
        .from('collection_cards')
        .insert(collectionCards);

      if (cardsError) throw cardsError;

      // Add owner as member if it's a group
      if (formData.isGroup) {
        const { error: memberError } = await supabase
          .from('collection_memberships')
          .insert({
            collection_id: collection.id,
            user_id: user.id,
            role: 'owner',
            can_view_member_cards: true
          });

        if (memberError) throw memberError;
      }

      toast.success(`Collection "${formData.title}" created successfully!`);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        visibility: 'private',
        isGroup: false,
        allowMemberCardSharing: false,
        templateName: '',
        makeTemplate: false,
        templatePublic: false
      });
      setGroupCode('');

    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Cards Preview */}
      <Card className="bg-crd-mediumGray border-crd-lightGray">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2">
            Selected Cards
            <Badge className="bg-crd-green text-black">{selectedCards.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCards.length === 0 ? (
            <p className="text-crd-lightGray">No cards selected. Use the Card Search tab to select cards.</p>
          ) : (
            <p className="text-crd-lightGray">
              {selectedCards.length} card{selectedCards.length !== 1 ? 's' : ''} ready to be added to collection
            </p>
          )}
        </CardContent>
      </Card>

      {/* Collection Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-crd-white">Collection Title *</Label>
            <Input
              placeholder="Enter collection title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
            />
          </div>

          <div>
            <Label className="text-crd-white">Description</Label>
            <Textarea
              placeholder="Describe your collection..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-crd-white">Visibility</Label>
            <Select 
              value={formData.visibility} 
              onValueChange={(value: 'public' | 'private' | 'shared') => 
                setFormData(prev => ({ ...prev, visibility: value }))
              }
            >
              <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-crd-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4" />
                    Private
                  </div>
                </SelectItem>
                <SelectItem value="shared">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Shared
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Public
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {/* Group Settings */}
          <Card className="bg-crd-mediumGray border-crd-lightGray">
            <CardHeader>
              <CardTitle className="text-crd-white text-lg">Group Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-crd-white">Enable Group Mode</Label>
                  <p className="text-sm text-crd-lightGray">Allow others to join this collection</p>
                </div>
                <Switch
                  checked={formData.isGroup}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({ ...prev, isGroup: checked }));
                    if (checked && !groupCode) {
                      generateGroupCode();
                    }
                  }}
                />
              </div>

              {formData.isGroup && (
                <>
                  <div>
                    <Label className="text-crd-white">Group Code</Label>
                    <div className="flex gap-2">
                      <Input
                        value={groupCode}
                        onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                        className="bg-crd-dark border-crd-lightGray text-crd-white"
                        placeholder="Group code"
                      />
                      <Button
                        type="button"
                        onClick={generateGroupCode}
                        className="bg-crd-green hover:bg-crd-green/90 text-black"
                      >
                        <Hash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-crd-white">Allow Card Sharing</Label>
                      <p className="text-sm text-crd-lightGray">Members can share their cards with group</p>
                    </div>
                    <Switch
                      checked={formData.allowMemberCardSharing}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, allowMemberCardSharing: checked }))
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Template Settings */}
          <Card className="bg-crd-mediumGray border-crd-lightGray">
            <CardHeader>
              <CardTitle className="text-crd-white text-lg">Template Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-crd-white">Create Template</Label>
                  <p className="text-sm text-crd-lightGray">Save as reusable template</p>
                </div>
                <Switch
                  checked={formData.makeTemplate}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, makeTemplate: checked }))}
                />
              </div>

              {formData.makeTemplate && (
                <>
                  <div>
                    <Label className="text-crd-white">Template Name</Label>
                    <Input
                      placeholder="Template name..."
                      value={formData.templateName}
                      onChange={(e) => setFormData(prev => ({ ...prev, templateName: e.target.value }))}
                      className="bg-crd-dark border-crd-lightGray text-crd-white"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-crd-white">Public Template</Label>
                      <p className="text-sm text-crd-lightGray">Others can use this template</p>
                    </div>
                    <Switch
                      checked={formData.templatePublic}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, templatePublic: checked }))}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="bg-crd-mediumGray" />

      <div className="flex justify-end">
        <Button 
          onClick={handleCreateCollection}
          disabled={loading || selectedCards.length === 0 || !formData.title.trim()}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Creating...' : 'Create Collection'}
        </Button>
      </div>
    </div>
  );
};
