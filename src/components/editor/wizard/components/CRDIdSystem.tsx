import React, { useState } from 'react';
import { Search, Sparkles, Globe, Image, Loader, CheckCircle, AlertCircle, Eye, Palette, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCardWebSearch, type CardSearchResult } from '../hooks/useCardWebSearch';

interface CRDIdSystemProps {
  imageUrl?: string;
  onCardInfoFound: (result: CardSearchResult) => void;
}

export const CRDIdSystem: React.FC<CRDIdSystemProps> = ({ imageUrl, onCardInfoFound }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CardSearchResult[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<CardSearchResult | null>(null);
  const [analysisType, setAnalysisType] = useState<'traditional' | 'visual' | 'fallback' | null>(null);
  const { searchCardInfo, searchByText, isSearching } = useCardWebSearch();

  const handleImageSearch = async () => {
    if (!imageUrl) return;
    
    const result = await searchCardInfo(imageUrl);
    if (result) {
      setLastAnalysis(result);
      // Determine analysis type based on confidence and content
      if (result.confidence > 0.8) {
        setAnalysisType('traditional');
      } else if (result.confidence > 0.5) {
        setAnalysisType('visual');
      } else {
        setAnalysisType('fallback');
      }
      onCardInfoFound(result);
    }
  };

  const handleTextSearch = async () => {
    if (!searchQuery.trim()) return;
    
    const results = await searchByText(searchQuery);
    setSearchResults(results);
    
    if (results.length > 0) {
      setLastAnalysis(results[0]);
      setAnalysisType('traditional');
      onCardInfoFound(results[0]);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.7) return CheckCircle;
    return AlertCircle;
  };

  const getAnalysisTypeInfo = (type: 'traditional' | 'visual' | 'fallback' | null) => {
    switch (type) {
      case 'traditional':
        return { icon: Search, label: 'Traditional Analysis', color: 'text-blue-500' };
      case 'visual':
        return { icon: Eye, label: 'AI Visual Analysis', color: 'text-purple-500' };
      case 'fallback':
        return { icon: Palette, label: 'Creative Generation', color: 'text-orange-500' };
      default:
        return { icon: Cpu, label: 'Browser AI Analysis', color: 'text-crd-green' };
    }
  };

  return (
    <div className="bg-crd-darkGray/50 border border-crd-mediumGray/30 rounded-xl p-6 space-y-4">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-crd-green">
          <Cpu className="w-5 h-5" />
          <h3 className="text-white font-semibold text-lg">Free CRD ID System</h3>
        </div>
        <p className="text-crd-lightGray text-sm">
          Browser-based AI image analysis - no API keys required!
        </p>
      </div>

      <div className="space-y-4">
        {/* Image Search */}
        {imageUrl && (
          <div className="space-y-2">
            <label className="text-white text-sm font-medium flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Browser AI Analysis (Free)
            </label>
            <Button
              onClick={handleImageSearch}
              disabled={isSearching}
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
            >
              {isSearching ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 mr-2" />
                  Identify Objects & Create Card
                </>
              )}
            </Button>
            <p className="text-xs text-crd-lightGray">
              Powered by Hugging Face Transformers.js - runs locally in your browser
            </p>
          </div>
        )}

        {/* Text Search */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search by Name/Description
          </label>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter player name, team, year, etc..."
              className="bg-crd-darkGray border-crd-mediumGray text-white flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
            />
            <Button
              onClick={handleTextSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="bg-crd-mediumGray hover:bg-crd-mediumGray/80 text-white"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Analysis Result */}
        {lastAnalysis && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-white text-sm font-medium">Latest Analysis</label>
              {analysisType && (
                <div className="flex items-center gap-2">
                  {React.createElement(getAnalysisTypeInfo(analysisType).icon, {
                    className: `w-4 h-4 ${getAnalysisTypeInfo(analysisType).color}`
                  })}
                  <span className={`text-xs ${getAnalysisTypeInfo(analysisType).color}`}>
                    {getAnalysisTypeInfo(analysisType).label}
                  </span>
                </div>
              )}
            </div>
            <div className="bg-crd-mediumGray/20 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium text-sm">{lastAnalysis.title}</h4>
                <div className="flex items-center gap-1">
                  {React.createElement(getConfidenceIcon(lastAnalysis.confidence), {
                    className: `w-4 h-4 ${getConfidenceColor(lastAnalysis.confidence)}`
                  })}
                  <span className={`text-xs ${getConfidenceColor(lastAnalysis.confidence)}`}>
                    {Math.round(lastAnalysis.confidence * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-crd-lightGray text-xs">{lastAnalysis.description}</p>
              <div className="flex items-center gap-4 text-xs text-crd-lightGray">
                <span>Series: {lastAnalysis.series}</span>
                <span>Type: {lastAnalysis.type}</span>
                <span>Rarity: {lastAnalysis.rarity}</span>
              </div>
              {lastAnalysis.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {lastAnalysis.tags.slice(0, 6).map((tag, index) => (
                    <span key={index} className="bg-crd-green/20 text-crd-green px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Analysis Type Indicator */}
              {analysisType && (
                <div className="mt-2 p-2 bg-crd-darkGray/50 rounded text-xs">
                  <span className="text-crd-lightGray">
                    {analysisType === 'traditional' && 'Identified as traditional trading card with text extraction'}
                    {analysisType === 'visual' && 'Created using visual content analysis and creative AI generation'}
                    {analysisType === 'fallback' && 'Generated using creative interpretation and artistic elements'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Additional Results</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {searchResults.slice(1).map((result, index) => (
                <button
                  key={index}
                  onClick={() => onCardInfoFound(result)}
                  className="w-full text-left p-3 bg-crd-mediumGray/20 rounded-lg hover:bg-crd-mediumGray/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium text-sm">{result.title}</h4>
                      <p className="text-crd-lightGray text-xs">{result.series}</p>
                    </div>
                    <span className={`text-xs ${getConfidenceColor(result.confidence)}`}>
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
