
export interface CardData {
  id: string;
  title: string;
  description: string;
  image_url: string;
  rarity: string;
  category: string;
  tags: string[];
  design_metadata: Record<string, any>;
  effects: {
    holographic: boolean;
    foil: boolean;
    chrome: boolean;
  };
}
