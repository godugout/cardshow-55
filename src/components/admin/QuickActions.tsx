
import React from 'react';
import { Users, Shield, DollarSign, FileText, Settings, HelpCircle } from 'lucide-react';

const actions = [
  {
    id: 'moderate_content',
    label: 'Review Flagged Content',
    description: '23 items pending',
    icon: Shield,
    color: 'bg-yellow-500/10 text-yellow-400',
    path: '/admin/moderation'
  },
  {
    id: 'manage_users',
    label: 'User Management',
    description: 'View and manage users',
    icon: Users,
    color: 'bg-blue-500/10 text-blue-400',
    path: '/admin/users'
  },
  {
    id: 'financial_overview',
    label: 'Financial Dashboard',
    description: 'Revenue and payouts',
    icon: DollarSign,
    color: 'bg-green-500/10 text-green-400',
    path: '/admin/financial'
  },
  {
    id: 'support_tickets',
    label: 'Support Tickets',
    description: '7 open tickets',
    icon: HelpCircle,
    color: 'bg-purple-500/10 text-purple-400',
    path: '/admin/support'
  }
];

export const QuickActions: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{action.label}</p>
                <p className="text-xs text-gray-400">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
