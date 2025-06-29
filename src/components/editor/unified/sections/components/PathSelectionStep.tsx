
import React from 'react';
import { MediaPathDetector } from './MediaPathDetector';

interface PathSelectionStepProps {
  mediaDetection: any;
  selectedMediaPath: string;
  onPathSelect: (pathId: string) => void;
}

export const PathSelectionStep: React.FC<PathSelectionStepProps> = ({
  mediaDetection,
  selectedMediaPath,
  onPathSelect
}) => {
  if (!mediaDetection) return null;

  return (
    <MediaPathDetector
      detectedFormat={mediaDetection.format}
      fileSize={1024 * 1024} // Placeholder size
      fileName={mediaDetection.format}
      onPathSelect={onPathSelect}
      selectedPath={selectedMediaPath}
    />
  );
};
