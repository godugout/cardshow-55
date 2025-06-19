import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Tag, Crown, X, Plus, Zap, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { CardData, CardRarity, CreatorAttribution } from '@/types/card';
import type { WizardMode } from '../UnifiedCardWizard';

interface UnifiedCardDetailsStepProps {
  mode: WizardMode;
  cardData: CardData;
  onFieldUpdate: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
  onCreatorAttributionUpdate: (attribution: CreatorAttribution) => void;
  aiAnalysisComplete: boolean;
}

export const UnifiedCardDetailsStep = ({ 
  mode,
  cardData, 
  onFieldUpdate, 
  onCreatorAttributionUpdate,
  aiAnalysisComplete 
}: UnifiedCardDetailsStepProps) => {
  const [newTag, setNewTag] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(mode === 'advanced');

  const handleAddTag = () => {
    if (newTag.trim() && !cardData.tags.includes(newTag.trim()) && cardData.tags.length < 10) {
      onFieldUpdate('tags', [...cardData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onFieldUpdate('tags', cardData.tags.filter(tag => tag !== tagToRemove));
  };

  const rarityColors = {
    common: 'bg-gray-500',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    'ultra-rare': 'bg-purple-500',
    legendary: 'bg-yellow-500'
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'quick': return <Zap className="w-5 h-5 text-crd-green" />;
      case 'advanced': return <Settings className="w-5 h-5 text-crd-blue" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'quick': 
        return aiAnalysisComplete 
          ? 'AI has filled in your card details. Review and adjust anything you\'d like to change.'
          : 'Fill in your card details to create your unique trading card.';
      case 'advanced': 
        return 'Customize every aspect of your card with full control over all details and metadata.';
      default: 
        return 'Fill in your card details to create your unique trading card.';
    }
  };

  // Essential fields that are always shown
  const essentialFields = (
    <>
      {/* Title */}
      <div>
        <Label htmlFor="title" className="text-crd-lightGray font-medium mb-2 block">
          Card Title *
        </Label>
        <Input
          id="title"
          value={cardData.title}
          onChange={(e) => onFieldUpdate('title', e.target.value)}
          className="bg-crd-darkGray border-crd-mediumGray text-white"
          placeholder={mode === 'quick' ? 'AI will suggest a title...' : 'Enter your card title'}
          maxLength={60}
        />
        <p className="text-xs text-crd-lightGray mt-1">
          {cardData.title.length}/60 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-crd-lightGray font-medium mb-2 block">
          Description {mode === 'quick' ? '(Optional)' : ''}
        </Label>
        <Textarea
          id="description"
          value={cardData.description}
          onChange={(e) => onFieldUpdate('description', e.target.value)}
          className="bg-crd-darkGray border-crd-mediumGray text-white min-h-[80px]"
          placeholder={mode === 'quick' ? 'AI will generate a description...' : 'Describe your card...'}
          maxLength={500}
        />
        <p className="text-xs text-crd-lightGray mt-1">
          {cardData.description?.length || 0}/500 characters
        </p>
      </div>

      {/* Rarity - simplified in quick mode */}
      <div>
        <Label className="text-crd-lightGray font-medium mb-2 block flex items-center gap-2">
          <Crown className="w-4 h-4" />
          Rarity {mode === 'quick' && '(AI Suggested)'}
        </Label>
        <Select 
          value={cardData.rarity} 
          onValueChange={(value: CardRarity) => onFieldUpdate('rarity', value)}
          disabled={mode === 'quick' && aiAnalysisComplete}
        >
          <SelectTrigger className="bg-crd-darkGray border-crd-mediumGray text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-crd-darkGray border-crd-mediumGray">
            {(['common', 'uncommon', 'rare', 'ultra-rare', 'legendary'] as CardRarity[]).map((rarity) => (
              <SelectItem key={rarity} value={rarity} className="text-white hover:bg-crd-mediumGray">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${rarityColors[rarity]}`}></div>
                  <span className="capitalize">{rarity.replace('-', ' ')}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {mode === 'quick' && aiAnalysisComplete && (
          <p className="text-xs text-crd-lightGray mt-1">
            AI selected this rarity based on your image
          </p>
        )}
      </div>
    </>
  );

  // Advanced fields that can be collapsed in quick mode
  const advancedFields = (
    <>
      {/* Tags */}
      <div>
        <Label className="text-crd-lightGray font-medium mb-2 block flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Tags {mode === 'quick' && aiAnalysisComplete && '(AI Generated)'}
        </Label>
        
        {/* Existing Tags */}
        {cardData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {cardData.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-crd-mediumGray text-white hover:bg-crd-lightGray"
              >
                {tag}
                {(mode === 'advanced' || !aiAnalysisComplete) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 hover:bg-transparent"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Add New Tag - hidden in quick mode with AI analysis */}
        {(mode === 'advanced' || !aiAnalysisComplete) && cardData.tags.length < 10 && (
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              className="bg-crd-darkGray border-crd-mediumGray text-white flex-1"
              placeholder="Add a tag..."
              maxLength={20}
            />
            <Button
              onClick={handleAddTag}
              disabled={!newTag.trim() || cardData.tags.includes(newTag.trim())}
              className={`${
                mode === 'quick' 
                  ? 'bg-crd-green hover:bg-crd-green/90 text-black' 
                  : 'bg-crd-blue hover:bg-crd-blue/90 text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <p className="text-xs text-crd-lightGray mt-1">
          {cardData.tags.length}/10 tags • Tags help people find your card
        </p>
      </div>

      {/* Type & Series - advanced mode only */}
      {mode === 'advanced' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type" className="text-crd-lightGray font-medium mb-2 block">
              Type
            </Label>
            <Input
              id="type"
              value={cardData.type || ''}
              onChange={(e) => onFieldUpdate('type', e.target.value)}
              className="bg-crd-darkGray border-crd-mediumGray text-white"
              placeholder="Card type (e.g., Player, Character)"
            />
          </div>
          
          <div>
            <Label htmlFor="series" className="text-crd-lightGray font-medium mb-2 block">
              Series
            </Label>
            <Input
              id="series"
              value={cardData.series || ''}
              onChange={(e) => onFieldUpdate('series', e.target.value)}
              className="bg-crd-darkGray border-crd-mediumGray text-white"
              placeholder="Card series or collection"
            />
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Mode-specific header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {getModeIcon()}
          <h2 className="text-2xl font-bold text-white">
            {mode === 'quick' ? 'Review Card Details' : 'Customize Card Details'}
          </h2>
        </div>
        <p className="text-crd-lightGray">{getModeDescription()}</p>
      </div>

      {/* AI Analysis Status */}
      {aiAnalysisComplete && (
        <div className={`p-4 rounded-lg ${
          mode === 'quick' 
            ? 'bg-crd-green/10 border border-crd-green/30' 
            : 'bg-crd-blue/10 border border-crd-blue/30'
        }`}>
          <div className={`flex items-center gap-2 mb-2 ${
            mode === 'quick' ? 'text-crd-green' : 'text-crd-blue'
          }`}>
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">
              {mode === 'quick' ? 'AI Setup Complete!' : 'AI Analysis Complete'}
            </span>
          </div>
          <p className="text-sm text-crd-lightGray">
            {mode === 'quick' 
              ? 'Your card is ready! Review the details below and publish when you\'re happy with everything.'
              : 'Your card details have been automatically generated. Feel free to customize any of the fields below.'
            }
          </p>
        </div>
      )}

      <div className="grid gap-6">
        {/* Essential fields - always visible */}
        {essentialFields}

        {/* Advanced options - collapsible in quick mode */}
        {mode === 'quick' ? (
          <Collapsible open={showAdvancedOptions} onOpenChange={setShowAdvancedOptions}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                {showAdvancedOptions ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 mt-6">
              {advancedFields}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          advancedFields
        )}
      </div>
    </div>
  );
};
