
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { User } from '@/types/user';

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
        // For now, return mock profile data from localStorage
        // Once database tables are set up, this will fetch from Supabase
        const stored = localStorage.getItem(`profile_${userId}`);
        return stored ? JSON.parse(stored) : {
          id: userId,
          username: `user_${userId}`,
          full_name: '',
          bio: '',
          avatar_url: '',
          preferences: {}
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
        // For now, save to localStorage
        // Once database tables are set up, this will save to Supabase
        const current = profile || {};
        const updated = {
          ...current,
          ...profileData,
          preferences: preferences || current.preferences || {}
        };
        localStorage.setItem(`profile_${userId}`, JSON.stringify(updated));
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
