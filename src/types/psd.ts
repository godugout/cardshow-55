
export interface PSDLayer {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'group';
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  content?: {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    imageData?: string;
  };
  styleProperties?: {
    opacity?: number;
    blendMode?: string;
    effects?: any[];
  };
  visible: boolean;
  opacity?: number;
  children?: PSDLayer[];
}
