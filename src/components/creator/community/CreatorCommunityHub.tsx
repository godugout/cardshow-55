
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Star, 
  Award, 
  Handshake,
  Zap,
  Video,
  Send,
  Heart,
  Share2,
  BookOpen
} from 'lucide-react';

interface CreatorPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

interface Collaboration {
  id: string;
  title: string;
  description: string;
  skills_needed: string[];
  creator: {
    name: string;
    avatar: string;
  };
  deadline: string;
  budget_range: string;
  applications: number;
}

export const CreatorCommunityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');
  
  const [posts] = useState<CreatorPost[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Chen',
        avatar: '/api/placeholder/40/40',
        verified: true,
        followers: 12400
      },
      content: 'Just finished a new fantasy card series! The detail work on the dragon scales took forever but totally worth it. What do you think? 🐉✨',
      images: ['/api/placeholder/300/200'],
      timestamp: '2 hours ago',
      likes: 147,
      comments: 23,
      shares: 8,
      liked: false
    },
    {
      id: '2',
      author: {
        name: 'Marcus Rivera',
        avatar: '/api/placeholder/40/40',
        verified: false,
        followers: 3200
      },
      content: 'Hosting a live design session tomorrow at 7 PM EST! Going to work on a cyberpunk-themed trading card from concept to completion. Join me if you want to see the process!',
      timestamp: '4 hours ago',
      likes: 89,
      comments: 15,
      shares: 12,
      liked: true
    }
  ]);

  const [collaborations] = useState<Collaboration[]>([
    {
      id: '1',
      title: 'Fantasy Card Series Collaboration',
      description: 'Looking for a talented illustrator to collaborate on a 12-card fantasy series. Profit sharing arrangement.',
      skills_needed: ['Digital Art', 'Fantasy Illustration', 'Character Design'],
      creator: {
        name: 'Alex Thompson',
        avatar: '/api/placeholder/40/40'
      },
      deadline: '2024-02-15',
      budget_range: '$500-1000',
      applications: 12
    },
    {
      id: '2',
      title: 'Sci-Fi Trading Card Game',
      description: 'Seeking concept artists and writers for an upcoming sci-fi trading card game. Long-term project with great potential.',
      skills_needed: ['Concept Art', 'Writing', 'Game Design'],
      creator: {
        name: 'Luna Games Studio',
        avatar: '/api/placeholder/40/40'
      },
      deadline: '2024-03-01',
      budget_range: '$2000-5000',
      applications: 28
    }
  ]);

  const handleLike = (postId: string) => {
    // Handle like functionality
    console.log('Liked post:', postId);
  };

  const handleShare = (postId: string) => {
    // Handle share functionality
    console.log('Shared post:', postId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Creator Community</h2>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Video className="w-4 h-4 mr-2" />
          Go Live
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700 grid w-full grid-cols-5">
          <TabsTrigger value="feed" className="text-white">Feed</TabsTrigger>
          <TabsTrigger value="collaborate" className="text-white">Collaborate</TabsTrigger>
          <TabsTrigger value="workshops" className="text-white">Workshops</TabsTrigger>
          <TabsTrigger value="mentorship" className="text-white">Mentorship</TabsTrigger>
          <TabsTrigger value="challenges" className="text-white">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* Create Post */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="/api/placeholder/40/40" />
                  <AvatarFallback>YU</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <Textarea
                    placeholder="Share your latest work, ask for feedback, or start a discussion..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white min-h-20"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-400">
                        📷 Photo
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400">
                        🎥 Video
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400">
                        📊 Poll
                      </Button>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Send className="w-4 h-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white">{post.author.name}</h4>
                        {post.author.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <span className="text-gray-400 text-sm">
                          {post.author.followers.toLocaleString()} followers
                        </span>
                        <span className="text-gray-500 text-sm">• {post.timestamp}</span>
                      </div>
                      
                      <p className="text-gray-300 mb-4">{post.content}</p>
                      
                      {post.images && (
                        <div className="mb-4">
                          <img 
                            src={post.images[0]} 
                            alt="Post content" 
                            className="rounded-lg max-w-full h-auto"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-6 pt-3 border-t border-gray-700">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleLike(post.id)}
                          className={`text-gray-400 hover:text-red-400 ${post.liked ? 'text-red-400' : ''}`}
                        >
                          <Heart className={`w-4 h-4 mr-2 ${post.liked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {post.comments}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleShare(post.id)}
                          className="text-gray-400 hover:text-green-400"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          {post.shares}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collaborate" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Collaboration Opportunities</h3>
            <Button className="bg-green-600 hover:bg-green-700">
              <Handshake className="w-4 h-4 mr-2" />
              Post Opportunity
            </Button>
          </div>

          <div className="grid gap-6">
            {collaborations.map((collab) => (
              <Card key={collab.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={collab.creator.avatar} />
                        <AvatarFallback>{collab.creator.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-white">{collab.title}</h4>
                        <p className="text-gray-400 text-sm">by {collab.creator.name}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {collab.budget_range}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{collab.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {collab.skills_needed.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>📅 Deadline: {collab.deadline}</span>
                      <span>👥 {collab.applications} applications</span>
                    </div>
                    <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workshops" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Upcoming Workshops</h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Workshop
            </Button>
          </div>

          <div className="grid gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-600/20 rounded-lg">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Digital Art Fundamentals</h4>
                    <p className="text-gray-300 mb-3">
                      Learn the basics of digital art creation, from composition to color theory.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span>📅 Tomorrow 7:00 PM EST</span>
                      <span>⏱️ 2 hours</span>
                      <span>👥 24 attendees</span>
                      <span>💰 $15</span>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Join Workshop
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-6">
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Mentorship Program</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Connect with experienced creators for personalized guidance and accelerate your growth.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                Find a Mentor
              </Button>
              <Button variant="outline" className="border-yellow-600 text-yellow-400">
                Become a Mentor
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Creator Challenges</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Participate in community challenges to showcase your skills and win prizes.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Zap className="w-4 h-4 mr-2" />
              Join Challenge
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
