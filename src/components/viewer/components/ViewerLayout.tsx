
import React, { useMemo } from 'react';
import { ViewerHeader } from './ViewerHeader';
import { StudioPanel } from './StudioPanel';
import { BackgroundRenderer } from './BackgroundRenderer';
import { EnhancedCardContainer } from './EnhancedCardContainer';
import { cardAdapter, simpleCardToCardData } from '../utils/cardAdapter';
import type { BackgroundType, EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import type { SpaceEnvironment, SpaceControls } from '../spaces/types';

interface ViewerLayoutProps {
  card: any;
  isStudioVisible: boolean;
  onClose: () => void;
  onOpenStudio: () => void;
  onCloseStudio: () => void;
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
  effectValues: any;
  handleEffectChange: any;
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  showEffects: boolean;
  showBackgroundInfo: boolean;
  selectedPresetId?: string;
  setSelectedPresetId: (id?: string) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleCardClick: () => void;
  handleCameraReset: () => void;
  handleApplyCombo: (combo: any) => void;
  isApplyingPreset: boolean;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = ({
  card,
  isStudioVisible,
  onClose,
  onOpenStudio,
  onCloseStudio,
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
  setInteractiveLighting,
  effectValues,
  handleEffectChange,
  rotation,
  zoom,
  isDragging,
  mousePosition,
  isHovering,
  showEffects,
  showBackgroundInfo,
  selectedPresetId,
  setSelectedPresetId,
  handleMouseDown,
  handleMouseMove,
  handleMouseEnter,
  handleMouseLeave,
  handleCardClick,
  handleCameraReset,
  handleApplyCombo,
  isApplyingPreset
}) => {
  const fullCardData = useMemo(() => simpleCardToCardData(cardAdapter(card)), [card]);
  const adaptedCard = useMemo(() => cardAdapter(card), [card]);
  
  // Create mock frame styles and enhanced effect styles
  const frameStyles = useMemo(() => ({}), []);
  const enhancedEffectStyles = useMemo(() => ({}), []);
  const SurfaceTexture = useMemo(() => null, []);

  return (
    <div className="fixed inset-0 bg-crd-darkest z-40 flex">
      {/* Background Layer - Always at z-0 */}
      <BackgroundRenderer
        backgroundType={backgroundType}
        selectedSpace={selectedSpace}
        spaceControls={spaceControls}
        adaptedCard={adaptedCard}
        onCardClick={handleCardClick}
        onCameraReset={handleCameraReset}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        mousePosition={mousePosition}
        isHovering={isHovering}
        effectValues={effectValues}
        materialSettings={materialSettings}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
      />

      {/* Main 3D Card Layer - Always rendered at z-10 */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
        <EnhancedCardContainer
          card={fullCardData}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          rotation={rotation}
          zoom={zoom}
          isDragging={isDragging}
          frameStyles={frameStyles}
          enhancedEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          interactiveLighting={interactiveLighting}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          showBackgroundInfo={showBackgroundInfo}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          environmentControls={environmentControls}
        />
      </div>

      {/* Header - z-30 */}
      <ViewerHeader
        onClose={onClose}
        showStudioButton={!isStudioVisible}
        onOpenStudio={onOpenStudio}
      />

      {/* Studio Panel - z-50 */}
      <StudioPanel
        isVisible={isStudioVisible}
        onClose={onCloseStudio}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        effectValues={effectValues}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        materialSettings={materialSettings}
        onSceneChange={setSelectedScene}
        onLightingChange={setSelectedLighting}
        onEffectChange={handleEffectChange}
        onBrightnessChange={setOverallBrightness}
        onInteractiveLightingToggle={() => setInteractiveLighting(!interactiveLighting)}
        onMaterialSettingsChange={setMaterialSettings}
        selectedPresetId={selectedPresetId}
        onPresetSelect={setSelectedPresetId}
        onApplyCombo={handleApplyCombo}
        isApplyingPreset={isApplyingPreset}
        environmentControls={environmentControls}
        onEnvironmentControlsChange={setEnvironmentControls}
        backgroundType={backgroundType}
        onBackgroundTypeChange={setBackgroundType}
        onSpaceChange={setSelectedSpace}
        selectedSpace={selectedSpace}
        spaceControls={spaceControls}
        onSpaceControlsChange={setSpaceControls}
        onResetCamera={handleCameraReset}
      />
    </div>
  );
};
