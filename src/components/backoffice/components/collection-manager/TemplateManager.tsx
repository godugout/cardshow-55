
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Eye, EyeOff, Users, Trash2, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  description?: string;
  template_hash: string;
  creator_id: string;
  is_public: boolean;
  usage_count: number;
  created_at: string;
  card_filters?: any;
}

export const TemplateManager = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('collection_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm.trim()) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const toggleTemplateVisibility = async (templateId: string, isPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('collection_templates')
        .update({ is_public: !isPublic })
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(prev => prev.map(template => 
        template.id === templateId 
          ? { ...template, is_public: !isPublic }
          : template
      ));

      toast.success(`Template ${!isPublic ? 'published' : 'made private'}`);
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('collection_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(prev => prev.filter(template => template.id !== templateId));
      toast.success('Template deleted');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const copyTemplateHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success('Template hash copied to clipboard');
  };

  useEffect(() => {
    fetchTemplates();
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
          />
        </div>
        <Button onClick={fetchTemplates} disabled={loading} className="bg-crd-green hover:bg-crd-green/90 text-black">
          <Search className="w-4 h-4 mr-2" />
          {loading ? 'Loading...' : 'Search'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="bg-crd-mediumGray border-crd-lightGray">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-crd-white text-lg">{template.name}</CardTitle>
                  {template.description && (
                    <p className="text-crd-lightGray text-sm mt-1">{template.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {template.is_public ? (
                    <Badge className="bg-crd-green text-black">
                      <Eye className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-crd-lightGray">Usage Count:</span>
                <Badge variant="outline" className="text-crd-white">
                  <Users className="w-3 h-3 mr-1" />
                  {template.usage_count}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label className="text-crd-lightGray text-xs">Template Hash:</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-crd-dark p-2 rounded text-xs text-crd-white font-mono truncate">
                    {template.template_hash}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyTemplateHash(template.template_hash)}
                    className="text-crd-lightGray hover:text-crd-white"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-crd-lightGray/20">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={template.is_public}
                    onCheckedChange={() => toggleTemplateVisibility(template.id, template.is_public)}
                  />
                  <Label className="text-crd-lightGray text-sm">Public</Label>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteTemplate(template.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-crd-lightGray">No templates found</p>
        </div>
      )}
    </div>
  );
};
