
import React, { useState } from 'react';
import { Camera, X, Sparkles, Palette, Type, Image, Check } from 'lucide-react';

interface MobileCreationStudioProps {
  onClose?: () => void;
  onSave?: (cardData: any) => void;
}

export const MobileCreationStudio: React.FC<MobileCreationStudioProps> = ({ 
  onClose, 
  onSave 
}) => {
  const [step, setStep] = useState<'template' | 'photo' | 'customize' | 'preview'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [cardData, setCardData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    effects: {
      holographic: false,
      chrome: false,
      foil: false
    }
  });

  const templates = [
    { id: 'sports', name: 'Sports Card', preview: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png' },
    { id: 'fantasy', name: 'Fantasy Card', preview: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png' },
    { id: 'modern', name: 'Modern Card', preview: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png' }
  ];

  const handleSave = () => {
    if (onSave) {
      onSave(cardData);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Create Card</h1>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center p-4 bg-[#2d2d2d]">
        {['template', 'photo', 'customize', 'preview'].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === stepName ? 'bg-[#00C851] text-black' : 
              index < ['template', 'photo', 'customize', 'preview'].indexOf(step) ? 'bg-[#00C851] text-black' : 
              'bg-gray-600 text-gray-300'
            }`}>
              {index + 1}
            </div>
            {index < 3 && <div className="w-8 h-0.5 bg-gray-600 mx-2" />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {step === 'template' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Choose Template</h2>
            <div className="grid grid-cols-1 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setStep('photo');
                  }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedTemplate === template.id
                      ? 'border-[#00C851] bg-[#2d2d2d]'
                      : 'border-gray-600 bg-[#2d2d2d] hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <span className="text-white font-medium">{template.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'photo' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Add Photo</h2>
            
            <div className="space-y-4">
              <button className="w-full py-4 bg-[#00C851] text-black rounded-lg font-semibold flex items-center justify-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
              </button>
              
              <button className="w-full py-4 bg-[#2d2d2d] text-white rounded-lg font-semibold flex items-center justify-center space-x-2 border border-gray-600">
                <Image className="w-5 h-5" />
                <span>Choose from Gallery</span>
              </button>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={() => setStep('template')}
                className="flex-1 py-3 bg-[#2d2d2d] text-white rounded-lg font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep('customize')}
                className="flex-1 py-3 bg-[#00C851] text-black rounded-lg font-semibold"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'customize' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Customize Card</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Card Title</label>
                <input
                  type="text"
                  value={cardData.title}
                  onChange={(e) => setCardData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-[#2d2d2d] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00C851]"
                  placeholder="Enter card title"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <textarea
                  value={cardData.description}
                  onChange={(e) => setCardData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#2d2d2d] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00C851]"
                  rows={3}
                  placeholder="Add description..."
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-3">Visual Effects</label>
                <div className="space-y-3">
                  {[
                    { key: 'holographic', label: 'Holographic', icon: Sparkles },
                    { key: 'chrome', label: 'Chrome Finish', icon: Palette },
                    { key: 'foil', label: 'Foil Effect', icon: Type }
                  ].map((effect) => {
                    const Icon = effect.icon;
                    return (
                      <label
                        key={effect.key}
                        className="flex items-center space-x-3 p-3 bg-[#2d2d2d] rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={cardData.effects[effect.key as keyof typeof cardData.effects]}
                          onChange={(e) => setCardData(prev => ({
                            ...prev,
                            effects: {
                              ...prev.effects,
                              [effect.key]: e.target.checked
                            }
                          }))}
                          className="w-4 h-4 text-[#00C851]"
                        />
                        <Icon className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{effect.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={() => setStep('photo')}
                className="flex-1 py-3 bg-[#2d2d2d] text-white rounded-lg font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep('preview')}
                className="flex-1 py-3 bg-[#00C851] text-black rounded-lg font-semibold"
              >
                Preview
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Preview & Save</h2>
            
            <div className="bg-[#2d2d2d] rounded-lg p-4">
              <div className="aspect-[5/7] bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-sm">Card Preview</span>
              </div>
              <h3 className="text-white font-semibold">{cardData.title || 'Untitled Card'}</h3>
              <p className="text-gray-400 text-sm mt-1">{cardData.description || 'No description'}</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep('customize')}
                className="flex-1 py-3 bg-[#2d2d2d] text-white rounded-lg font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-[#00C851] text-black rounded-lg font-semibold flex items-center justify-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>Save Card</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
