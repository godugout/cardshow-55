
import React, { useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CardData } from '@/hooks/useCardEditor';

interface ShopPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onCardCreate: (cardData: Partial<CardData>) => void;
  card?: CardData;
  mode: 'create' | 'edit';
}

export const ShopPanel: React.FC<ShopPanelProps> = ({
  isVisible,
  onClose,
  onCardCreate,
  card,
  mode
}) => {
  const [formData, setFormData] = useState({
    title: card?.title || '',
    description: card?.description || '',
    rarity: card?.rarity || 'common',
    tags: card?.tags?.join(', ') || '',
    template_id: card?.template_id || 'basic'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cardData: Partial<CardData> = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    
    onCardCreate(cardData);
  };

  if (!isVisible) return null;

  const panelWidth = 400;

  return (
    <div 
      className="fixed top-0 right-0 h-full z-50" 
      style={{ width: `${panelWidth}px` }}
    >
      <div className="h-full bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-crd-purple" />
            <h2 className="text-lg font-semibold text-white">
              {mode === 'create' ? 'Create Card' : 'Edit Card'}
            </h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
          >
            <X className="w-4 h-4 text-white" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Card Title */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Card Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-crd-purple"
                  placeholder="Enter card title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-crd-purple"
                  placeholder="Describe your card..."
                  rows={3}
                />
              </div>

              {/* Rarity */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Rarity
                </label>
                <select
                  value={formData.rarity}
                  onChange={(e) => setFormData(prev => ({ ...prev, rarity: e.target.value as any }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-crd-purple"
                >
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-crd-purple"
                  placeholder="sports, action, basketball (comma separated)"
                />
              </div>

              {/* Template */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Template
                </label>
                <select
                  value={formData.template_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, template_id: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-crd-purple"
                >
                  <option value="basic">Basic</option>
                  <option value="sports-pro">Sports Pro</option>
                  <option value="fantasy-elite">Fantasy Elite</option>
                  <option value="modern-minimalist">Modern Minimalist</option>
                </select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-crd-purple hover:bg-crd-purple/90 text-white py-3 rounded-lg font-medium"
              >
                {mode === 'create' ? 'Create Card' : 'Update Card'}
              </Button>
            </form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
