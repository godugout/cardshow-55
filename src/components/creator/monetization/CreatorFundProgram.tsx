
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Award, 
  Star,
  Gift,
  Zap,
  Crown,
  Calendar
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  completed: boolean;
  category: 'sales' | 'community' | 'quality' | 'growth';
}

interface Grant {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  requirements: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'open' | 'applied' | 'closed';
}

export const CreatorFundProgram: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Sale Milestone',
      description: 'Make your first $100 in sales',
      reward: 25,
      progress: 87,
      total: 100,
      completed: false,
      category: 'sales'
    },
    {
      id: '2',
      title: 'Community Favorite',
      description: 'Receive 50 favorites on your cards',
      reward: 50,
      progress: 50,
      total: 50,
      completed: true,
      category: 'community'
    },
    {
      id: '3',
      title: 'Quality Creator',
      description: 'Maintain 4.5+ rating across 20 cards',
      reward: 100,
      progress: 18,
      total: 20,
      completed: false,
      category: 'quality'
    }
  ]);

  const [grants] = useState<Grant[]>([
    {
      id: '1',
      title: 'New Creator Boost',
      description: 'Support grant for creators with less than 6 months on the platform',
      amount: 500,
      deadline: '2024-02-28',
      requirements: ['Less than 6 months active', 'Minimum 5 published cards', '4.0+ average rating'],
      difficulty: 'beginner',
      status: 'open'
    },
    {
      id: '2',
      title: 'Innovation Challenge',
      description: 'Grant for creators experimenting with new art styles or techniques',
      amount: 1500,
      deadline: '2024-03-15',
      requirements: ['Portfolio demonstrating innovation', 'Detailed project proposal', '6+ months experience'],
      difficulty: 'intermediate',
      status: 'open'
    },
    {
      id: '3',
      title: 'Master Creator Fund',
      description: 'Major grant for established creators working on ambitious projects',
      amount: 5000,
      deadline: '2024-04-01',
      requirements: ['Top 5% creator ranking', 'Detailed business plan', '12+ months experience'],
      difficulty: 'advanced',
      status: 'applied'
    }
  ]);

  const totalEarned = achievements.filter(a => a.completed).reduce((sum, a) => sum + a.reward, 0);
  const availableRewards = achievements.filter(a => !a.completed).reduce((sum, a) => sum + a.reward, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return <DollarSign className="w-4 h-4" />;
      case 'community': return <Star className="w-4 h-4" />;
      case 'quality': return <Award className="w-4 h-4" />;
      case 'growth': return <TrendingUp className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600';
      case 'intermediate': return 'bg-yellow-600';
      case 'advanced': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Creator Fund Program</h2>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Earned</p>
            <p className="text-xl font-bold text-green-400">${totalEarned}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Available Rewards</p>
            <p className="text-xl font-bold text-yellow-400">${availableRewards}</p>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700 grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
          <TabsTrigger value="achievements" className="text-white">Achievements</TabsTrigger>
          <TabsTrigger value="grants" className="text-white">Grants</TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-white">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-600/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-600/30 rounded-lg">
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Performance Bonus</h3>
                    <p className="text-green-400 text-sm">Next payout in 15 days</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Current Month</span>
                    <span className="text-white font-semibold">$127.50</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-gray-400">Based on sales performance</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-600/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-600/30 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Growth Incentive</h3>
                    <p className="text-purple-400 text-sm">Milestone rewards</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Next Milestone</span>
                    <span className="text-white font-semibold">$75</span>
                  </div>
                  <Progress value={80} className="h-2" />
                  <p className="text-xs text-gray-400">4 more followers to unlock</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-600/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-600/30 rounded-lg">
                    <Crown className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Creator Rank</h3>
                    <p className="text-yellow-400 text-sm">Rising Star</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Progress to Pro</span>
                    <span className="text-white font-semibold">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                  <p className="text-xs text-gray-400">Unlock Pro tier benefits</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600/20 rounded-full">
                      <Gift className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Achievement Unlocked</p>
                      <p className="text-gray-400 text-sm">Community Favorite - 50 favorites earned</p>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">+$50</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-full">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Performance Bonus</p>
                      <p className="text-gray-400 text-sm">Weekly sales target exceeded</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-600 text-white">+$35</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600/20 rounded-full">
                      <Calendar className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Grant Application</p>
                      <p className="text-gray-400 text-sm">Innovation Challenge application submitted</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-purple-600 text-purple-400">
                    Pending
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${achievement.completed ? 'bg-green-600/20' : 'bg-gray-600/20'}`}>
                        {getCategoryIcon(achievement.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{achievement.title}</h3>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={achievement.completed ? 'bg-green-600' : 'bg-yellow-600'}>
                        ${achievement.reward}
                      </Badge>
                      {achievement.completed && (
                        <p className="text-green-400 text-xs mt-1">Completed</p>
                      )}
                    </div>
                  </div>
                  
                  {!achievement.completed && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-white">{achievement.progress}/{achievement.total}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grants" className="space-y-6">
          <div className="grid gap-6">
            {grants.map((grant) => (
              <Card key={grant.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{grant.title}</h3>
                      <p className="text-gray-300 mt-1">{grant.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">${grant.amount.toLocaleString()}</div>
                      <Badge className={getDifficultyColor(grant.difficulty)}>
                        {grant.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-medium text-gray-300">Requirements:</h4>
                    <ul className="space-y-1">
                      {grant.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>📅 Deadline: {grant.deadline}</span>
                    </div>
                    <Button 
                      variant={grant.status === 'applied' ? 'outline' : 'default'}
                      className={grant.status === 'applied' ? 'border-green-600 text-green-400' : 'bg-purple-600 hover:bg-purple-700'}
                      disabled={grant.status === 'applied' || grant.status === 'closed'}
                    >
                      {grant.status === 'applied' ? 'Application Submitted' : 'Apply Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Monthly Creator Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div key={rank} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        rank === 1 ? 'bg-yellow-600 text-black' : 
                        rank === 2 ? 'bg-gray-400 text-black' : 
                        rank === 3 ? 'bg-orange-600 text-black' : 'bg-gray-600 text-white'
                      }`}>
                        {rank}
                      </div>
                      <div>
                        <p className="text-white font-medium">Creator {rank}</p>
                        <p className="text-gray-400 text-sm">${(1000 - rank * 150).toLocaleString()} earned</p>
                      </div>
                    </div>
                    {rank <= 3 && (
                      <Badge className="bg-purple-600 text-white">
                        Bonus Eligible
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
