
export interface CardData {
  id: string;
  title: string;
  image_url: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  creator?: {
    id: string;
    name: string;
  };
  metadata?: {
    rarity?: string;
    effects?: {
      holographic?: boolean;
      chrome?: boolean;
      foil?: boolean;
    };
  };
}
