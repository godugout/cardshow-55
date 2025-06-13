
// Simplified card type for display components
export interface DisplayCard {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  price?: number;
  rarity?: string;
  tags?: string[];
  created_at?: string;
  creator_id?: string;
}
