
export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
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
  error?: string;
}
