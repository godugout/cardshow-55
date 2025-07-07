import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { CardData } from '@/types/card';
import { Card3DPositioned } from './components/Card3DPositioned';
import { StudioScene } from './components/StudioScene';
import { BackgroundAnalyzer } from './utils/BackgroundAnalyzer';

interface StudioCardManagerProps {
  cards: CardData[];
  selectedCardIndex: number;
  backgroundImage?: string;
  onCardSelect: (index: number) => void;
  onPositionChange?: (cardId: string, position: THREE.Vector3) => void;
  enableInteraction?: boolean;
  showGrid?: boolean;
  cameraControls?: boolean;
}

interface CardPosition {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  isSelected: boolean;
}

const FOREST_CONVERGENCE_POINT = new THREE.Vector3(0, -80, -50);
const DEFAULT_CARD_SPACING = 5;
const SELECTED_CARD_SCALE = 1.2;
const DEFAULT_CARD_SCALE = 1.0;

// Camera controller component
const CameraController: React.FC<{
  targetPosition: THREE.Vector3;
  selectedCardPosition: THREE.Vector3;
}> = ({ targetPosition, selectedCardPosition }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Smoothly move camera to focus on selected card
    const idealPosition = selectedCardPosition.clone().add(new THREE.Vector3(0, 2, 8));
    camera.position.lerp(idealPosition, 0.05);
    camera.lookAt(selectedCardPosition);
  });

  return null;
};

export const StudioCardManager: React.FC<StudioCardManagerProps> = ({
  cards,
  selectedCardIndex = 0,
  backgroundImage,
  onCardSelect,
  onPositionChange,
  enableInteraction = true,
  showGrid = true,
  cameraControls = true
}) => {
  const [cardPositions, setCardPositions] = useState<CardPosition[]>([]);
  const [convergencePoint, setConvergencePoint] = useState<THREE.Vector3>(FOREST_CONVERGENCE_POINT);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate optimal card positions based on background analysis
  const calculateCardPositions = useMemo(() => {
    if (!cards.length) return [];

    const analyzer = new BackgroundAnalyzer();
    let convergence = FOREST_CONVERGENCE_POINT;

    // Analyze background image if provided
    if (backgroundImage) {
      const analysisResult = analyzer.analyzeImage(backgroundImage);
      if (analysisResult.convergencePoint) {
        convergence = new THREE.Vector3(
          analysisResult.convergencePoint.x,
          analysisResult.convergencePoint.y,
          analysisResult.convergencePoint.z
        );
        setConvergencePoint(convergence);
      }
    }

    // Calculate positions in a formation that leads to the convergence point
    return cards.map((card, index) => {
      const isSelected = index === selectedCardIndex;
      
      // Create a circular formation around the convergence point
      const angle = (index / cards.length) * Math.PI * 2;
      const radius = 10 + (index * 2); // Vary depth for visual interest
      
      const position = new THREE.Vector3(
        convergence.x + Math.cos(angle) * radius,
        convergence.y + 5 + (index * 1.5), // Slight vertical offset
        convergence.z + Math.sin(angle) * radius
      );

      // Selected card moves closer to camera
      if (isSelected) {
        position.z += 15;
        position.y += 2;
      }

      return {
        id: card.id,
        position,
        rotation: new THREE.Euler(0, angle + Math.PI, 0), // Face towards center
        scale: isSelected ? SELECTED_CARD_SCALE : DEFAULT_CARD_SCALE,
        isSelected
      };
    });
  }, [cards, selectedCardIndex, backgroundImage, convergencePoint]);

  // Update card positions when cards or selection changes
  useEffect(() => {
    setCardPositions(calculateCardPositions);
  }, [calculateCardPositions]);

  // Handle card click
  const handleCardClick = (cardIndex: number) => {
    if (!enableInteraction) return;
    
    console.log(`🎯 StudioCardManager: Card ${cardIndex} clicked`);
    onCardSelect(cardIndex);
  };

  // Get selected card position for camera control
  const selectedCardPosition = useMemo(() => {
    const selectedCard = cardPositions.find(pos => pos.isSelected);
    return selectedCard?.position || new THREE.Vector3(0, 0, 0);
  }, [cardPositions]);

  return (
    <div className="relative w-full h-screen">
      <Canvas
        ref={canvasRef}
        camera={{ 
          position: [0, 5, 20], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Lighting Setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Environment */}
        <Environment preset="studio" />

        {/* Studio Scene Background */}
        <StudioScene 
          backgroundImage={backgroundImage}
          convergencePoint={convergencePoint}
          showGrid={showGrid}
        />

        {/* Render Cards in 3D Space */}
        {cardPositions.map((cardPos, index) => (
          <Card3DPositioned
            key={cardPos.id}
            card={cards[index]}
            position={cardPos.position}
            rotation={cardPos.rotation}
            scale={cardPos.scale}
            isSelected={cardPos.isSelected}
            onClick={() => handleCardClick(index)}
            onPositionChange={(newPosition) => {
              onPositionChange?.(cardPos.id, newPosition);
            }}
            enableDrag={enableInteraction}
          />
        ))}

        {/* Camera Controls */}
        {cameraControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            target={selectedCardPosition}
          />
        )}

        <CameraController
          targetPosition={convergencePoint}
          selectedCardPosition={selectedCardPosition}
        />
      </Canvas>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && cards.length > 0 && (
        <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          <div>Cards: {cards.length}</div>
          <div>Selected: {selectedCardIndex}</div>
          <div>Convergence: {convergencePoint.toArray().map(n => n.toFixed(1)).join(', ')}</div>
        </div>
      )}

      {/* Card Navigation */}
      {cards.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === selectedCardIndex
                  ? 'bg-crd-blue scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudioCardManager;