
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image, Globe, Users, Lock } from 'lucide-react';
import { useSocialActions } from '@/hooks/useSocialActions';
import { useAuth } from '@/features/auth/providers/AuthProvider';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { createActivity, loading } = useSocialActions();
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');

  const handlePost = async () => {
    if (!content.trim()) return;

    const success = await createActivity('post', content, undefined, undefined, {}, visibility);
    if (success) {
      setContent('');
      setVisibility('public');
      onOpenChange(false);
    }
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: Globe },
    { value: 'friends', label: 'Friends', icon: Users },
    { value: 'private', label: 'Private', icon: Lock }
  ];

  // Get user display properties safely
  const userAvatar = user?.avatar_url || user?.user_metadata?.avatar_url;
  const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-crd-darker border-crd-mediumGray/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userAvatar} />
              <AvatarFallback className="bg-crd-green text-black">
                {userName[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-white">{userName}</p>
              <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                <SelectTrigger className="w-32 h-8 text-xs bg-crd-darkest border-crd-mediumGray/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-crd-darkest border-crd-mediumGray/20">
                  {visibilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      <div className="flex items-center gap-2">
                        <option.icon className="w-3 h-3" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Input */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening in your collection?"
            className="min-h-32 bg-crd-darkest border-crd-mediumGray/20 text-white placeholder:text-crd-lightGray resize-none"
            maxLength={500}
          />

          {/* Character Count */}
          <div className="flex justify-between items-center text-sm">
            <Button variant="ghost" size="sm" className="text-crd-green hover:bg-crd-green/10">
              <Image className="w-4 h-4 mr-2" />
              Add Image
            </Button>
            <span className={`${content.length > 450 ? 'text-red-400' : 'text-crd-lightGray'}`}>
              {content.length}/500
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-crd-mediumGray/20">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-crd-mediumGray/20 text-white hover:bg-crd-mediumGray/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              disabled={!content.trim() || loading}
              className="bg-crd-green text-black hover:bg-crd-green/90"
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
