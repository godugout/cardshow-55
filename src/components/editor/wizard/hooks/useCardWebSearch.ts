
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

interface ImageAnalysisResult {
  extractedText: string[];
  playerName: string;
  team: string;
  year: string;
  sport: string;
  cardNumber: string;
  confidence: number;
}

export const useCardWebSearch = () => {
  const [isSearching, setIsSearching] = useState(false);

  const searchCardInfo = async (imageUrl: string): Promise<CardSearchResult | null> => {
    setIsSearching(true);
    
    try {
      // Step 1: Analyze the image to extract text and card information
      console.log('Analyzing card image...');
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-card-image', {
        body: { imageData: imageUrl }
      });

      if (analysisError) {
        console.error('Image analysis error:', analysisError);
        toast.error('Failed to analyze card image');
        return null;
      }

      const imageAnalysis: ImageAnalysisResult = analysisData;
      console.log('Image analysis result:', imageAnalysis);

      // Step 2: Create search query from extracted information
      const searchTerms = [
        imageAnalysis.playerName,
        imageAnalysis.team,
        imageAnalysis.year,
        imageAnalysis.sport,
        ...imageAnalysis.extractedText.slice(0, 3) // Include some extracted text
      ].filter(Boolean).join(' ');

      if (!searchTerms.trim()) {
        toast.error('Could not extract enough information from the image');
        return null;
      }

      // Step 3: Search for card information using web search + AI
      console.log('Searching for card info with query:', searchTerms);
      const { data: searchData, error: searchError } = await supabase.functions.invoke('search-card-info', {
        body: { 
          query: searchTerms,
          extractedData: imageAnalysis
        }
      });

      if (searchError || !searchData.success) {
        console.error('Search error:', searchError || searchData.error);
        toast.error('Failed to find card information');
        return null;
      }

      const cardInfo = searchData.cardInfo;
      const confidencePercentage = Math.round(cardInfo.confidence * 100);
      
      toast.success(`Found card match with ${confidencePercentage}% confidence!`);
      
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
      toast.error('Failed to search for card information');
      return null;
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
          extractedData: { extractedText: [query], confidence: 0.8 }
        }
      });

      if (searchError || !searchData.success) {
        console.error('Text search error:', searchError || searchData.error);
        toast.error('Failed to search for card information');
        return [];
      }

      const cardInfo = searchData.cardInfo;
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
      toast.error('Failed to search for card information');
      return [];
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
