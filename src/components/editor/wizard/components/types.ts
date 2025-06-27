
import type { CardRarity, CardVisibility, CreatorAttribution } from '@/hooks/useCardEditor';

export interface CardData {
  title: string;
  description?: string;
  rarity: CardRarity;
  tags: string[];
  type?: string;
  series?: string;
  image_url?: string;
  visibility?: CardVisibility;
  creator_attribution?: CreatorAttribution;
}

export interface CardDetailsStepProps {
  cardData: Partial<CardData>;
  onFieldUpdate: <K extends keyof CardData>(field: K, value: any) => void;
  onCreatorAttributionUpdate: (key: keyof CreatorAttribution, value: any) => void;
  aiAnalysisComplete?: boolean;
}
