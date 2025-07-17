import React from 'react';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';

export const CreationOptions: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* Creation Options Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* CRD Collectibles Card */}
        <div className="bg-crd-darkGray border border-crd-mediumGray rounded-xl p-8 hover:border-crd-blue transition-colors duration-300">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-crd-blue rounded-lg flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M7 8h10M7 12h6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h3 className="text-component font-dm-sans text-crd-white mb-1">
                CRD Collectibles
              </h3>
              <p className="text-body text-crd-lightGray">
                Digital Trading Cards
              </p>
            </div>
          </div>

          <p className="text-body text-crd-white mb-6 leading-relaxed">
            Create premium digital trading cards with advanced 3D effects, holographic finishes, and interactive elements that collectors will treasure. 
            Perfect for sports cards, gaming cards, and traditional collectibles.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-crd-green" />
              <span className="text-small-body text-crd-white">
                Print-ready high resolution output
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-crd-green" />
              <span className="text-small-body text-crd-white">
                Professional templates and layouts
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-crd-green" />
              <span className="text-small-body text-crd-white">
                CRD standard compliance built-in
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-crd-green" />
              <span className="text-small-body text-crd-white">
                Optimized for physical production
              </span>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-crd-blue to-crd-purple text-white text-button font-dm-sans py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2">
            Create CRD Collectible
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* STRY Capsules Card */}
        <div className="bg-crd-darkGray border border-crd-mediumGray rounded-xl p-8 opacity-60 relative">
          {/* Coming Soon Badge */}
          <div className="absolute top-4 right-4 bg-crd-orange text-crd-darkest text-caption font-dm-sans px-3 py-1 rounded-full">
            Coming Soon
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-crd-mediumGray rounded-lg flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-crd-lightGray"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h3 className="text-component font-dm-sans text-crd-lightGray mb-1">
                STRY Capsules
              </h3>
              <p className="text-body text-crd-lightGray">
                Interactive & Animated Stories
              </p>
            </div>
          </div>

          <p className="text-body text-crd-lightGray mb-6 leading-relaxed">
            Design immersive story cards that reveal narratives through layers, animations, and interactive discoveries. 
            Perfect for digital storytelling, gaming, and advanced interactive experiences.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-crd-lightGray" />
              <span className="text-small-body text-crd-lightGray">
                Advanced animation & particle systems
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-crd-lightGray" />
              <span className="text-small-body text-crd-lightGray">
                Visual programming & scripting
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-crd-lightGray" />
              <span className="text-small-body text-crd-lightGray">
                Interactive behaviors & states
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-crd-lightGray" />
              <span className="text-small-body text-crd-lightGray">
                Environmental & biometric triggers
              </span>
            </div>
          </div>

          <button 
            className="w-full bg-crd-mediumGray text-crd-lightGray text-button font-dm-sans py-3 px-6 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
            disabled
          >
            Create STRY Capsule
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Help Text */}
      <div className="text-center">
        <p className="text-body text-crd-lightGray max-w-3xl mx-auto">
          New to card creation? Start with CRD Collectibles to master the fundamentals, 
          then explore STRY Capsules for advanced interactive experiences.
        </p>
      </div>
    </div>
  );
};