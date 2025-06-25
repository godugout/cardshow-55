
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
          // Cast data to any to avoid TypeScript issues with generated types
          const rawData = data as any;
          
          // Convert database types to expected types
          const profileData: UserProfile = {
            id: rawData.id,
            username: rawData.username || '',
            email: rawData.email || '',
            full_name: rawData.full_name || '',
            avatar_url: rawData.avatar_url || '',
            bio: rawData.bio || '',
            location: rawData.location || '',
            website: rawData.website || '',
            social_links: typeof rawData.social_links === 'object' && rawData.social_links !== null ? rawData.social_links as Record<string, any> : {},
            verification_status: (rawData.verification_status === 'verified' || rawData.verification_status === 'pending') ? rawData.verification_status : 'unverified',
            preferences: typeof rawData.preferences === 'object' && rawData.preferences !== null ? rawData.preferences as Record<string, any> : {},
            total_followers: rawData.total_followers || 0,
            total_following: rawData.total_following || 0,
            experience_points: rawData.experience_points || 0,
            level: rawData.level || 1,
            created_at: rawData.created_at || new Date().toISOString(),
            updated_at: rawData.updated_at || new Date().toISOString()
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
        // Cast data to any to avoid TypeScript issues with generated types
        const rawData = updatedData as any;
        
        const profileData: UserProfile = {
          id: rawData.id,
          username: rawData.username || '',
          email: rawData.email || '',
          full_name: rawData.full_name || '',
          avatar_url: rawData.avatar_url || '',
          bio: rawData.bio || '',
          location: rawData.location || '',
          website: rawData.website || '',
          social_links: typeof rawData.social_links === 'object' && rawData.social_links !== null ? rawData.social_links as Record<string, any> : {},
          verification_status: (rawData.verification_status === 'verified' || rawData.verification_status === 'pending') ? rawData.verification_status : 'unverified',
          preferences: typeof rawData.preferences === 'object' && rawData.preferences !== null ? rawData.preferences as Record<string, any> : {},
          total_followers: rawData.total_followers || 0,
          total_following: rawData.total_following || 0,
          experience_points: rawData.experience_points || 0,
          level: rawData.level || 1,
          created_at: rawData.created_at || new Date().toISOString(),
          updated_at: rawData.updated_at || new Date().toISOString()
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
