import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Star, Users, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionTier {
  id: string;
  tier_name: string;
  description: string;
  monthly_price: number;
  features: string[];
  limits: {
    exclusive_content: boolean;
    early_access: boolean;
    direct_messaging: boolean;
    live_workshops: boolean;
    monthly_prints: number;
  };
  is_active: boolean;
  sort_order: number;
}

export const CreatorSubscriptionTiers: React.FC = () => {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newTier, setNewTier] = useState({
    tier_name: '',
    description: '',
    monthly_price: 0,
    features: [''],
    limits: {
      exclusive_content: false,
      early_access: false,
      direct_messaging: false,
      live_workshops: false,
      monthly_prints: 0
    }
  });

  const handleCreateTier = async () => {
    try {
      const { error } = await supabase
        .from('creator_subscription_tiers')
        .insert({
          tier_name: newTier.tier_name,
          description: newTier.description,
          monthly_price: newTier.monthly_price,
          features: newTier.features.filter(f => f.trim()),
          limits: newTier.limits,
          sort_order: tiers.length
        });

      if (error) throw error;
      toast.success('Subscription tier created successfully!');
      setNewTier({
        tier_name: '',
        description: '',
        monthly_price: 0,
        features: [''],
        limits: {
          exclusive_content: false,
          early_access: false,
          direct_messaging: false,
          live_workshops: false,
          monthly_prints: 0
        }
      });
    } catch (error) {
      toast.error('Failed to create subscription tier');
    }
  };

  const getTierIcon = (tierName: string) => {
    const name = tierName.toLowerCase();
    if (name.includes('premium') || name.includes('pro')) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (name.includes('basic') || name.includes('starter')) return <Users className="w-5 h-5 text-blue-500" />;
    return <Star className="w-5 h-5 text-purple-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Subscription Tiers</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Tier
        </Button>
      </div>

      {/* Create New Tier Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Create New Subscription Tier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Tier Name
              </label>
              <Input
                value={newTier.tier_name}
                onChange={(e) => setNewTier(prev => ({ ...prev, tier_name: e.target.value }))}
                placeholder="e.g., Premium Access"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Monthly Price ($)
              </label>
              <Input
                type="number"
                value={newTier.monthly_price}
                onChange={(e) => setNewTier(prev => ({ ...prev, monthly_price: Number(e.target.value) }))}
                placeholder="9.99"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Description
            </label>
            <Textarea
              value={newTier.description}
              onChange={(e) => setNewTier(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what subscribers get with this tier..."
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Features</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Exclusive Content</span>
                <Switch
                  checked={newTier.limits.exclusive_content}
                  onCheckedChange={(checked) => 
                    setNewTier(prev => ({ 
                      ...prev, 
                      limits: { ...prev.limits, exclusive_content: checked } 
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Early Access</span>
                <Switch
                  checked={newTier.limits.early_access}
                  onCheckedChange={(checked) => 
                    setNewTier(prev => ({ 
                      ...prev, 
                      limits: { ...prev.limits, early_access: checked } 
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Direct Messaging</span>
                <Switch
                  checked={newTier.limits.direct_messaging}
                  onCheckedChange={(checked) => 
                    setNewTier(prev => ({ 
                      ...prev, 
                      limits: { ...prev.limits, direct_messaging: checked } 
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Limits</h4>
              <div>
                <label className="text-xs text-gray-400">Monthly Print Allowance</label>
                <Input
                  type="number"
                  value={newTier.limits.monthly_prints}
                  onChange={(e) => 
                    setNewTier(prev => ({ 
                      ...prev, 
                      limits: { ...prev.limits, monthly_prints: Number(e.target.value) } 
                    }))
                  }
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleCreateTier} className="w-full bg-green-600 hover:bg-green-700">
            Create Subscription Tier
          </Button>
        </CardContent>
      </Card>

      {/* Existing Tiers */}
      <div className="grid gap-4">
        {tiers.map((tier) => (
          <Card key={tier.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getTierIcon(tier.tier_name)}
                  <div>
                    <h3 className="text-lg font-semibold text-white">{tier.tier_name}</h3>
                    <p className="text-gray-400">${tier.monthly_price}/month</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={tier.is_active ? "default" : "secondary"}>
                    {tier.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{tier.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Features</h4>
                  <div className="space-y-1">
                    {tier.limits.exclusive_content && (
                      <Badge variant="outline" className="text-xs">Exclusive Content</Badge>
                    )}
                    {tier.limits.early_access && (
                      <Badge variant="outline" className="text-xs">Early Access</Badge>
                    )}
                    {tier.limits.direct_messaging && (
                      <Badge variant="outline" className="text-xs">Direct Messaging</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Limits</h4>
                  <p className="text-sm text-gray-400">
                    {tier.limits.monthly_prints} monthly prints
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
