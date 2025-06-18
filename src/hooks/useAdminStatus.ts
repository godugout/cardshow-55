
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';

export const useAdminStatus = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['admin-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return Boolean(data);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
