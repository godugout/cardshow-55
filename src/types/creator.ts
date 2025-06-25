
export interface CreatorProfile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  avatar?: string;
  bannerImage?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  creatorLevel: 'novice' | 'intermediate' | 'professional' | 'master';
  specialties: string[];
  totalEarnings: number;
  cardsCreated: number;
  followersCount: number;
  averageRating: number;
  joinedDate: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
    portfolio?: string;
  };
}

export interface DesignProject {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  templateId?: string;
  layers: DesignLayer[];
  canvas: CanvasSettings;
  version: number;
  status: 'draft' | 'published' | 'archived';
  collaborators: ProjectCollaborator[];
  lastModified: string;
  createdAt: string;
  metadata: {
    category: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number; // in minutes
  };
}

export interface DesignLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'effect' | 'background';
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  zIndex: number;
  properties: LayerProperties;
  effects: LayerEffect[];
}

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light' | 'color-dodge' | 'color-burn' | 'darken' | 'lighten';

export interface LayerProperties {
  // Image layer properties
  src?: string;
  crop?: { x: number; y: number; width: number; height: number };
  filters?: ImageFilter[];
  
  // Text layer properties
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
  
  // Shape layer properties
  shapeType?: 'rectangle' | 'circle' | 'polygon' | 'path';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
}

export interface ImageFilter {
  type: 'blur' | 'brightness' | 'contrast' | 'saturation' | 'hue-rotate' | 'sepia' | 'grayscale';
  value: number;
}

export interface LayerEffect {
  type: 'drop-shadow' | 'inner-shadow' | 'glow' | 'bevel' | 'gradient-overlay';
  enabled: boolean;
  properties: Record<string, any>;
}

export interface CanvasSettings {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  dpi: number;
  format: 'card' | 'poster' | 'banner' | 'square' | 'custom';
}

export interface ProjectCollaborator {
  userId: string;
  username: string;
  role: 'owner' | 'editor' | 'viewer' | 'commenter';
  permissions: string[];
  invitedAt: string;
  joinedAt?: string;
}

export interface CreatorTemplate {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  previewImages: string[];
  category: string;
  tags: string[];
  price: number;
  currency: string;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  layers: DesignLayer[];
  canvas: CanvasSettings;
  license: 'personal' | 'commercial' | 'extended';
  compatibility: string[];
  fileSize: number;
  lastUpdated: string;
  createdAt: string;
}

export interface CreatorEarnings {
  id: string;
  creatorId: string;
  source: 'card_sale' | 'template_sale' | 'commission' | 'subscription' | 'royalty';
  amount: number;
  currency: string;
  platformFee: number;
  netAmount: number;
  transactionId: string;
  buyerId?: string;
  productId?: string;
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  payoutDate?: string;
  transactionDate: string;
  metadata?: Record<string, any>;
}

export interface CreatorAnalytics {
  creatorId: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  metrics: {
    revenue: number;
    sales: number;
    views: number;
    downloads: number;
    followers: number;
    engagement: number;
    averageRating: number;
  };
  topProducts: Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
  }>;
  demographics: {
    countries: Array<{ country: string; percentage: number }>;
    ageGroups: Array<{ ageGroup: string; percentage: number }>;
    devices: Array<{ device: string; percentage: number }>;
  };
}

export interface CollaborationComment {
  id: string;
  projectId: string;
  layerId?: string;
  userId: string;
  username: string;
  content: string;
  position?: { x: number; y: number };
  resolved: boolean;
  replies: CollaborationReply[];
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationReply {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface DesignTool {
  id: string;
  name: string;
  icon: string;
  category: 'selection' | 'drawing' | 'text' | 'shape' | 'effect' | 'navigation';
  shortcut?: string;
  properties: ToolProperties;
}

export interface ToolProperties {
  brushSize?: number;
  brushHardness?: number;
  opacity?: number;
  color?: string;
  strokeWidth?: number;
  fillColor?: string;
  strokeColor?: string;
}

export interface CreatorSubscription {
  id: string;
  creatorId: string;
  subscriberId: string;
  tier: 'basic' | 'premium' | 'exclusive';
  price: number;
  currency: string;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  benefits: string[];
  stripeSubscriptionId?: string;
}
