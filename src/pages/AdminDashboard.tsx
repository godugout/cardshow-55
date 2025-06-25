
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminOverview } from '@/components/admin/AdminOverview';

const AdminDashboard: React.FC = () => {
  const { data: isAdmin, isLoading } = useAdminStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLayout>
      <AdminOverview />
    </AdminLayout>
  );
};

export default AdminDashboard;
