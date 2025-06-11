
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types/user';

export const useUser = () => {
  const { user: authUser, loading: authLoading } = useAuth();

  const { data: user, isLoading: profileLoading, error } = useQuery({
    queryKey: ['profile', authUser?.id],
    queryFn: async () => {
      if (!authUser) return null;
      
      // Return user data based on the auth user
      return {
        id: authUser.id,
        email: authUser.email || '',
        username: authUser.email?.split('@')[0] || '',
        full_name: authUser.user_metadata?.full_name || '',
        avatar_url: authUser.user_metadata?.avatar_url || '',
        bio: '',
        team_id: '',
        createdAt: new Date().toISOString(),
        preferences: null,
        profileImage: authUser.user_metadata?.avatar_url || '',
      } as User;
    },
    enabled: !!authUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  return { 
    user, 
    loading: authLoading || profileLoading, 
    error: error ? new Error(error.message) : null 
  };
};
