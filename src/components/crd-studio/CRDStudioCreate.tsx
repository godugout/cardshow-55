import React, { useState } from 'react';
import { Upload, Camera, Image, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const creationMethods = [
  {
    id: 'upload',
    title: 'Upload Photo',
    description: 'Upload an image and extract cards automatically',
    icon: Upload,
    color: 'from-crd-blue to-crd-purple'
  },
  {
    id: 'camera',
    title: 'Take Photo',
    description: 'Use your camera to capture cards directly',
    icon: Camera,
    color: 'from-crd-green to-crd-blue'
  },
  {
    id: 'template',
    title: 'Start with Template',
    description: 'Choose from professional card templates',
    icon: Image,
    color: 'from-crd-orange to-crd-gold'
  },
  {
    id: 'ai',
    title: 'AI Generation',
    description: 'Generate cards using AI prompts',
    icon: Sparkles,
    color: 'from-crd-purple to-crd-orange'
  }
];

const templates = [
  {
    id: '1',
    name: 'Holographic Style',
    preview: '/placeholder.svg',
    category: 'Premium'
  },
  {
    id: '2',
    name: 'Vintage Frame',
    preview: '/placeholder.svg',
    category: 'Classic'
  },
  {
    id: '3',
    name: 'Modern Minimal',
    preview: '/placeholder.svg',
    category: 'Clean'
  },
  {
    id: '4',
    name: 'Sports Card',
    preview: '/placeholder.svg',
    category: 'Athletic'
  }
];

export const CRDStudioCreate: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('upload');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop logic here
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-crd-white mb-2">Create New Card</h1>
        <p className="text-crd-lightGray">Choose how you'd like to start your card creation process</p>
      </div>

      {/* Creation Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {creationMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <Card 
              key={method.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? 'ring-2 ring-crd-orange bg-crd-orange/10' 
                  : 'bg-crd-dark border-crd-mediumGray hover:border-crd-lightGray'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-crd-white mb-2">{method.title}</h3>
                <p className="text-sm text-crd-lightGray">{method.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content based on selected method */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardContent className="p-8">
          {selectedMethod === 'upload' && (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-crd-orange bg-crd-orange/10' 
                  : 'border-crd-mediumGray hover:border-crd-lightGray'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-crd-lightGray" />
              <h3 className="text-xl font-bold text-crd-white mb-2">Drop your images here</h3>
              <p className="text-crd-lightGray mb-6">or click to browse and select files</p>
              <Button className="bg-crd-orange hover:bg-crd-orange/90">
                Choose Files
              </Button>
              <p className="text-sm text-crd-lightGray mt-4">
                Supports JPG, PNG, WebP up to 10MB each
              </p>
            </div>
          )}

          {selectedMethod === 'camera' && (
            <div className="text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 text-crd-lightGray" />
              <h3 className="text-xl font-bold text-crd-white mb-2">Camera Capture</h3>
              <p className="text-crd-lightGray mb-6">Use your device camera to capture cards in real-time</p>
              <Button className="bg-crd-green hover:bg-crd-green/90">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            </div>
          )}

          {selectedMethod === 'template' && (
            <div>
              <h3 className="text-xl font-bold text-crd-white mb-6">Choose a Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg bg-crd-mediumGray aspect-[3/4] mb-3">
                      <img 
                        src={template.preview} 
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-crd-orange text-white text-xs rounded-full">
                          {template.category}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-crd-white font-medium group-hover:text-crd-orange transition-colors">
                      {template.name}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedMethod === 'ai' && (
            <div className="text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-crd-purple" />
              <h3 className="text-xl font-bold text-crd-white mb-2">AI Card Generation</h3>
              <p className="text-crd-lightGray mb-6">Describe your card and let AI create it for you</p>
              <div className="max-w-md mx-auto">
                <textarea 
                  className="w-full p-4 bg-crd-mediumGray border border-crd-lightGray rounded-lg text-crd-white placeholder-crd-lightGray resize-none"
                  rows={4}
                  placeholder="Describe your card... e.g., 'A mystical dragon with crystal wings, holographic background, fantasy art style'"
                />
                <Button className="w-full mt-4 bg-crd-purple hover:bg-crd-purple/90">
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Card
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};