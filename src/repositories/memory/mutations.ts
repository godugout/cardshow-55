
import { supabase } from '@/lib/supabase-client';
import type { Memory, MemoryFormData } from '@/types/memory';

export const createMemory = async (memoryData: MemoryFormData): Promise<Memory | null> => {
  try {
    const { data, error } = await supabase
      .from('memories')
      .insert({
        title: memoryData.title,
        description: memoryData.description,
        team_id: memoryData.teamId,
        visibility: memoryData.visibility,
        tags: memoryData.tags,
        metadata: memoryData.metadata,
        user_id: memoryData.userId || null
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      teamId: data.team_id,
      visibility: data.visibility,
      createdAt: data.created_at,
      tags: data.tags,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error creating memory:', error);
    return null;
  }
};

export const updateMemory = async (id: string, updates: Partial<Memory>): Promise<Memory | null> => {
  try {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.teamId !== undefined) updateData.team_id = updates.teamId;
    if (updates.visibility !== undefined) updateData.visibility = updates.visibility;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

    const { data, error } = await supabase
      .from('memories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      teamId: data.team_id,
      visibility: data.visibility,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: data.tags,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error updating memory:', error);
    return null;
  }
};
