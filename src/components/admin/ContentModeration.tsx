
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, X, Eye, Flag } from 'lucide-react';

interface ModerationItem {
  id: string;
  contentType: 'card' | 'comment' | 'profile';
  title: string;
  reportedBy: string;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  aiFlags: string[];
}

const mockItems: ModerationItem[] = [
  {
    id: '1',
    contentType: 'card',
    title: 'Inappropriate Sports Card Design',
    reportedBy: 'user123',
    reason: 'Inappropriate content',
    priority: 'high',
    status: 'pending',
    createdAt: '2024-01-25T10:30:00Z',
    aiFlags: ['adult_content', 'violence']
  },
  {
    id: '2',
    contentType: 'comment',
    title: 'Spam comment on marketplace',
    reportedBy: 'moderator_bot',
    reason: 'Spam',
    priority: 'medium',
    status: 'pending',
    createdAt: '2024-01-25T09:15:00Z',
    aiFlags: ['spam', 'repetitive']
  }
];

export const ContentModeration: React.FC = () => {
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const getPriorityBadge = (priority: ModerationItem['priority']) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const handleApprove = (id: string) => {
    console.log('Approving item:', id);
  };

  const handleReject = (id: string) => {
    console.log('Rejecting item:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Moderation</h1>
          <p className="text-gray-400">Review and moderate platform content</p>
        </div>
        
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="grid gap-4">
        {mockItems.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  {getPriorityBadge(item.priority)}
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    {item.contentType}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                  <span>Reported by: {item.reportedBy}</span>
                  <span>Reason: {item.reason}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                
                {item.aiFlags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">AI Flags:</span>
                    {item.aiFlags.map((flag) => (
                      <span key={flag} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApprove(item.id)}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </button>
                
                <button
                  onClick={() => handleReject(item.id)}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                
                <button className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
