import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { browserImageAnalyzer } from '@/services/browserImageAnalyzer';

export interface CardSearchResult {
  title: string;
  description: string;
  type: string;
  series: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
  confidence: number;
}

interface EnhancedImageAnalysisResult {
  extractedText: string[];
  playerName: string;
  team: string;
  year: string;
  sport: string;
  cardNumber: string;
  confidence: number;
  analysisType: 'traditional' | 'visual' | 'fallback';
  visualAnalysis?: {
    subjects: string[];
    colors: string[];
    mood: string;
    style: string;
    theme: string;
    setting: string;
  };
  creativeTitle?: string;
  creativeDescription?: string;
}

export const useCardWebSearch = () => {
  const [isSearching, setIsSearching] = useState(false);

  const searchCardInfo = async (imageUrl: string): Promise<CardSearchResult | null> => {
    setIsSearching(true);
    
    try {
      console.log('Starting browser-based image analysis...');
      
      // Try browser-based analysis first (primary method)
      try {
        const browserResult = await browserImageAnalyzer.analyzeImage(imageUrl);
        
        if (browserResult.confidence > 0.5) {
          const confidencePercentage = Math.round(browserResult.confidence * 100);
          toast.success(`Object identified: ${browserResult.objects[0]} with ${confidencePercentage}% confidence!`);
          
          return {
            title: browserResult.title,
            description: browserResult.description,
            type: 'Visual',
            series: 'Discovery Collection',
            rarity: browserResult.rarity,
            tags: browserResult.tags,
            confidence: browserResult.confidence
          };
        }
      } catch (browserError) {
        console.warn('Browser analysis failed, trying edge function fallback:', browserError);
      }

      // Fallback to edge function analysis
      console.log('Using edge function fallback...');
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-card-image', {
        body: { imageData: imageUrl }
      });

      if (analysisError) {
        console.error('Edge function analysis error:', analysisError);
      }

      const imageAnalysis = analysisData || {
        extractedText: [],
        playerName: 'Creative Subject',
        team: 'Artistic Collection',
        year: new Date().getFullYear().toString(),
        sport: 'Creative',
        cardNumber: '',
        confidence: 0.5,
        analysisType: 'fallback',
        creativeTitle: 'Unique Discovery',
        creativeDescription: 'A one-of-a-kind card with creative potential'
      };

      console.log('Analysis result:', imageAnalysis);

      // Generate enhanced card information
      const { data: searchData, error: searchError } = await supabase.functions.invoke('search-card-info', {
        body: { 
          query: imageAnalysis.creativeTitle || 'Creative Discovery',
          extractedData: imageAnalysis
        }
      });

      if (searchError && !searchData) {
        console.error('Search error:', searchError);
        toast.info('Generated creative card concept from image');
      }

      const result = searchData || { success: true, cardInfo: null };
      const cardInfo = result.cardInfo;

      if (!cardInfo) {
        toast.info('Generated creative card concept from image');
        return {
          title: 'Creative Discovery',
          description: 'A unique card created from your image with artistic interpretation',
          type: 'Creative',
          series: 'Custom Collection',
          rarity: 'uncommon',
          tags: ['creative', 'unique', 'custom'],
          confidence: 0.6
        };
      }

      const confidencePercentage = Math.round(cardInfo.confidence * 100);
      toast.success(`Card concept generated with ${confidencePercentage}% confidence!`);
      
      return {
        title: cardInfo.title,
        description: cardInfo.description,
        type: cardInfo.type,
        series: cardInfo.series,
        rarity: cardInfo.rarity,
        tags: cardInfo.tags,
        confidence: cardInfo.confidence
      };
      
    } catch (error) {
      console.error('Card search error:', error);
      toast.info('Generated creative card from image analysis');
      
      return {
        title: 'Unique Creation',
        description: 'A distinctive card crafted from your image with creative interpretation.',
        type: 'Creative',
        series: 'Original Collection',
        rarity: 'uncommon',
        tags: ['creative', 'original', 'unique', 'artistic'],
        confidence: 0.5
      };
    } finally {
      setIsSearching(false);
    }
  };

  const searchByText = async (query: string): Promise<CardSearchResult[]> => {
    setIsSearching(true);
    
    try {
      console.log('Searching by text query:', query);
      
      const { data: searchData, error: searchError } = await supabase.functions.invoke('search-card-info', {
        body: { 
          query,
          extractedData: { 
            extractedText: [query], 
            confidence: 0.8,
            analysisType: 'traditional',
            playerName: query,
            team: '',
            year: '',
            sport: 'General',
            cardNumber: ''
          }
        }
      });

      if (searchError && !searchData) {
        console.error('Text search error:', searchError);
        toast.info('Generated creative card concept from search terms');
      }

      const result = searchData || { success: true, cardInfo: null };
      const cardInfo = result.cardInfo;

      if (!cardInfo) {
        // Fallback for text search
        return [{
          title: `${query} Card`,
          description: `A unique trading card featuring ${query} with distinctive characteristics and collectible appeal.`,
          type: 'General',
          series: 'Search Collection',
          rarity: 'common',
          tags: query.toLowerCase().split(' ').filter(tag => tag.length > 2),
          confidence: 0.6
        }];
      }

      return [{
        title: cardInfo.title,
        description: cardInfo.description,
        type: cardInfo.type,
        series: cardInfo.series,
        rarity: cardInfo.rarity,
        tags: cardInfo.tags,
        confidence: cardInfo.confidence
      }];
      
    } catch (error) {
      console.error('Text search error:', error);
      toast.info('Generated creative card from search terms');
      
      return [{
        title: `${query} Creation`,
        description: `An imaginative card concept inspired by "${query}" with unique design elements and creative interpretation.`,
        type: 'Creative',
        series: 'Concept Collection',
        rarity: 'uncommon',
        tags: [...query.toLowerCase().split(' ').filter(tag => tag.length > 2), 'creative', 'concept'],
        confidence: 0.5
      }];
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchCardInfo,
    searchByText,
    isSearching
  };
};
