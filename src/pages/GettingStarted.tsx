
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GettingStarted = () => {
  const steps = [
    {
      title: "1. Choose Your Template",
      description: "Start with one of our professional templates or create from scratch",
      action: "Browse Templates",
      link: "/cards/create"
    },
    {
      title: "2. Upload Your Image",
      description: "Add your photo or artwork to bring your card to life",
      action: "Start Creating",
      link: "/cards/create"
    },
    {
      title: "3. Customize & Edit",
      description: "Use our powerful editor to add effects, text, and styling",
      action: "Open Studio",
      link: "/studio"
    },
    {
      title: "4. Share Your Creation",
      description: "Publish your card and share it with the community",
      action: "View Gallery",
      link: "/gallery"
    }
  ];

  const features = [
    "Professional card templates",
    "Advanced 3D effects and lighting",
    "High-quality export options",
    "Community sharing and collections",
    "Real-time collaboration tools",
    "Mobile-friendly editing"
  ];

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Getting Started with CRD</h1>
          <p className="text-xl text-crd-lightGray mb-8">
            Create stunning digital trading cards in just a few simple steps
          </p>
          <Link to="/cards/create">
            <Button className="bg-crd-green hover:bg-crd-green/90 text-black px-8 py-3">
              <Play className="h-5 w-5 mr-2" />
              Start Creating Now
            </Button>
          </Link>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">How it Works</h2>
          {steps.map((step, index) => (
            <Card key={index} className="bg-crd-dark border-crd-mediumGray p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-crd-lightGray mb-4">{step.description}</p>
                </div>
                <Link to={step.link}>
                  <Button 
                    variant="outline" 
                    className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black ml-6"
                  >
                    {step.action}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Features */}
        <Card className="bg-crd-dark border-crd-mediumGray p-8">
          <h2 className="text-2xl font-bold text-white mb-6">What You Can Do</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-crd-green mr-3 flex-shrink-0" />
                <span className="text-crd-lightGray">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Create?</h2>
          <p className="text-crd-lightGray mb-6">
            Join thousands of creators making amazing cards every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cards/create">
              <Button className="bg-crd-green hover:bg-crd-green/90 text-black">
                Create Your First Card
              </Button>
            </Link>
            <Link to="/gallery">
              <Button variant="outline" className="border-crd-mediumGray text-white hover:bg-crd-mediumGray">
                Explore Gallery
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
