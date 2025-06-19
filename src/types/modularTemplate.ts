
export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  scale?: number;
}

export interface ElementStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  blur?: number;
  shadow?: string;
}

export interface CardElement {
  id: string;
  type: 'frame' | 'nameplate' | 'logoPatch' | 'background' | 'textOverlay' | 'imageZone';
  name: string;
  position: ElementPosition;
  style: ElementStyle;
  content?: string;
  layer: number;
  isCustomizable: boolean;
  variants?: Partial<ElementStyle>[];
}

export interface ModularTemplate {
  id: string;
  name: string;
  description: string;
  category: 'sports' | 'entertainment' | 'minimal' | 'premium';
  aesthetic: 'minimal-grid' | 'cinematic' | 'neon-cyber' | 'vintage' | 'magazine' | 'polaroid' | 'comic' | 'holographic';
  is_premium: boolean;
  elements: CardElement[];
  colorSchemes: {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  }[];
  customization: {
    allowedElements: string[];
    presets: string[];
  };
  usage_count: number;
  tags: string[];
}
