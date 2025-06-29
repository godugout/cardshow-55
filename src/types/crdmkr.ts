
export interface DetectedRegion {
  id: string;
  type: 'photo' | 'text' | 'logo' | 'border' | 'background' | 'decoration';
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  layerIds: string[];
}

export interface FontAnalysis {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  textAlign: string;
}

export interface CRDMKRTemplate {
  id: string;
  name: string;
  sourceFile: string;
  dimensions: {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape' | 'square';
  };
  layers: CRDLayer[];
  parameters: TemplateParameter[];
  colorPalette: ColorScheme;
  typography: FontAnalysis[];
  metadata: {
    createdAt: Date;
    processedBy: 'ai' | 'manual';
    accuracy: number;
  };
}

export interface CRDLayer {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image' | 'effect' | 'group';
  position: { x: number; y: number; z: number };
  dimensions: { width: number; height: number };
  styles: LayerStyles;
  customizable: boolean;
  parameterKey?: string;
}

export interface TemplateParameter {
  key: string;
  type: 'color' | 'text' | 'image' | 'logo';
  defaultValue: any;
  constraints?: ParameterConstraints;
  uiLabel: string;
  category: 'team' | 'player' | 'design';
}

export interface LayerStyles {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  blendMode?: string;
}

export interface ParameterConstraints {
  min?: number;
  max?: number;
  options?: string[];
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}
