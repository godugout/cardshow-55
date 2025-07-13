import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  role: string;
  permissions: string[];
}

export const useAdminAuth = () => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAdminUser(null);
      setIsLoading(false);
      return;
    }

    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if user has admin role
      const { data: adminRole, error: roleError } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user!.id)
        .single();

      if (roleError || !adminRole) {
        setAdminUser(null);
        setIsLoading(false);
        return;
      }

      // Get permissions for this role
      const { data: permissions, error: permError } = await supabase
        .from('admin_role_permissions')
        .select(`
          admin_permissions (
            permission_name
          )
        `)
        .eq('role', adminRole.role);

      if (permError) {
        throw permError;
      }

      const permissionNames = permissions?.map(p => 
        (p.admin_permissions as any)?.permission_name
      ).filter(Boolean) || [];

      setAdminUser({
        id: user!.id,
        role: adminRole.role,
        permissions: permissionNames
      });
    } catch (err) {
      console.error('Error checking admin status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check admin status');
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return adminUser?.permissions.includes(permission) || false;
  };

  const isAdmin = adminUser !== null;

  return {
    adminUser,
    isAdmin,
    hasPermission,
    isLoading,
    error,
    checkAdminStatus
  };
};