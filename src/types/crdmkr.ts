
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
  category: string;
  preview_url: string;
  description: string;
  template_data: Record<string, any>;
  is_premium: boolean;
  usage_count: number;
  tags: string[];
  sourceType: 'crdmkr' | 'crdmkr-generated';
  sourceFile: string;
  fabricData?: any;
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
  aiAnalysis?: {
    confidence: number;
    detectedRegions: DetectedRegion[];
    dominantColors: string[];
    suggestedRarity: string;
    contentType: string;
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
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
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

export type ProcessingJobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface ProcessingJob {
  id: string;
  userId: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  status: ProcessingJobStatus;
  progress?: number;
  result?: any;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
