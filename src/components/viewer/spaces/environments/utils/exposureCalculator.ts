
import type { Local360Image } from '../LocalImageLibrary';
import type { SpaceEnvironment } from '../../types';

interface CalculateExposureProps {
  config: SpaceEnvironment['config'];
  imageConfig: Local360Image;
}

export const calculateExposure = ({ config, imageConfig }: CalculateExposureProps) => {
  // Enhanced exposure calculation
  const baseExposure = config.exposure || imageConfig.lighting.intensity;
  const finalExposure = Math.max(0.5, Math.min(3.0, baseExposure * 1.2));
  
  console.log('💡 Exposure calculated:', {
    baseExposure,
    finalExposure,
    configExposure: config.exposure,
    lightingIntensity: imageConfig.lighting.intensity
  });

  return finalExposure;
};
