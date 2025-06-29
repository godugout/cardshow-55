
import { useState, useCallback, useRef } from 'react';
import { freeAIAnalyzer } from '@/lib/crdmkr/freeAIAnalyzer';
import { toast } from 'sonner';

interface AnalysisOptions {
  useML?: boolean;
  useHeuristics?: boolean;
  confidenceThreshold?: number;
}

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

export const useMLAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const analyzeImage = useCallback(async (
    imageUrl: string, 
    options: AnalysisOptions = {}
  ): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const startTime = Date.now();
      
      setProgress(10);
      const imageElement = await loadImage(imageUrl);
      
      if (abortControllerRef.current.signal.aborted) {
        throw new Error('Analysis cancelled');
      }

      setProgress(30);
      console.log('🔍 Running ML analysis with options:', options);
      
      const result = await freeAIAnalyzer.analyzeImage(imageElement);
      
      if (abortControllerRef.current.signal.aborted) {
        throw new Error('Analysis cancelled');
      }

      setProgress(100);
      setLastResult(result);

      const processingTime = Date.now() - startTime;
      console.log(`✅ ML analysis complete in ${processingTime}ms`);
      toast.success(`Analysis complete! Found ${result.regions.length} regions with ${result.confidence}% confidence`);

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      console.error('❌ ML analysis failed:', err);
      
      if (errorMessage !== 'Analysis cancelled') {
        toast.error(`Analysis failed: ${errorMessage}`);
      }
      
      return null;
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
      abortControllerRef.current = null;
    }
  }, []);

  const cancelAnalysis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsAnalyzing(false);
      setProgress(0);
      toast.info('Analysis cancelled');
    }
  }, []);

  return {
    analyzeImage,
    cancelAnalysis,
    isAnalyzing,
    progress,
    lastResult,
    error
  };
};

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};
