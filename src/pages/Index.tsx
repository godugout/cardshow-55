
import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '@/components/home/Hero';
import { FeaturedCards } from '@/components/home/FeaturedCards';
import { CallToAction } from '@/components/home/CallToAction';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Database, HardDrive } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <Hero />
      
      {/* Test Navigation for Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-crd-dark border-crd-mediumGray mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">🧪 Test Catalog Functionality</h2>
            <p className="text-gray-400 mb-4">
              Test the unified card catalog that aggregates cards from multiple sources:
            </p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Database className="h-4 w-4 text-blue-400" />
                Database Cards
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <HardDrive className="h-4 w-4 text-green-400" />
                Local Cards
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FileText className="h-4 w-4 text-purple-400" />
                Templates
              </div>
            </div>
            <div className="flex gap-4">
              <Button asChild className="bg-crd-blue hover:bg-crd-blue/80">
                <Link to="/collections/catalog">
                  🔍 Test Catalog
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-crd-mediumGray text-white hover:bg-crd-mediumGray">
                <Link to="/collections">
                  📚 Collections
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <FeaturedCards />
      <CallToAction />
    </div>
  );
};

export default Index;
