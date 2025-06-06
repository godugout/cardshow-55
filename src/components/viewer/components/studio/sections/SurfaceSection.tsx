
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { MaterialPropertiesSection } from '../../MaterialPropertiesSection';
import type { MaterialSettings } from '../../../types';

interface SurfaceSectionProps {
  materialSettings: MaterialSettings;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
}

export const SurfaceSection: React.FC<SurfaceSectionProps> = ({
  materialSettings,
  isOpen,
  onToggle,
  onMaterialSettingsChange
}) => {
  return (
    <CollapsibleSection
      title="Surface"
      emoji="💎"
      statusText="Custom Settings"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <MaterialPropertiesSection
        materialSettings={materialSettings}
        onMaterialSettingsChange={onMaterialSettingsChange}
      />
    </CollapsibleSection>
  );
};
