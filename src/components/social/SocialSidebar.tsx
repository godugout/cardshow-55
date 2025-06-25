
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, Users, TrendingUp, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SocialSidebarProps {
  className?: string;
}

export const SocialSidebar: React.FC<SocialSidebarProps> = ({ className = '' }) => {
  // Mock data - replace with real data later
  const trendingHashtags = [
    { name: 'RareFind', count: 245 },
    { name: 'NewDrop', count: 189 },
    { name: 'TradingTime', count: 156 },
    { name: 'CollectionComplete', count: 132 }
  ];

  const suggestedUsers = [
    { id: '1', username: 'CardMaster', avatar: '', followers: 1240 },
    { id: '2', username: 'RareCollector', avatar: '', followers: 890 },
    { id: '3', username: 'ArtistPro', avatar: '', followers: 2340 }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Notifications */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-crd-green" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-crd-mediumGray/10">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-crd-green text-black text-xs">CM</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">CardMaster liked your card</p>
              <p className="text-xs text-crd-lightGray">2m ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-crd-mediumGray/10">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-500 text-white text-xs">RC</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">New follower: RareCollector</p>
              <p className="text-xs text-crd-lightGray">5m ago</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full text-crd-green hover:bg-crd-green/10">
            View All
          </Button>
        </CardContent>
      </Card>

      {/* Trending Hashtags */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-crd-green" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {trendingHashtags.map((hashtag, index) => (
            <div key={hashtag.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-crd-mediumGray/10 cursor-pointer">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-crd-green" />
                <span className="text-white font-medium">{hashtag.name}</span>
              </div>
              <Badge variant="secondary" className="bg-crd-mediumGray/20 text-crd-lightGray">
                {hashtag.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Users */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-crd-green" />
            Who to Follow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-crd-green text-black">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                <p className="text-xs text-crd-lightGray">{user.followers} followers</p>
              </div>
              <Button size="sm" variant="outline" className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black">
                Follow
              </Button>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full text-crd-green hover:bg-crd-green/10">
            Show More
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
