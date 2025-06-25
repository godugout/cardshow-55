
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';

export const useAdminPermissions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['admin-permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('admin_role_permissions')
        .select(`
          admin_permissions (
            permission_name,
            description,
            category
          )
        `)
        .eq('role', 'admin'); // This would be dynamic based on user's role
      
      if (error) {
        console.error('Error fetching admin permissions:', error);
        return [];
      }
      
      return data?.map(item => item.admin_permissions).filter(Boolean) || [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useHasPermission = (permissionName: string) => {
  const { data: permissions = [] } = useAdminPermissions();
  
  return permissions.some(
    permission => permission?.permission_name === permissionName
  );
};
