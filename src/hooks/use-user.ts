
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types/user';

export const useUser = () => {
  const { user: authUser, loading: authLoading } = useAuth();

  const { data: user, isLoading: profileLoading, error } = useQuery({
    queryKey: ['profile', authUser?.id],
    queryFn: async () => {
      if (!authUser) return null;
      
      // For now, return mock user data
      // Once database tables are set up, this will fetch from Supabase
      return {
        id: authUser.id,
        email: authUser.email || '',
        username: authUser.username || '',
        full_name: '',
        avatar_url: '',
        bio: '',
        team_id: '',
        createdAt: new Date().toISOString(),
        preferences: null,
        profileImage: '',
      } as User;
    },
    enabled: !!authUser,
  });

  return { 
    user, 
    loading: authLoading || profileLoading, 
    error: error ? new Error(error.message) : null 
  };
};
