
export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error' | 'editing';
  analysis?: {
    title: string;
    description: string;
    rarity: string;
    tags: string[];
    category: string;
    type: string;
    series: string;
    cardId?: string;
    aiGenerated?: boolean;
  };
  editData?: {
    cropArea: {
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
    };
    zoom: number;
    originalImageUrl: string;
    croppedImageUrl?: string;
  };
  error?: string;
}
