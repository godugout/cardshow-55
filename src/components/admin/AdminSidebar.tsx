
import React from 'react';
import { 
  Users, 
  Shield, 
  DollarSign, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Home,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: Home, path: '/admin' },
  { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
  { id: 'moderation', label: 'Content Moderation', icon: Shield, path: '/admin/moderation' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { id: 'financial', label: 'Financial', icon: DollarSign, path: '/admin/financial' },
  { id: 'support', label: 'Support', icon: HelpCircle, path: '/admin/support' },
  { id: 'reports', label: 'Reports', icon: FileText, path: '/admin/reports' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 z-30 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <span className="text-white font-bold text-lg">Admin Panel</span>
          )}
        </div>
      </div>

      <nav className="mt-8 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors mb-2 ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
