
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Send, 
  Eye, 
  Edit3, 
  Crown,
  Clock
} from 'lucide-react';
import type { ProjectCollaborator, CollaborationComment } from '@/types/creator';

interface CollaborationPanelProps {
  projectId: string;
  collaborators: ProjectCollaborator[];
  comments: CollaborationComment[];
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  projectId,
  collaborators,
  comments
}) => {
  const [newComment, setNewComment] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleSendComment = () => {
    if (newComment.trim()) {
      // TODO: Implement comment sending
      console.log('Sending comment:', newComment);
      setNewComment('');
    }
  };

  const handleInviteCollaborator = () => {
    if (inviteEmail.trim()) {
      // TODO: Implement collaborator invitation
      console.log('Inviting collaborator:', inviteEmail);
      setInviteEmail('');
    }
  };

  const getRoleIcon = (role: ProjectCollaborator['role']) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3" />;
      case 'editor': return <Edit3 className="w-3 h-3" />;
      case 'viewer': return <Eye className="w-3 h-3" />;
      default: return <Users className="w-3 h-3" />;
    }
  };

  const getRoleColor = (role: ProjectCollaborator['role']) => {
    switch (role) {
      case 'owner': return 'bg-yellow-600';
      case 'editor': return 'bg-blue-600';
      case 'viewer': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="text-white space-y-6">
      <h3 className="font-semibold">Collaboration</h3>

      {/* Collaborators Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-300">Team Members</h4>
          <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
            <UserPlus className="w-3 h-3 mr-1" />
            Invite
          </Button>
        </div>

        <div className="space-y-2">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.userId}
              className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg"
            >
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {collaborator.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{collaborator.username}</p>
                <p className="text-xs text-gray-400">
                  {collaborator.joinedAt ? 'Active' : 'Invited'}
                </p>
              </div>
              
              <Badge
                className={`text-xs ${getRoleColor(collaborator.role)} text-white`}
              >
                {getRoleIcon(collaborator.role)}
                <span className="ml-1 capitalize">{collaborator.role}</span>
              </Badge>
            </div>
          ))}
        </div>

        {/* Invite New Collaborator */}
        <div className="space-y-2">
          <Input
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white text-sm"
          />
          <Button
            size="sm"
            onClick={handleInviteCollaborator}
            disabled={!inviteEmail.trim()}
            className="w-full"
          >
            Send Invitation
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Comments ({comments.length})
        </h4>

        {/* Comment List */}
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {comment.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{comment.username}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                  
                  {comment.resolved && (
                    <Badge className="mt-2 bg-green-600 text-white text-xs">
                      Resolved
                    </Badge>
                  )}
                  
                  {comment.replies.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-600 rounded p-2">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium">{reply.username}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(reply.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <p className="text-xs text-gray-300 mt-1">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No comments yet</p>
            <p className="text-xs">Start a conversation with your team</p>
          </div>
        )}

        {/* Add Comment */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white text-sm resize-none"
            rows={3}
          />
          <Button
            size="sm"
            onClick={handleSendComment}
            disabled={!newComment.trim()}
            className="w-full"
          >
            <Send className="w-3 h-3 mr-2" />
            Send Comment
          </Button>
        </div>
      </div>
    </div>
  );
};
