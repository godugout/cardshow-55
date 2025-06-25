
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: Record<string, any>;
  verification_status: 'unverified' | 'pending' | 'verified';
  preferences?: Record<string, any>;
  total_followers?: number;
  total_following?: number;
  experience_points?: number;
  level?: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('🔍 Fetching profile for:', userId);
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('❌ Profile fetch error:', error);
          setError(new Error(error.message));
          setProfile(null);
        } else {
          console.log('✅ Profile loaded:', data.username);
          // Convert database types to expected types
          const profileData: UserProfile = {
            id: data.id,
            username: data.username || '',
            email: data.email || '',
            full_name: data.full_name || '',
            avatar_url: data.avatar_url || '',
            bio: data.bio || '',
            location: data.location || '',
            website: data.website || '',
            social_links: typeof data.social_links === 'object' && data.social_links !== null ? data.social_links as Record<string, any> : {},
            verification_status: (data.verification_status === 'verified' || data.verification_status === 'pending') ? data.verification_status : 'unverified',
            preferences: typeof data.preferences === 'object' && data.preferences !== null ? data.preferences as Record<string, any> : {},
            total_followers: data.total_followers || 0,
            total_following: data.total_following || 0,
            experience_points: data.experience_points || 0,
            level: data.level || 1,
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString()
          };
          setProfile(profileData);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Profile fetch exception:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) {
      return { error: new Error('No user ID provided') };
    }

    try {
      console.log('📝 Updating profile for user:', userId);
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('❌ Profile update error:', error);
        toast.error('Failed to update profile');
        return { error };
      }

      // Refresh profile data
      const { data: updatedData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (updatedData) {
        const profileData: UserProfile = {
          id: updatedData.id,
          username: updatedData.username || '',
          email: updatedData.email || '',
          full_name: updatedData.full_name || '',
          avatar_url: updatedData.avatar_url || '',
          bio: updatedData.bio || '',
          location: updatedData.location || '',
          website: updatedData.website || '',
          social_links: typeof updatedData.social_links === 'object' && updatedData.social_links !== null ? updatedData.social_links as Record<string, any> : {},
          verification_status: (updatedData.verification_status === 'verified' || updatedData.verification_status === 'pending') ? updatedData.verification_status : 'unverified',
          preferences: typeof updatedData.preferences === 'object' && updatedData.preferences !== null ? updatedData.preferences as Record<string, any> : {},
          total_followers: updatedData.total_followers || 0,
          total_following: updatedData.total_following || 0,
          experience_points: updatedData.experience_points || 0,
          level: updatedData.level || 1,
          created_at: updatedData.created_at || new Date().toISOString(),
          updated_at: updatedData.updated_at || new Date().toISOString()
        };
        setProfile(profileData);
      }
      
      toast.success('Profile updated successfully!');
      return { error: null };
    } catch (error) {
      console.error('❌ Profile update exception:', error);
      toast.error('An unexpected error occurred');
      return { error };
    } finally {
      setIsUpdating(false);
    }
  };

  return { profile, isLoading, isUpdating, error, updateProfile };
};
