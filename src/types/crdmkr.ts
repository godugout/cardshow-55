
import type { DesignTemplate } from './card';

// Processing job status
export type ProcessingJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

// CRDMKR-specific extensions to existing types
export interface CRDMKRTemplate extends DesignTemplate {
  sourceType: 'crdmkr';
  sourceFile?: string;
  fabricData?: any; // Serialized fabric.js canvas
  layers: CRDLayer[];
  parameters: TemplateParameter[];
  aiAnalysis?: {
    confidence: number;
    detectedRegions: DetectedRegion[];
    colorPalette: string[];
    typography: FontAnalysis[];
  };
}

export interface CRDLayer {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image' | 'effect' | 'group';
  fabricObject?: any; // fabric.Object reference
  position: { x: number; y: number; z: number };
  dimensions: { width: number; height: number };
  styles: LayerStyles;
  customizable: boolean;
  parameterKey?: string;
  visible?: boolean;
  locked?: boolean;
}

export interface LayerStyles {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  filters?: string[];
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface TemplateParameter {
  key: string;
  type: 'color' | 'text' | 'image' | 'logo';
  defaultValue: any;
  fabricPropertyPath?: string; // e.g., 'fill', 'stroke', 'text'
  constraints?: ParameterConstraints;
  uiLabel: string;
  category: 'team' | 'player' | 'design';
}

export interface ParameterConstraints {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  allowedValues?: any[];
  required?: boolean;
}

export interface DetectedRegion {
  id: string;
  type: 'photo' | 'text' | 'logo' | 'border' | 'background' | 'decoration';
  bounds: { x: number; y: number; width: number; height: number };
  confidence: number;
  layerIds: string[];
}

export interface FontAnalysis {
  family: string;
  size: number;
  weight: string | number;
  color: string;
  usage: 'title' | 'body' | 'caption' | 'stats';
}

export interface ProcessingJob {
  id: string;
  userId: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  status: ProcessingJobStatus;
  progress: number;
  result?: any;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamVariation {
  id: string;
  templateId: string;
  teamName: string;
  teamColors: Record<string, string>;
  teamLogos: Record<string, string>;
  parameterOverrides: Record<string, any>;
  generatedSvg?: string;
  generatedCss?: string;
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
}
