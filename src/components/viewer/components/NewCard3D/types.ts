
export interface Card3DProps {
  frontImage: string;
  backImage?: string;
  title?: string;
  className?: string;
  onClick?: () => void;
  onFlip?: (isFlipped: boolean) => void;
  interactive?: boolean;
  autoRotate?: boolean;
  effects?: EffectConfig;
}

export interface EffectConfig {
  holographic?: number;
  chrome?: number;
  foil?: number;
  brightness?: number;
}

export interface Card3DState {
  isFlipped: boolean;
  isHovering: boolean;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
}
