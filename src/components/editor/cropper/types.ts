
export interface CropArea {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  type: 'main' | 'frame' | 'element';
  color: string;
  selected?: boolean;
  visible?: boolean;
  cornerRadius?: number;
  aspectRatio?: number;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
}

export interface CropperState {
  cropAreas: CropArea[];
  selectedCropIds: string[];
  isDragging: boolean;
  dragHandle: DragHandle | null;
  dragStart: { x: number; y: number };
  imageLoaded: boolean;
  zoom: number;
  showPreview: boolean;
  isExtracting: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  activeTool: 'select' | 'crop' | 'rotate' | 'zoom';
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  description: string;
  cropAreas: CropArea[];
}

export type DragHandle = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r' | 'move' | 'rotate' | null;

export interface CropperProps {
  imageUrl: string;
  onCropComplete: (crops: { main?: string; frame?: string; elements?: string[]; }) => void;
  onCancel: () => void;
  aspectRatio?: number;
  className?: string;
}
