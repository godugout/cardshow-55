
import React from 'react';
import { useViewerState } from '../hooks/useViewerState';
import type { BackgroundType, EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import type { SpaceEnvironment, SpaceControls } from '../spaces/types';

interface ViewerStateManagerProps {
  children: (state: {
    backgroundType: BackgroundType;
    setBackgroundType: (type: BackgroundType) => void;
    selectedSpace: SpaceEnvironment | null;
    setSelectedSpace: (space: SpaceEnvironment | null) => void;
    spaceControls: SpaceControls;
    setSpaceControls: (controls: SpaceControls) => void;
    selectedScene: EnvironmentScene;
    setSelectedScene: (scene: EnvironmentScene) => void;
    selectedLighting: LightingPreset;
    setSelectedLighting: (lighting: LightingPreset) => void;
    materialSettings: MaterialSettings;
    setMaterialSettings: (settings: MaterialSettings) => void;
    environmentControls: EnvironmentControls;
    setEnvironmentControls: (controls: EnvironmentControls) => void;
    overallBrightness: number[];
    setOverallBrightness: (brightness: number[]) => void;
    interactiveLighting: boolean;
    setInteractiveLighting: (enabled: boolean) => void;
  }) => React.ReactNode;
}

export const ViewerStateManager: React.FC<ViewerStateManagerProps> = ({ children }) => {
  const {
    backgroundType,
    setBackgroundType,
    selectedSpace,
    setSelectedSpace,
    spaceControls,
    setSpaceControls,
    selectedScene,
    setSelectedScene,
    selectedLighting,
    setSelectedLighting,
    materialSettings,
    setMaterialSettings,
    environmentControls,
    setEnvironmentControls,
    overallBrightness,
    setOverallBrightness,
    interactiveLighting,
    setInteractiveLighting
  } = useViewerState();

  return (
    <>
      {children({
        backgroundType,
        setBackgroundType,
        selectedSpace,
        setSelectedSpace,
        spaceControls,
        setSpaceControls,
        selectedScene,
        setSelectedScene,
        selectedLighting,
        setSelectedLighting,
        materialSettings,
        setMaterialSettings,
        environmentControls,
        setEnvironmentControls,
        overallBrightness,
        setOverallBrightness,
        interactiveLighting,
        setInteractiveLighting
      })}
    </>
  );
};
