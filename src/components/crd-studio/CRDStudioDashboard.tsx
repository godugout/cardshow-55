import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Image, 
  TrendingUp, 
  Clock, 
  Star,
  Zap,
  Users,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statsCards = [
  {
    title: 'Total Cards',
    value: '47',
    change: '+12%',
    icon: Image,
    color: 'text-crd-blue'
  },
  {
    title: 'Views',
    value: '2.4K',
    change: '+18%',
    icon: Eye,
    color: 'text-crd-green'
  },
  {
    title: 'Favorites',
    value: '156',
    change: '+8%',
    icon: Star,
    color: 'text-crd-gold'
  },
  {
    title: 'Engagement',
    value: '94%',
    change: '+3%',
    icon: TrendingUp,
    color: 'text-crd-purple'
  }
];

const recentProjects = [
  {
    id: '1',
    title: 'Holographic Warrior',
    preview: '/placeholder.svg',
    lastModified: '2 hours ago',
    status: 'published'
  },
  {
    id: '2',
    title: 'Crystal Mage',
    preview: '/placeholder.svg',
    lastModified: '1 day ago',
    status: 'draft'
  },
  {
    id: '3',
    title: 'Lightning Strike',
    preview: '/placeholder.svg',
    lastModified: '3 days ago',
    status: 'published'
  }
];

export const CRDStudioDashboard: React.FC = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-crd-white mb-2">Welcome back, Creator</h1>
        <p className="text-crd-lightGray">Ready to create something amazing?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/crd-studio/create">
          <Card className="bg-gradient-to-br from-crd-orange to-crd-gold border-none hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center text-white">
              <Plus className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Create New Card</h3>
              <p className="opacity-90">Start with a photo or template</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="bg-gradient-to-br from-crd-purple to-crd-blue border-none hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
          <CardContent className="p-6 text-center text-white">
            <Zap className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Enhancement</h3>
            <p className="opacity-90">Auto-enhance existing cards</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-crd-green to-crd-blue border-none hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
          <CardContent className="p-6 text-center text-white">
            <Users className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="opacity-90">Explore trending designs</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-crd-dark border-crd-mediumGray">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-crd-lightGray text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-crd-white">{stat.value}</p>
                    <p className="text-crd-green text-sm">{stat.change}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Projects */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Projects</span>
            </span>
            <Link to="/crd-studio/gallery">
              <Button variant="outline" size="sm" className="border-crd-mediumGray text-crd-lightGray hover:text-crd-white">
                View All
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <Link key={project.id} to={`/crd-studio/edit/${project.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg bg-crd-mediumGray aspect-[3/4] mb-3">
                    <img 
                      src={project.preview} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <h4 className="text-crd-white font-medium group-hover:text-crd-orange transition-colors">{project.title}</h4>
                  <div className="flex items-center justify-between text-sm text-crd-lightGray">
                    <span>{project.lastModified}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'published' 
                        ? 'bg-crd-green/20 text-crd-green' 
                        : 'bg-crd-orange/20 text-crd-orange'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};