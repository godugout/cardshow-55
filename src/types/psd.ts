export interface PSDLayer {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'group';
  bounds?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  opacity?: number;
  visible?: boolean;
  children?: PSDLayer[];
  content?: string;
  imageData?: string;
}