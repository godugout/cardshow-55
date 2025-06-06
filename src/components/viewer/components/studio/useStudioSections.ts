
import { useState, useCallback } from 'react';

interface SectionStates {
  effects: boolean;
  environment: boolean;
  materials: boolean;
}

export const useStudioSections = () => {
  const [sectionStates, setSectionStates] = useState<SectionStates>(() => {
    const stored = localStorage.getItem('studio-panel-sections');
    const defaults: SectionStates = {
      effects: true, // Always show effects by default
      environment: false,
      materials: false
    };
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  });

  const handleSectionToggle = useCallback((section: string, isOpen: boolean) => {
    const newStates = { ...sectionStates, [section]: isOpen };
    setSectionStates(newStates);
    localStorage.setItem('studio-panel-sections', JSON.stringify(newStates));
  }, [sectionStates]);

  return {
    sectionStates,
    handleSectionToggle
  };
};
