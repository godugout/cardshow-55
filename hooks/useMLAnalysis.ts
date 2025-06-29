
import { useState, useCallback, useRef } from 'react';
import { aiAnalyzer } from '@/lib/crdmkr/aiAnalyzer';
import { heuristicDetector } from '@/lib/crdmkr/heuristicDetector';
import type { DetectedRegion, FontAnalysis } from '@/types/crdmkr';
import { toast } from 'sonner';

interface AnalysisResult {
  regions: DetectedRegion[];
  colorPalette: string[];
  typography: FontAnalysis[];
  confidence: number;
  processingTime: number;
}

interface AnalysisOptions {
  useML: boolean;
  useHeuristics: boolean;
  confidenceThreshold: number;
  enableCaching: boolean;
}

export const useMLAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const cacheRef = useRef(new Map<string, AnalysisResult>());
  const abortControllerRef = useRef<AbortController | null>(null);

  const analyzeImage = useCallback(async (
    imageUrl: string,
    options: Partial<AnalysisOptions> = {}
  ): Promise<AnalysisResult | null> => {
    const {
      useML = true,
      useHeuristics = true,
      confidenceThreshold = 0.3,
      enableCaching = true
    } = options;

    // Check cache first
    const cacheKey = `${imageUrl}-${JSON.stringify(options)}`;
    if (enableCaching && cacheRef.current.has(cacheKey)) {
      const cachedResult = cacheRef.current.get(cacheKey)!;
      setLastResult(cachedResult);
      return cachedResult;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const startTime = Date.now();
      
      // Load image
      setProgress(10);
      const imageElement = await loadImage(imageUrl);
      
      if (abortControllerRef.current.signal.aborted) {
        throw new Error('Analysis cancelled');
      }

      const results: Partial<AnalysisResult> = {
        regions: [],
        colorPalette: [],
        typography: [],
        confidence: 0
      };

      // Run heuristic analysis (fast)
      if (useHeuristics) {
        setProgress(30);
        console.log('🔍 Running heuristic analysis...');
        
        const heuristicRegions = await heuristicDetector.detectRegions(imageElement);
        results.regions = heuristicRegions.filter(r => r.confidence >= confidenceThreshold);
        
        if (abortControllerRef.current.signal.aborted) {
          throw new Error('Analysis cancelled');
        }
      }

      // Run ML analysis (slower but more accurate)
      if (useML) {
        setProgress(60);
        console.log('🤖 Running ML analysis...');
        
        try {
          const mlResult = await aiAnalyzer.analyzeImage(imageElement);
          
          if (abortControllerRef.current.signal.aborted) {
            throw new Error('Analysis cancelled');
          }

          // Merge ML results with heuristic results
          const mlRegions = mlResult.regions.filter(r => r.confidence >= confidenceThreshold);
          
          if (useHeuristics) {
            // Combine and deduplicate regions
            results.regions = combineRegions(results.regions!, mlRegions);
          } else {
            results.regions = mlRegions;
          }

          results.colorPalette = mlResult.colorPalette;
          results.typography = mlResult.typography;
          results.confidence = mlResult.confidence;
          
        } catch (mlError) {
          console.warn('ML analysis failed, using heuristic results only:', mlError);
          toast.warning('AI analysis failed, using basic detection');
          
          // Fallback to heuristic-only results
          if (!useHeuristics) {
            throw new Error('Both ML and heuristic analysis failed');
          }
        }
      }

      setProgress(90);

      // Post-process results
      results.regions = postProcessRegions(results.regions!);
      
      const processingTime = Date.now() - startTime;
      const finalResult: AnalysisResult = {
        regions: results.regions,
        colorPalette: results.colorPalette || [],
        typography: results.typography || [],
        confidence: results.confidence || 0.5,
        processingTime
      };

      setProgress(100);
      setLastResult(finalResult);

      // Cache the result
      if (enableCaching) {
        cacheRef.current.set(cacheKey, finalResult);
      }

      console.log(`✅ Analysis complete in ${processingTime}ms`);
      toast.success(`Analysis complete! Found ${finalResult.regions.length} regions`);

      return finalResult;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      console.error('❌ Analysis failed:', err);
      
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

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    toast.success('Analysis cache cleared');
  }, []);

  const retryLastAnalysis = useCallback(async () => {
    if (!lastResult) return null;
    
    // Find the last analysis parameters from cache
    const lastCacheEntry = Array.from(cacheRef.current.entries())
      .find(([, result]) => result === lastResult);
    
    if (lastCacheEntry) {
      const [cacheKey] = lastCacheEntry;
      const [imageUrl] = cacheKey.split('-');
      cacheRef.current.delete(cacheKey);
      return analyzeImage(imageUrl);
    }
    
    return null;
  }, [lastResult, analyzeImage]);

  return {
    analyzeImage,
    cancelAnalysis,
    clearCache,
    retryLastAnalysis,
    isAnalyzing,
    progress,
    lastResult,
    error,
    cacheSize: cacheRef.current.size
  };
};

// Helper functions

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const combineRegions = (heuristicRegions: DetectedRegion[], mlRegions: DetectedRegion[]): DetectedRegion[] => {
  const combined = [...heuristicRegions];
  
  for (const mlRegion of mlRegions) {
    // Check if this ML region overlaps significantly with any heuristic region
    const hasOverlap = heuristicRegions.some(hRegion => {
      const overlap = calculateOverlap(mlRegion.bounds, hRegion.bounds);
      return overlap > 0.5;
    });
    
    if (!hasOverlap) {
      combined.push(mlRegion);
    } else {
      // Replace heuristic region with ML region if ML has higher confidence
      const overlappingIndex = heuristicRegions.findIndex(hRegion => {
        const overlap = calculateOverlap(mlRegion.bounds, hRegion.bounds);
        return overlap > 0.5 && mlRegion.confidence > hRegion.confidence;
      });
      
      if (overlappingIndex !== -1) {
        combined[overlappingIndex] = mlRegion;
      }
    }
  }
  
  return combined;
};

const calculateOverlap = (bounds1: DetectedRegion['bounds'], bounds2: DetectedRegion['bounds']): number => {
  const x1 = Math.max(bounds1.x, bounds2.x);
  const y1 = Math.max(bounds1.y, bounds2.y);
  const x2 = Math.min(bounds1.x + bounds1.width, bounds2.x + bounds2.width);
  const y2 = Math.min(bounds1.y + bounds1.height, bounds2.y + bounds2.height);
  
  if (x2 <= x1 || y2 <= y1) return 0;
  
  const overlapArea = (x2 - x1) * (y2 - y1);
  const area1 = bounds1.width * bounds1.height;
  const area2 = bounds2.width * bounds2.height;
  
  return overlapArea / Math.min(area1, area2);
};

const postProcessRegions = (regions: DetectedRegion[]): DetectedRegion[] => {
  // Remove very small regions
  const minArea = 500;
  const filtered = regions.filter(region => 
    region.bounds.width * region.bounds.height >= minArea
  );
  
  // Sort by confidence (highest first)
  return filtered.sort((a, b) => b.confidence - a.confidence);
};
