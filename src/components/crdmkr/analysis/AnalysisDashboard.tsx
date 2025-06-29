
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Eye, Palette, Type, Zap, CheckCircle } from 'lucide-react';

interface AnalysisResult {
  regions: any[];
  colorPalette: string[];
  confidence: number;
  detectedText: string | null;
  suggestedRarity: string;
  contentType: string;
  tags: string[];
  quality: number;
  suggestedTemplate: string;
}

interface AnalysisDashboardProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  progress: number;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  result,
  isAnalyzing,
  progress
}) => {
  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-crd-green/10 to-blue-500/10 border-crd-green/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-crd-green/20 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-crd-green animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-crd-white">AI Analysis in Progress</h3>
                <p className="text-crd-lightGray">Analyzing your image with advanced AI...</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-crd-lightGray">Processing layers and regions</span>
                <span className="text-crd-white">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                  <Eye className="w-4 h-4" />
                  <span>Detecting regions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                  <Palette className="w-4 h-4" />
                  <span>Extracting colors</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                  <Type className="w-4 h-4" />
                  <span>Analyzing text</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-crd-lightGray">
                  <Zap className="w-4 h-4" />
                  <span>Optimizing layout</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-crd-white">{result.regions.length}</div>
              <div className="text-sm text-crd-lightGray">Regions Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-crd-white">{result.confidence}%</div>
              <div className="text-sm text-crd-lightGray">Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-crd-white">{result.quality}</div>
              <div className="text-sm text-crd-lightGray">Quality Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-crd-white">{result.colorPalette.length}</div>
              <div className="text-sm text-crd-lightGray">Colors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content Analysis */}
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader>
            <CardTitle className="text-crd-white text-lg">Content Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-crd-lightGray">Content Type</label>
              <Badge variant="outline" className="ml-2">{result.contentType}</Badge>
            </div>
            <div>
              <label className="text-sm text-crd-lightGray">Suggested Rarity</label>
              <Badge variant="outline" className="ml-2">{result.suggestedRarity}</Badge>
            </div>
            <div>
              <label className="text-sm text-crd-lightGray">Recommended Template</label>
              <p className="text-crd-white text-sm">{result.suggestedTemplate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Color Analysis */}
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader>
            <CardTitle className="text-crd-white text-lg flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Palette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {result.colorPalette.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border border-crd-mediumGray/30 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-crd-lightGray font-mono">{color}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      {result.tags.length > 0 && (
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader>
            <CardTitle className="text-crd-white text-lg">Detected Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-crd-mediumGray/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
