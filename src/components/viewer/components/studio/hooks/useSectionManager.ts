
import { useState } from 'react';

export interface SectionStates {
  styles: boolean;
  effects: boolean;
  environment: boolean;
  lighting: boolean;
  materials: boolean;
  spaces: boolean;
}

export const useSectionManager = () => {
  const [sectionStates, setSectionStates] = useState<SectionStates>({
    styles: true, // Default open
    effects: false,
    environment: false,
    lighting: false,
    materials: false,
    spaces: false
  });

  const setSectionState = (section: keyof SectionStates, isOpen: boolean) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: isOpen
    }));
  };

  return {
    sectionStates,
    setSectionState
  };
};
