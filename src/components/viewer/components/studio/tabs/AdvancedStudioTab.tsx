
import React from 'react';
import { SurfaceSection } from '../sections/SurfaceSection';
import { useSectionManager } from '../hooks/useSectionManager';
import type { MaterialSettings } from '../../../types';

interface AdvancedStudioTabProps {
  materialSettings: MaterialSettings;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
}

export const AdvancedStudioTab: React.FC<AdvancedStudioTabProps> = ({
  materialSettings,
  onMaterialSettingsChange
}) => {
  const { sectionStates, setSectionState } = useSectionManager();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-medium text-lg mb-2 flex items-center justify-center">
          ⚡ Advanced Materials
        </h3>
        <p className="text-crd-lightGray text-sm mb-4">
          Fine-tune surface materials and texture properties
        </p>
      </div>

      {/* Surface Section */}
      <SurfaceSection
        materialSettings={materialSettings}
        isOpen={sectionStates.materials}
        onToggle={(isOpen) => setSectionState('materials', isOpen)}
        onMaterialSettingsChange={onMaterialSettingsChange}
      />
    </div>
  );
};
