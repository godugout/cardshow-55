
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProfileData {
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

interface UserPreferences {
  darkMode?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  profileVisibility?: boolean;
  showCardValue?: boolean;
  compactView?: boolean;
}

export const useProfile = (userId?: string) => {
  const queryClient = useQueryClient();
  
  // Get user profile
  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        // Fetch the profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          // If the error is a "not found" error, we'll create a profile
          if (error.code === 'PGRST116') {
            console.log('Profile not found, you might want to create one');
            return null;
          }
          throw error;
        }
        
        // Load preferences from localStorage as fallback
        const storedPrefs = localStorage.getItem(`user_preferences_${userId}`);
        let preferences = {};
        
        if (storedPrefs) {
          try {
            preferences = JSON.parse(storedPrefs);
          } catch (err) {
            console.error('Error parsing stored preferences:', err);
          }
        }
        
        return {
          ...data,
          preferences
        };
      } catch (err) {
        console.error('Error in useProfile hook:', err);
        throw err;
      }
    },
    enabled: !!userId,
    retry: 1
  });

  // Update profile
  const updateProfileMutation = useMutation({
    mutationFn: async ({ profileData, preferences }: { profileData: ProfileData, preferences?: UserPreferences }) => {
      if (!userId) throw new Error('User ID is required');
      
      try {
        // Update the profile
        const { error } = await supabase
          .from('profiles')
          .update({
            username: profileData.username,
            full_name: profileData.full_name,
            bio: profileData.bio,
            avatar_url: profileData.avatar_url
          })
          .eq('id', userId);
          
        if (error) throw error;
        
        // Store preferences in localStorage
        if (preferences) {
          localStorage.setItem(`user_preferences_${userId}`, JSON.stringify(preferences));
        }
        
        return true;
      } catch (err) {
        console.error('Error updating profile:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update profile: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending
  };
};
