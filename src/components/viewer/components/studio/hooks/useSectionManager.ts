
import { useState, useCallback } from 'react';

interface SectionStates {
  styles: boolean;
  effects: boolean;
  environment: boolean;
  materials: boolean;
}

interface SectionManager {
  sectionStates: SectionStates;
  toggleSection: (section: keyof SectionStates) => void;
  setSectionState: (section: keyof SectionStates, isOpen: boolean) => void;
}

export const useSectionManager = (): SectionManager => {
  const [sectionStates, setSectionStates] = useState<SectionStates>(() => {
    const stored = localStorage.getItem('studio-panel-sections');
    const defaults: SectionStates = {
      styles: true,
      effects: false,
      environment: false,
      materials: false
    };
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  });

  const setSectionState = useCallback((section: keyof SectionStates, isOpen: boolean) => {
    const newStates = { ...sectionStates, [section]: isOpen };
    setSectionStates(newStates);
    localStorage.setItem('studio-panel-sections', JSON.stringify(newStates));
  }, [sectionStates]);

  const toggleSection = useCallback((section: keyof SectionStates) => {
    setSectionState(section, !sectionStates[section]);
  }, [sectionStates, setSectionState]);

  return {
    sectionStates,
    toggleSection,
    setSectionState
  };
};
