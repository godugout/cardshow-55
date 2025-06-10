
import type { SpaceEnvironment } from '../../types';
import type { Local360Image } from '../LocalImageLibrary';

interface ExposureCalculationParams {
  config: SpaceEnvironment['config'];
  imageConfig: Local360Image;
}

export const calculateExposure = ({ config, imageConfig }: ExposureCalculationParams): number => {
  const baseExposure = config.exposure || imageConfig.lighting.intensity;
  const contrastMultiplier = imageConfig.lighting.contrast || 1.0;
  const warmthAdjustment = (imageConfig.lighting.warmth - 0.5) * 0.2; // -0.1 to +0.1
  
  const finalExposure = baseExposure * contrastMultiplier + warmthAdjustment;
  
  // Clamp exposure to reasonable range
  return Math.max(0.1, Math.min(3.0, finalExposure));
};
