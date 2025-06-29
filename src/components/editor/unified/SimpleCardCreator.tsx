import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { CircleUserRound, Upload, BookText, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import { TemplateSelectionStep } from '../wizard/TemplateSelectionStep';
import { PublishingOptionsStep } from '../wizard/PublishingOptionsStep';
import { useCardEditor, type CardData, type DesignTemplate } from '@/hooks/useCardEditor';
import { useTemplates } from '@/hooks/useTemplates';
import { CreatorAttribution } from '../wizard/CreatorAttribution';
import { IntentStep } from './components/steps/IntentStep';
import type { CreationMode, CreationStep } from './types';
import { CRDMKRAdapter } from '@/lib/templates/crdmkrAdapter';
import { supabase } from '@/integrations/supabase/client';

interface SimpleCardCreatorProps {
  initialMode?: CreationMode;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
  skipIntent?: boolean;
}

export const SimpleCardCreator = ({ 
  initialMode, 
  onComplete, 
  onCancel,
  skipIntent = false 
}: SimpleCardCreatorProps) => {
  const [currentStep, setCurrentStep] = useState<CreationStep>(skipIntent ? 'upload' : 'intent');
  const [creationMode, setCreationMode] = useState<CreationMode>(initialMode || 'quick');
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rarity, setRarity] = useState<CardData['rarity']>('common');
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [marketplaceListing, setMarketplaceListing] = useState(false);
  const [crdCatalogInclusion, setCrdCatalogInclusion] = useState(false);
  const [printAvailable, setPrintAvailable] = useState(false);
  const [basePrice, setBasePrice] = useState<number | undefined>(undefined);
  const [printPrice, setPrintPrice] = useState<number | undefined>(undefined);
  const [editionSize, setEditionSize] = useState<number | undefined>(undefined);
  const [limitedEdition, setLimitedEdition] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [creatorName, setCreatorName] = useState('');
  const [collaborationType, setCollaborationType] = useState<'solo' | 'collaboration' | 'commission'>('solo');
  const [additionalCredits, setAdditionalCredits] = useState<Array<{ name: string; role: string; }>>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  const cardEditor = useCardEditor();

  useEffect(() => {
    setCanGoBack(currentStep !== 'intent' && currentStep !== 'upload');
  }, [currentStep]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCardImage(file);
    setUploadingImage(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleTemplateSelect = (template: DesignTemplate) => {
    console.log('🎨 SimpleCardCreator: Template selected:', template);
    setSelectedTemplate(template);
  };

  const handleIntentSelect = (mode: CreationMode) => {
    console.log('🎨 SimpleCardCreator: Intent selected:', mode);
    setCreationMode(mode);
    setCurrentStep('upload');
  };

  const handleBulkUpload = () => {
    console.warn('Bulk upload not implemented yet');
  };

  const handleCreateFromPSD = () => {
    console.log('🎨 SimpleCardCreator: Redirecting to CRDMKR');
    window.location.href = '/crdmkr';
  };

  const handleSubmit = async () => {
    if (!cardImage && !selectedTemplate) {
      console.error('Image or template is required');
      return;
    }

    setIsCreating(true);
    setCreationError(null);

    try {
      const cardData: CardData = {
        id: `card-${Date.now()}`,
        title,
        description,
        rarity,
        tags,
        image_url: imageUrl,
        template_id: selectedTemplate?.id,
        design_metadata: selectedTemplate?.template_data || {},
        visibility: isPublic ? 'public' : 'private',
        is_public: isPublic,
        creator_attribution: {
          creator_name: creatorName,
          collaboration_type: collaborationType,
          additional_credits: additionalCredits
        },
        publishing_options: {
          marketplace_listing: marketplaceListing,
          crd_catalog_inclusion: crdCatalogInclusion,
          print_available: printAvailable,
          pricing: {
            base_price: basePrice,
            print_price: printPrice,
            currency: 'USD'
          },
          distribution: {
            limited_edition: limitedEdition,
            edition_size: editionSize
          }
        }
      };

      // Create card directly using Supabase
      const { data: newCard, error } = await supabase
        .from('cards')
        .insert([{
          title: cardData.title,
          description: cardData.description,
          rarity: cardData.rarity,
          tags: cardData.tags,
          image_url: cardData.image_url,
          template_id: cardData.template_id,
          design_metadata: cardData.design_metadata,
          visibility: cardData.visibility,
          is_public: cardData.is_public,
          marketplace_listing: cardData.publishing_options?.marketplace_listing || false,
          crd_catalog_inclusion: cardData.publishing_options?.crd_catalog_inclusion || true,
          print_available: cardData.publishing_options?.print_available || false,
          price: cardData.publishing_options?.pricing?.base_price,
          creator_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) {
        console.error('🎨 SimpleCardCreator: Card creation failed:', error);
        setCreationError(error.message || 'Card creation failed. Please try again.');
        return;
      }

      if (newCard) {
        console.log('🎨 SimpleCardCreator: Card created successfully:', newCard);
        onComplete?.({ ...cardData, id: newCard.id });
      }
    } catch (error: any) {
      console.error('🎨 SimpleCardCreator: Error creating card:', error);
      setCreationError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsCreating(false);
    }
  };

  const renderIntentSelection = () => (
    <IntentStep
      onModeSelect={handleIntentSelect}
      onBulkUpload={handleBulkUpload}
    />
  );

  const renderImageUpload = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-medium text-lg mb-2">Upload Card Image</h3>
        <p className="text-crd-lightGray text-sm">
          Choose an image to represent your card
        </p>
      </div>

      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            {imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Card Preview"
                  className="max-w-xs max-h-64 rounded-md object-contain"
                />
                <CRDButton
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-crd-lightGray hover:text-crd-white"
                  onClick={() => {
                    setImageUrl('');
                    setCardImage(null);
                  }}
                >
                  Remove
                </CRDButton>
              </div>
            ) : (
              <Label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-crd-mediumGray/30 rounded-md cursor-pointer hover:border-crd-green/50 transition-colors"
              >
                {uploadingImage ? (
                  <div className="text-crd-lightGray">Uploading...</div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-crd-mediumGray mb-2" />
                    <div className="text-crd-lightGray">
                      Click to upload or drag and drop
                    </div>
                  </>
                )}
              </Label>
            )}
            <Input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <CRDButton
          variant="outline"
          onClick={() => skipIntent ? onCancel?.() : setCurrentStep('intent')}
          disabled={!canGoBack}
        >
          Back
        </CRDButton>
        <CRDButton onClick={() => setCurrentStep('details')} disabled={uploadingImage || !imageUrl}>
          Continue
        </CRDButton>
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-medium text-lg mb-2">Card Details</h3>
        <p className="text-crd-lightGray text-sm">
          Enter the details for your card
        </p>
      </div>

      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-crd-white">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                placeholder="Card Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
              />
            </div>
            <div>
              <Label htmlFor="rarity" className="text-crd-white">
                Rarity
              </Label>
              <Select onValueChange={(value) => setRarity(value as CardData['rarity'])}>
                <SelectTrigger className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white">
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="description" className="text-crd-white">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Card Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white resize-none"
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="tags" className="text-crd-white">
              Tags
            </Label>
            <Input
              type="text"
              id="tags"
              placeholder="Enter tags separated by commas"
              value={tags.join(', ')}
              onChange={(e) => setTags(e.target.value.split(',').map((tag) => tag.trim()))}
              className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
            />
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <Label htmlFor="isPublic" className="text-crd-white">
              Public
            </Label>
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <CRDButton
          variant="outline"
          onClick={() => setCurrentStep('upload')}
          disabled={!canGoBack}
        >
          Back
        </CRDButton>
        <CRDButton onClick={() => setCurrentStep('design')}>
          Continue
        </CRDButton>
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <TemplateSelectionStep
        templates={templates}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={handleTemplateSelect}
        onCreateFromPSD={handleCreateFromPSD}
      />
      
      <div className="flex justify-between pt-4">
        <CRDButton
          variant="outline"
          onClick={() => setCurrentStep('upload')}
          disabled={!canGoBack}
        >
          Back
        </CRDButton>
        <CRDButton
          onClick={() => setCurrentStep('details')}
          disabled={!selectedTemplate}
        >
          Continue
        </CRDButton>
      </div>
    </div>
  );

  const renderDesignStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-medium text-lg mb-2">Design Options</h3>
        <p className="text-crd-lightGray text-sm">
          Customize the design and appearance of your card
        </p>
      </div>

      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardContent className="p-6">
          {/* Design Customization Options */}
          {selectedTemplate && CRDMKRAdapter.isCRDMKRTemplate(selectedTemplate) ? (
            <div>
              <h4 className="text-crd-white font-semibold mb-3">CRDMKR Template</h4>
              <p className="text-crd-lightGray text-sm">
                This card uses an AI-generated template. Further customization options will be available soon.
              </p>
            </div>
          ) : (
            <div>
              <h4 className="text-crd-white font-semibold mb-3">Standard Template</h4>
              <p className="text-crd-lightGray text-sm">
                Customize the design options for this template.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <CRDButton
          variant="outline"
          onClick={() => setCurrentStep('details')}
          disabled={!canGoBack}
        >
          Back
        </CRDButton>
        <CRDButton onClick={() => setCurrentStep('publish')}>
          Continue
        </CRDButton>
      </div>
    </div>
  );

  const renderPublishingOptions = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-medium text-lg mb-2">Publishing Options</h3>
        <p className="text-crd-lightGray text-sm">
          Configure the publishing options for your card
        </p>
      </div>

      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketplace-listing"
              checked={marketplaceListing}
              onCheckedChange={(checked) => setMarketplaceListing(checked === true)}
            />
            <Label htmlFor="marketplace-listing" className="text-crd-white">
              List on Marketplace
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="crd-catalog"
              checked={crdCatalogInclusion}
              onCheckedChange={(checked) => setCrdCatalogInclusion(checked === true)}
            />
            <Label htmlFor="crd-catalog" className="text-crd-white">
              Include in CRD Catalog
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="print-available"
              checked={printAvailable}
              onCheckedChange={(checked) => setPrintAvailable(checked === true)}
            />
            <Label htmlFor="print-available" className="text-crd-white">
              Available for Print
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="limited-edition"
              checked={limitedEdition}
              onCheckedChange={(checked) => setLimitedEdition(checked === true)}
            />
            <Label htmlFor="limited-edition" className="text-crd-white">
              Limited Edition
            </Label>
          </div>

          {limitedEdition && (
            <div>
              <Label htmlFor="edition-size" className="text-crd-white">
                Edition Size
              </Label>
              <Input
                type="number"
                id="edition-size"
                placeholder="100"
                value={editionSize || ''}
                onChange={(e) => setEditionSize(e.target.value ? parseInt(e.target.value) : undefined)}
                className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
              />
            </div>
          )}

          {marketplaceListing && (
            <div>
              <Label htmlFor="base-price" className="text-crd-white">
                Base Price ($)
              </Label>
              <Input
                type="number"
                id="base-price"
                placeholder="9.99"
                step="0.01"
                value={basePrice || ''}
                onChange={(e) => setBasePrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
              />
            </div>
          )}

          {printAvailable && (
            <div>
              <Label htmlFor="print-price" className="text-crd-white">
                Print Price ($)
              </Label>
              <Input
                type="number"
                id="print-price"
                placeholder="19.99"
                step="0.01"
                value={printPrice || ''}
                onChange={(e) => setPrintPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <CreatorAttribution
        creatorName={creatorName}
        setCreatorName={setCreatorName}
        collaborationType={collaborationType}
        setCollaborationType={setCollaborationType}
        additionalCredits={additionalCredits}
        setAdditionalCredits={setAdditionalCredits}
      />

      <div className="flex justify-between pt-4">
        <CRDButton
          variant="outline"
          onClick={() => setCurrentStep('design')}
          disabled={!canGoBack}
        >
          Back
        </CRDButton>
        <CRDButton onClick={handleSubmit} disabled={isCreating}>
          {isCreating ? (
            <>
              Creating...
              <Sparkles className="w-4 h-4 ml-2 animate-spin" />
            </>
          ) : (
            'Create Card'
          )}
        </CRDButton>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="text-center py-24">
      <CheckCircle className="w-16 h-16 text-crd-green mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-crd-white mb-4">Card Created!</h2>
      <p className="text-crd-lightGray text-lg mb-8">
        Your card has been successfully created.
      </p>
      <div className="flex justify-center gap-4">
        <CRDButton onClick={() => onComplete && onComplete({} as CardData)}>View Card</CRDButton>
        <CRDButton variant="outline" onClick={onCancel}>
          Create Another
        </CRDButton>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-crd-white">
            Create New Card
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {creationError && (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-md text-red-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {creationError}
            </div>
          )}

          {currentStep === 'intent' && renderIntentSelection()}
          {currentStep === 'upload' && renderImageUpload()}
          {currentStep === 'details' && renderDetailsForm()}
          {currentStep === 'design' && renderTemplateSelection()}
          {currentStep === 'publish' && renderPublishingOptions()}
          {currentStep === 'complete' && renderComplete()}
        </CardContent>
      </Card>
    </div>
  );
};
