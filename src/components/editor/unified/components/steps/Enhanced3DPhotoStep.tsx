
import React, { useState, useCallback, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, PerspectiveCamera } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Image, ArrowRight, RotateCw, Move3D, Sparkles, X } from 'lucide-react';
import { EnhancedImageCropper } from '../../sections/components/EnhancedImageCropper';
import { toast } from 'sonner';
import * as THREE from 'three';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface Enhanced3DPhotoStepProps {
  mode: CreationMode;
  selectedPhoto?: string;
  onPhotoSelect: (photo: string) => void;
  cardData?: CardData;
  onMoveToEffects?: () => void;
}

// 3D Card Component
const Card3D = ({ imageUrl, isAnimating }: { imageUrl: string; isAnimating: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load texture
  React.useEffect(() => {
    if (imageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(imageUrl, (loadedTexture) => {
        loadedTexture.flipY = false;
        setTexture(loadedTexture);
      });
    }
  }, [imageUrl]);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      if (isAnimating) {
        // Gentle floating animation
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      }
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {/* Card geometry - trading card proportions */}
      <boxGeometry args={[2.5, 3.5, 0.1]} />
      <meshStandardMaterial 
        map={texture} 
        roughness={0.1}
        metalness={0.1}
      />
      
      {/* Card back */}
      <mesh position={[0, 0, -0.051]}>
        <boxGeometry args={[2.5, 3.5, 0.001]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      
      {/* Subtle glow effect */}
      <mesh position={[0, 0, 0]} scale={[1.02, 1.02, 1]}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshBasicMaterial 
          color="#00ff88" 
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </mesh>
  );
};

// 3D Scene Component
const Card3DScene = ({ imageUrl, onContinue }: { imageUrl: string; onContinue: () => void }) => {
  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-crd-darkest to-crd-darker rounded-xl overflow-hidden">
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-3">
        <div className="flex items-center gap-2 text-crd-green text-sm">
          <Move3D className="w-4 h-4" />
          <span>Drag to rotate • Scroll to zoom</span>
        </div>
      </div>

      {/* Continue Button */}
      <div className="absolute bottom-6 right-6 z-10">
        <CRDButton
          onClick={onContinue}
          className="bg-crd-green hover:bg-crd-green/80 text-black px-6 py-3 text-lg font-semibold shadow-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Continue to Effects
          <ArrowRight className="w-5 h-5 ml-2" />
        </CRDButton>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#00ff88" />
        
        {/* Card */}
        <Suspense fallback={null}>
          <Card3D imageUrl={imageUrl} isAnimating={true} />
        </Suspense>
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={false}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
        
        {/* Ground plane for shadows */}
        <mesh receiveShadow position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            transparent 
            opacity={0.1}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

export const Enhanced3DPhotoStep = ({ 
  mode, 
  selectedPhoto, 
  onPhotoSelect, 
  cardData,
  onMoveToEffects
}: Enhanced3DPhotoStepProps) => {
  const [showCropper, setShowCropper] = useState(false);
  const [show3DPreview, setShow3DPreview] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📸 Enhanced3DPhotoStep: File selected:', file.name);
    
    try {
      const url = URL.createObjectURL(file);
      onPhotoSelect(url);
      setShowCropper(true);
    } catch (error) {
      console.error('📸 Enhanced3DPhotoStep: Error creating object URL:', error);
      toast.error('Failed to load image');
    }
  }, [onPhotoSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onPhotoSelect(url);
      setShowCropper(true);
    }
  }, [onPhotoSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    console.log('✂️ Enhanced3DPhotoStep: Crop completed, transitioning to 3D preview');
    setCroppedImageUrl(croppedImageUrl);
    onPhotoSelect(croppedImageUrl);
    setShowCropper(false);
    
    // Small delay for smooth transition
    setTimeout(() => {
      setShow3DPreview(true);
      toast.success('Perfect crop! Your card is ready in 3D', {
        description: 'Rotate and zoom to see your creation from every angle'
      });
    }, 300);
  }, [onPhotoSelect]);

  const handleContinueToEffects = useCallback(() => {
    console.log('✨ Enhanced3DPhotoStep: Moving to effects step');
    if (onMoveToEffects) {
      onMoveToEffects();
    }
  }, [onMoveToEffects]);

  const handleRemovePhoto = () => {
    onPhotoSelect('');
    setCroppedImageUrl('');
    setShowCropper(false);
    setShow3DPreview(false);
  };

  // Show cropper interface
  if (showCropper && selectedPhoto) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-crd-white mb-2">Perfect Your Card Image</h2>
          <p className="text-crd-lightGray text-lg">
            Crop your image to create the perfect trading card
          </p>
        </div>
        
        <div className="relative">
          <EnhancedImageCropper
            imageUrl={selectedPhoto}
            onCropComplete={handleCropComplete}
            className="max-w-3xl mx-auto"
          />
          
          {/* Cancel cropping */}
          <div className="absolute top-4 right-4">
            <CRDButton
              size="sm"
              onClick={() => setShowCropper(false)}
              className="bg-red-500 hover:bg-red-600 text-white p-2"
            >
              <X className="w-4 h-4" />
            </CRDButton>
          </div>
        </div>
      </div>
    );
  }

  // Show 3D preview after cropping
  if (show3DPreview && croppedImageUrl) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-crd-white mb-2">Your Card in 3D</h2>
          <p className="text-crd-lightGray text-lg">
            Rotate, zoom, and explore your creation before adding effects
          </p>
        </div>
        
        <Card3DScene 
          imageUrl={croppedImageUrl} 
          onContinue={handleContinueToEffects}
        />
        
        {/* Options below 3D view */}
        <div className="flex justify-center gap-4">
          <CRDButton
            variant="outline"
            onClick={() => setShow3DPreview(false)}
            className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Crop Again
          </CRDButton>
          <CRDButton
            variant="outline"
            onClick={handleRemovePhoto}
            className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
          >
            Start Over
          </CRDButton>
        </div>
      </div>
    );
  }

  // Initial upload interface
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-crd-white mb-4">Create Your 3D Trading Card</h2>
        <p className="text-crd-lightGray text-lg">
          Upload your photo to see it transform into a stunning 3D card
        </p>
      </div>

      {/* Upload Area */}
      <div className="flex justify-center">
        <div
          className={`w-96 h-80 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all ${
            isDragActive 
              ? 'border-crd-green bg-crd-green/5 scale-105' 
              : 'border-crd-mediumGray/50 hover:border-crd-green/50 bg-crd-darker/20'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('photo-input')?.click()}
        >
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto transition-all ${
              isDragActive ? 'bg-crd-green/20' : 'bg-crd-mediumGray/20'
            }`}>
              {isDragActive ? (
                <Upload className="w-10 h-10 text-crd-green animate-bounce" />
              ) : (
                <Image className="w-10 h-10 text-crd-mediumGray" />
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-crd-white mb-2">
              {isDragActive ? 'Drop to Create!' : 'Upload Your Photo'}
            </h3>
            <p className="text-crd-lightGray mb-6 max-w-xs">
              {isDragActive 
                ? 'Release to transform your photo into a 3D card'
                : 'Drag & drop an image or click to browse'
              }
            </p>
            
            {!isDragActive && (
              <CRDButton variant="primary" className="bg-crd-green hover:bg-crd-green/80 text-black">
                <Upload className="w-5 h-5 mr-2" />
                Choose Photo
              </CRDButton>
            )}
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <Card className="bg-crd-darker border-crd-mediumGray/20 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-crd-green" />
            What to Expect
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-crd-green" />
              </div>
              <h4 className="text-crd-white font-medium">Smart Crop</h4>
              <p className="text-crd-lightGray text-sm">
                Intelligent cropping tools for perfect card proportions
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mx-auto">
                <Move3D className="w-6 h-6 text-crd-green" />
              </div>
              <h4 className="text-crd-white font-medium">3D Preview</h4>
              <p className="text-crd-lightGray text-sm">
                See your card in stunning 3D with rotation controls
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-crd-green" />
              </div>
              <h4 className="text-crd-white font-medium">Live Effects</h4>
              <p className="text-crd-lightGray text-sm">
                Apply holographic and premium effects in real-time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
