import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Upload, Layers, Wand2 } from 'lucide-react';

const CreateCard = () => {
  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Card</h1>
          <p className="text-gray-400">
            Choose your preferred creation method to start designing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Enhanced Creator */}
          <Card className="p-6 bg-crd-darker border-crd-border hover:border-crd-green transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-crd-green rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Enhanced Creator</h3>
              <p className="text-gray-400 mb-4">
                Step-by-step guided creation with advanced effects and frame selection
              </p>
              <Link to="/create/enhanced">
                <Button className="w-full bg-crd-green text-black hover:bg-crd-green/90">
                  Start Creating
                </Button>
              </Link>
            </div>
          </Card>

          {/* Standard Creator */}
          <Card className="p-6 bg-crd-darker border-crd-border hover:border-crd-green transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-crd-purple rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Standard Creator</h3>
              <p className="text-gray-400 mb-4">
                Quick and simple card creation with essential tools and features
              </p>
              <Link to="/cards/create">
                <Button variant="outline" className="w-full">
                  Quick Create
                </Button>
              </Link>
            </div>
          </Card>

          {/* PSD Processor */}
          <Card className="p-6 bg-crd-darker border-crd-border hover:border-crd-green transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-crd-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">PSD Processor</h3>
              <p className="text-gray-400 mb-4">
                Upload Photoshop files to automatically extract design elements
              </p>
              <Link to="/create/psd">
                <Button variant="outline" className="w-full">
                  Upload PSD
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            Creation Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Upload className="w-8 h-8 text-crd-green mx-auto mb-3" />
              <h3 className="text-white font-medium mb-2">Multi-Format Support</h3>
              <p className="text-gray-400 text-sm">
                Upload images, PSD files, and various formats for maximum flexibility
              </p>
            </div>
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-crd-green mx-auto mb-3" />
              <h3 className="text-white font-medium mb-2">Advanced Effects</h3>
              <p className="text-gray-400 text-sm">
                Apply holographic, foil, and other premium effects to your cards
              </p>
            </div>
            <div className="text-center">
              <Layers className="w-8 h-8 text-crd-green mx-auto mb-3" />
              <h3 className="text-white font-medium mb-2">Template System</h3>
              <p className="text-gray-400 text-sm">
                Create reusable templates for consistent branding across multiple cards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCard;