
import React from 'react';
import { Clock, User, Shield, DollarSign } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'user_signup',
    message: 'New user registered: john.doe@example.com',
    timestamp: '2 minutes ago',
    icon: User,
    color: 'text-green-400'
  },
  {
    id: 2,
    type: 'content_flagged',
    message: 'Content flagged for review: Card #12847',
    timestamp: '5 minutes ago',
    icon: Shield,
    color: 'text-yellow-400'
  },
  {
    id: 3,
    type: 'payment_processed',
    message: 'Payment processed: $129.99',
    timestamp: '10 minutes ago',
    icon: DollarSign,
    color: 'text-blue-400'
  },
  {
    id: 4,
    type: 'user_banned',
    message: 'User banned for policy violation',
    timestamp: '15 minutes ago',
    icon: Shield,
    color: 'text-red-400'
  }
];

export const ActivityFeed: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-gray-700 ${activity.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{activity.message}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors">
        View all activities
      </button>
    </div>
  );
};
