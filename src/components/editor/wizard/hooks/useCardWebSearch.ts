
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
      // Step 1: Enhanced image analysis
      console.log('Analyzing card image with enhanced system...');
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-card-image', {
        body: { imageData: imageUrl }
      });

      if (analysisError) {
        console.error('Image analysis error:', analysisError);
        toast.error('Analysis failed, using creative fallback');
      }

      const imageAnalysis: EnhancedImageAnalysisResult = analysisData || {
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

      console.log('Enhanced analysis result:', imageAnalysis);

      // Step 2: Create search query based on analysis type
      let searchQuery = '';
      if (imageAnalysis.analysisType === 'traditional') {
        searchQuery = [
          imageAnalysis.playerName,
          imageAnalysis.team,
          imageAnalysis.year,
          imageAnalysis.sport,
          ...imageAnalysis.extractedText.slice(0, 3)
        ].filter(Boolean).join(' ');
      } else {
        // For visual analysis, use creative title and subjects
        searchQuery = [
          imageAnalysis.creativeTitle,
          ...(imageAnalysis.visualAnalysis?.subjects || []),
          imageAnalysis.visualAnalysis?.theme
        ].filter(Boolean).join(' ');
      }

      // Step 3: Generate enhanced card information
      console.log('Generating card info with query:', searchQuery);
      const { data: searchData, error: searchError } = await supabase.functions.invoke('search-card-info', {
        body: { 
          query: searchQuery,
          extractedData: imageAnalysis
        }
      });

      if (searchError && !searchData) {
        console.error('Search error:', searchError);
        toast.warning('Using creative analysis for card generation');
      }

      const result = searchData || { success: true, cardInfo: null };
      const cardInfo = result.cardInfo;

      if (!cardInfo) {
        // This should rarely happen now, but just in case
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

      // Show appropriate success message based on analysis type
      const confidencePercentage = Math.round(cardInfo.confidence * 100);
      if (imageAnalysis.analysisType === 'traditional') {
        toast.success(`Traditional card identified with ${confidencePercentage}% confidence!`);
      } else if (imageAnalysis.analysisType === 'visual') {
        toast.success(`Creative card concept generated with ${confidencePercentage}% confidence!`);
      } else {
        toast.info(`Unique card created with ${confidencePercentage}% confidence!`);
      }
      
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
      
      // Always return something useful, never null
      return {
        title: 'Unique Creation',
        description: 'A distinctive card crafted from your image with creative interpretation and artistic flair.',
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
