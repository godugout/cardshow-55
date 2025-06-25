
import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Ban, CheckCircle, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface User {
  id: string;
  email: string;
  username: string;
  status: 'active' | 'suspended' | 'banned';
  joinDate: string;
  lastActive: string;
  cardsCreated: number;
  totalSpent: number;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    username: 'john_creator',
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2024-01-25',
    cardsCreated: 12,
    totalSpent: 299.99
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    username: 'jane_collector',
    status: 'suspended',
    joinDate: '2024-01-10',
    lastActive: '2024-01-20',
    cardsCreated: 0,
    totalSpent: 150.00
  }
];

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusBadge = (status: User['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      banned: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400">Manage user accounts and permissions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Join Date</TableHead>
              <TableHead className="text-gray-300">Last Active</TableHead>
              <TableHead className="text-gray-300">Cards Created</TableHead>
              <TableHead className="text-gray-300">Total Spent</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} className="border-gray-700">
                <TableCell>
                  <div>
                    <p className="font-medium text-white">{user.username}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-gray-300">{user.joinDate}</TableCell>
                <TableCell className="text-gray-300">{user.lastActive}</TableCell>
                <TableCell className="text-gray-300">{user.cardsCreated}</TableCell>
                <TableCell className="text-gray-300">${user.totalSpent}</TableCell>
                <TableCell>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
