import type { Collection, CollectionItem, CollectionListOptions, PaginatedCollections } from './types';
import { getCollectionQuery, getCollectionItemsQuery, calculateOffset } from './core';
import { supabase } from '@/integrations/supabase/client';
import { getAppId } from '@/integrations/supabase/client';
import type { Visibility } from '@/types/common';

export const getCollectionById = async (id: string): Promise<Collection | null> => {
  try {
    console.log('Fetching collection by ID:', id);
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('Collection not found:', id);
        return null; // Record not found
      }
      console.error('Database error fetching collection:', error);
      throw new Error(`Failed to fetch collection: ${error.message}`);
    }
    
    if (!data) return null;
    
    console.log('Collection fetched successfully:', data.title);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      ownerId: data.owner_id,
      coverImageUrl: data.cover_image_url,
      visibility: data.visibility as Visibility,
      createdAt: data.created_at,
      cardCount: 0
    };
  } catch (error) {
    console.error('Database error, using fallback:', error);
    
    // Use localStorage as fallback
    try {
      const stored = localStorage.getItem(`collection_${id}`);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (e) {
      console.error('Fallback failed:', e);
      return null;
    }
  }
};

export const getCollectionItems = async (collectionId: string): Promise<CollectionItem[]> => {
  try {
    console.log('Fetching collection items for:', collectionId);
    const { data, error } = await supabase
      .from('collection_cards')
      .select('*')
      .eq('collection_id', collectionId);
    
    if (error) {
      console.error('Database error fetching collection items:', error);
      throw new Error(`Failed to fetch collection items: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log('No items found for collection:', collectionId);
      return [];
    }
    
    console.log('Collection items fetched successfully:', data.length);
    return data.map((item: any) => ({
      id: item.id,
      collectionId: item.collection_id,
      memoryId: item.card_id,
      displayOrder: item.display_order || 0,
      addedAt: item.added_at,
      memory: undefined
    }));
  } catch (error) {
    console.error('Database error, using fallback:', error);
    
    // Use localStorage as fallback
    try {
      const stored = localStorage.getItem(`collection_items_${collectionId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Fallback failed:', e);
      return [];
    }
  }
};

export const getCollectionsByUserId = async (
  userId: string,
  options: CollectionListOptions = {}
): Promise<PaginatedCollections> => {
  try {
    console.log('Fetching collections for user:', userId);
    const {
      page = 1,
      pageSize = 10,
      search
    } = options;

    let query = supabase
      .from('collections')
      .select('*', { count: 'exact' })
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    query = query.range(
      calculateOffset(page, pageSize),
      calculateOffset(page, pageSize) + pageSize - 1
    );

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error fetching user collections:', error);
      throw new Error(`Failed to fetch collections: ${error.message}`);
    }
    
    console.log('User collections fetched successfully:', data?.length || 0);
    const collections: Collection[] = (data || []).map((collection: any) => ({
      id: collection.id,
      title: collection.title,
      description: collection.description,
      ownerId: collection.owner_id,
      coverImageUrl: collection.cover_image_url,
      visibility: collection.visibility as Visibility,
      createdAt: collection.created_at,
      cardCount: 0
    }));
    
    return {
      collections,
      total: count || 0
    };
  } catch (error) {
    console.error('Database error, using fallback:', error);
    
    // Use localStorage as fallback
    try {
      const stored = localStorage.getItem(`collections_${userId}`);
      const collections = stored ? JSON.parse(stored) : [];
      return {
        collections,
        total: collections.length
      };
    } catch (e) {
      console.error('Fallback failed:', e);
      return {
        collections: [],
        total: 0
      };
    }
  }
};

export const getPublicCollections = async (
  options: CollectionListOptions = {}
): Promise<PaginatedCollections> => {
  try {
    console.log('Fetching public collections...');
    const {
      page = 1,
      pageSize = 10,
      search
    } = options;

    let query = supabase
      .from('collections')
      .select('*', { count: 'exact' })
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query.range(
      calculateOffset(page, pageSize),
      calculateOffset(page, pageSize) + pageSize - 1
    );

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error fetching public collections:', error);
      throw new Error(`Failed to fetch public collections: ${error.message}`);
    }
    
    console.log('Public collections fetched successfully:', data?.length || 0);
    const collections: Collection[] = (data || []).map((collection: any) => ({
      id: collection.id,
      title: collection.title,
      description: collection.description,
      ownerId: collection.owner_id,
      coverImageUrl: collection.cover_image_url,
      visibility: collection.visibility as Visibility,
      createdAt: collection.created_at,
      cardCount: 0
    }));
    
    return {
      collections,
      total: count || 0
    };
  } catch (error) {
    console.error('Database error, using fallback:', error);
    
    // Use localStorage as fallback
    try {
      const stored = localStorage.getItem('public_collections');
      const collections = stored ? JSON.parse(stored) : [];
      return {
        collections,
        total: collections.length
      };
    } catch (e) {
      console.error('Fallback failed:', e);
      return {
        collections: [],
        total: 0
      };
    }
  }
};
