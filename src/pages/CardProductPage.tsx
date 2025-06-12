
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, Share, Download, Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingState } from '@/components/common/LoadingState';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { useCardConversion } from '@/pages/Gallery/hooks/useCardConversion';
import type { Tables } from '@/integrations/supabase/types';

type DbCard = Tables<'cards'>;

const CardProductPage = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [showViewer, setShowViewer] = React.useState(false);
  const { convertCardsToCardData } = useCardConversion();

  const { data: card, isLoading, error } = useQuery({
    queryKey: ['card', cardId],
    queryFn: async () => {
      if (!cardId) throw new Error('No card ID provided');
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', cardId)
        .single();
      
      if (error) throw error;
      return data as DbCard;
    },
    enabled: !!cardId
  });

  if (isLoading) {
    return <LoadingState message="Loading card details..." fullPage />;
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-crd-white mb-4">Card Not Found</h1>
          <p className="text-crd-lightGray mb-6">The card you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/gallery')} className="bg-crd-green hover:bg-crd-green/80">
            Back to Gallery
          </Button>
        </div>
      </div>
    );
  }

  const convertedCard = convertCardsToCardData([card])[0];
  const isPrivate = card.visibility === 'private' || !card.is_public;
  const displayImage = card.image_url || card.thumbnail_url || 
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80';

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-600';
      case 'epic': return 'bg-purple-600';
      case 'rare': return 'bg-blue-600';
      case 'uncommon': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description || 'Check out this card!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Add toast notification
    }
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download card:', card.id);
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="border-b border-crd-mediumGray bg-crd-dark">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="text-crd-lightGray hover:text-crd-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              {isPrivate && (
                <Badge className="bg-red-600/90 text-white">
                  <Lock className="w-3 h-3 mr-1" />
                  Private
                </Badge>
              )}
              <Button
                onClick={() => setShowViewer(true)}
                className="bg-crd-green hover:bg-crd-green/80 text-black"
              >
                <Eye className="w-4 h-4 mr-2" />
                View in 3D
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray"
              >
                <Share className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Image */}
          <div className="space-y-6">
            <div className="aspect-[3/4] bg-crd-mediumGray rounded-xl overflow-hidden">
              <img
                src={displayImage}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-crd-white">{card.title}</h1>
                {card.rarity && (
                  <Badge className={`${getRarityColor(card.rarity)} text-white`}>
                    {card.rarity}
                  </Badge>
                )}
              </div>
              
              {card.description && (
                <p className="text-crd-lightGray text-lg leading-relaxed">
                  {card.description}
                </p>
              )}
            </div>

            {/* Card Properties */}
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-crd-white">Card Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-crd-lightGray text-sm">Rarity</span>
                    <p className="text-crd-white font-medium capitalize">{card.rarity || 'Common'}</p>
                  </div>
                  <div>
                    <span className="text-crd-lightGray text-sm">Series</span>
                    <p className="text-crd-white font-medium">{card.series || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-crd-lightGray text-sm">Created</span>
                    <p className="text-crd-white font-medium">
                      {new Date(card.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-crd-lightGray text-sm">Visibility</span>
                    <p className="text-crd-white font-medium capitalize">{card.visibility}</p>
                  </div>
                </div>

                {card.tags && card.tags.length > 0 && (
                  <div>
                    <span className="text-crd-lightGray text-sm block mb-2">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Technical Details */}
            {card.design_metadata && Object.keys(card.design_metadata as object).length > 0 && (
              <Card className="bg-crd-dark border-crd-mediumGray">
                <CardHeader>
                  <CardTitle className="text-crd-white">Design Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-crd-lightGray text-sm overflow-auto">
                    {JSON.stringify(card.design_metadata, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 3D Viewer Modal */}
      {showViewer && convertedCard && (
        <ImmersiveCardViewer
          card={convertedCard}
          cards={[convertedCard]}
          currentCardIndex={0}
          onCardChange={() => {}}
          isOpen={showViewer}
          onClose={() => setShowViewer(false)}
          onShare={handleShare}
          onDownload={handleDownload}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      )}
    </div>
  );
};

export default CardProductPage;
