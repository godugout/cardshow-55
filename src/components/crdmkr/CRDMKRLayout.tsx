
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Layers, Palette, Sparkles, ArrowRight, FileImage, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CRDMKRLayout = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 'upload', label: 'Upload PSD/Image', icon: Upload },
    { id: 'layers', label: 'Extract Layers', icon: Layers },
    { id: 'analyze', label: 'AI Analysis', icon: Sparkles },
    { id: 'customize', label: 'Customize', icon: Palette },
    { id: 'export', label: 'Generate Template', icon: Download }
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-crd-white mb-2">
              CRDMKR Template Generator
            </h1>
            <p className="text-crd-lightGray">
              Transform PSD files into customizable card templates with AI-powered analysis
            </p>
          </div>
          <Link to="/create">
            <CRDButton variant="outline" className="flex items-center gap-2">
              Back to Creator
              <ArrowRight className="w-4 h-4" />
            </CRDButton>
          </Link>
        </div>

        {/* Process Steps */}
        <div className="flex items-center justify-between bg-crd-darker p-4 rounded-lg">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-crd-green/20 text-crd-green' :
                  isCompleted ? 'bg-green-500/20 text-green-400' :
                  'text-crd-lightGray'
                }`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-crd-mediumGray mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="lg:col-span-2">
          <Card className="bg-crd-darker border-crd-mediumGray/20 h-[600px]">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Design File
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="border-2 border-dashed border-crd-mediumGray/30 rounded-lg h-full flex flex-col items-center justify-center p-8 hover:border-crd-green/50 transition-colors cursor-pointer">
                <div className="text-center">
                  <FileImage className="w-16 h-16 text-crd-mediumGray mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-crd-white mb-2">
                    Drop your PSD or image file here
                  </h3>
                  <p className="text-crd-lightGray mb-6 max-w-md">
                    Upload a Photoshop PSD file or high-resolution image to start creating your template. 
                    We support files up to 100MB.
                  </p>
                  <CRDButton variant="primary" className="mb-4">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </CRDButton>
                  <p className="text-sm text-crd-mediumGray">
                    Supported: .psd, .png, .jpg, .jpeg
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Processing Status & Preview */}
        <div className="space-y-6">
          {/* Processing Status */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white text-lg">Processing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-crd-mediumGray/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-crd-mediumGray" />
                </div>
                <p className="text-crd-lightGray">Ready to process your design file</p>
              </div>
            </CardContent>
          </Card>

          {/* Template Preview */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white text-lg">Template Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[5/7] bg-crd-mediumGray/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Palette className="w-8 h-8 text-crd-mediumGray mx-auto mb-2" />
                  <p className="text-crd-mediumGray text-sm">Preview will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CRDButton variant="outline" className="w-full justify-start" disabled>
                <Layers className="w-4 h-4 mr-2" />
                View Layers
              </CRDButton>
              <CRDButton variant="outline" className="w-full justify-start" disabled>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Analysis
              </CRDButton>
              <CRDButton variant="outline" className="w-full justify-start" disabled>
                <Download className="w-4 h-4 mr-2" />
                Export Template
              </CRDButton>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Overview */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-crd-white mb-6">How CRDMKR Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardContent className="p-6 text-center">
              <Upload className="w-8 h-8 text-crd-green mx-auto mb-3" />
              <h3 className="font-semibold text-crd-white mb-2">Smart Upload</h3>
              <p className="text-sm text-crd-lightGray">
                Upload PSD files or images and we'll automatically extract all layers and elements
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 text-crd-blue mx-auto mb-3" />
              <h3 className="font-semibold text-crd-white mb-2">AI Analysis</h3>
              <p className="text-sm text-crd-lightGray">
                Our AI identifies card regions, text zones, and design elements automatically
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardContent className="p-6 text-center">
              <Palette className="w-8 h-8 text-crd-orange mx-auto mb-3" />
              <h3 className="font-semibold text-crd-white mb-2">Team Customization</h3>
              <p className="text-sm text-crd-lightGray">
                Generate variations with different team colors, logos, and branding
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 text-crd-green mx-auto mb-3" />
              <h3 className="font-semibold text-crd-white mb-2">Export Ready</h3>
              <p className="text-sm text-crd-lightGray">
                Get clean SVG templates that integrate seamlessly with your card creator
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
