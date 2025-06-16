
export interface CropArea {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'main' | 'frame' | 'element';
  color: string;
  selected: boolean;
}

export interface CropperState {
  cropAreas: CropArea[];
  selectedCropId: string | null;
  isDragging: boolean;
  dragHandle: string | null;
  dragStart: { x: number; y: number };
  imageLoaded: boolean;
  zoom: number;
  showPreview: boolean;
  isExtracting: boolean;
}

export interface CropperProps {
  imageUrl: string;
  onCropComplete: (crops: { main?: string; frame?: string; elements?: string[] }) => void;
  onCancel: () => void;
  aspectRatio?: number;
  className?: string;
}
