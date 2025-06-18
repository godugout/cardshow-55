
import type { Visibility } from '@/types/common';
import type { Memory } from '@/types/memory';

export interface Collection {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  coverImageUrl?: string;
  visibility: Visibility;
  createdAt: string;
  cards?: Memory[]; // Changed from Card to Memory
  cardCount?: number;
  // New fields for group functionality
  templateId?: string;
  isGroup?: boolean;
  groupCode?: string;
  allowMemberCardSharing?: boolean;
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  memoryId: string;
  displayOrder: number;
  addedAt: string;
  memory?: Memory; // Add memory field
}

export interface CollectionTemplate {
  id: string;
  name: string;
  description?: string;
  templateHash: string;
  creatorId: string;
  isPublic: boolean;
  cardFilters?: any;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface CollectionMembership {
  id: string;
  collectionId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  canViewMemberCards: boolean;
  invitedBy?: string;
  joinedAt: string;
}

export interface CreateCollectionParams {
  title: string;
  description?: string;
  ownerId: string;
  visibility?: Visibility;
  cards?: string[];
  templateId?: string;
  isGroup?: boolean;
  groupCode?: string;
  allowMemberCardSharing?: boolean;
}

export interface UpdateCollectionParams {
  id: string;
  title?: string;
  description?: string;
  visibility?: Visibility;
  allowMemberCardSharing?: boolean;
}

export interface CollectionListOptions {
  page?: number;
  pageSize?: number;
  userId?: string;
  search?: string;
}

export interface PaginatedCollections {
  collections: Collection[];
  total: number;
}
