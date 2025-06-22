
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Card {
  id: string;
  name: string;
  image: string;
  rarity: CardRarity;
  type: string;
  stats?: Record<string, number>;
  description?: string;
  favorite?: boolean;
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
  collection: Card[];
}

export interface TradeOffer {
  id: string;
  fromUser: string;
  toUser: string;
  offeredCards: Card[];
  requestedCards: Card[];
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}
