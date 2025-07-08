import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Plus, Type, Zap, Sparkles } from 'lucide-react';
import { KineticTextConfig } from '@/types/interactiveCard';

interface KineticTextEditorProps {
  textConfigs: KineticTextConfig[];
  onUpdate: (configs: KineticTextConfig[]) => void;
}

export const KineticTextEditor: React.FC<KineticTextEditorProps> = ({
  textConfigs,
  onUpdate
}) => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const animationTypes = [
    { id: 'typewriter', name: 'Typewriter', icon: '⌨️' },
    { id: 'wave', name: 'Wave', icon: '🌊' },
    { id: 'bounce', name: 'Bounce', icon: '⚡' },
    { id: 'glow', name: 'Glow', icon: '✨' },
    { id: 'rainbow', name: 'Rainbow', icon: '🌈' },
    { id: 'glitch', name: 'Glitch', icon: '📺' },
    { id: 'matrix', name: 'Matrix', icon: '💚' }
  ];

  const createTextElement = () => {
    const newText: KineticTextConfig = {
      id: `text_${Date.now()}`,
      text: 'Your Text Here',
      font_family: 'Inter',
      font_size: 24,
      font_weight: 600,
      animation_type: 'typewriter',
      animation_speed: 1,
      animation_delay: 0,
      color_scheme: ['#ffffff'],
      stroke_width: 0,
      stroke_color: '#000000'
    };

    onUpdate([...textConfigs, newText]);
    setSelectedText(newText.id);
    setIsCreating(false);
  };

  const updateText = (textId: string, updates: Partial<KineticTextConfig>) => {
    onUpdate(textConfigs.map(text =>
      text.id === textId ? { ...text, ...updates } : text
    ));
  };

  const removeText = (textId: string) => {
    onUpdate(textConfigs.filter(text => text.id !== textId));
    setSelectedText(null);
  };

  const selectedTextData = textConfigs.find(t => t.id === selectedText);

  return (
    <div className="space-y-4">
      <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-crd-white text-base flex items-center gap-2">
              <Type className="w-4 h-4" />
              Kinetic Typography
            </CardTitle>
            <CRDButton
              onClick={() => setIsCreating(true)}
              variant="secondary"
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </CRDButton>
          </div>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <div className="mb-4 p-3 bg-crd-green/10 border border-crd-green/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-crd-white text-sm font-medium">Add Text Element</span>
                <div className="flex gap-2">
                  <CRDButton onClick={createTextElement} variant="primary" size="sm">
                    Add Text
                  </CRDButton>
                  <CRDButton onClick={() => setIsCreating(false)} variant="secondary" size="sm">
                    Cancel
                  </CRDButton>
                </div>
              </div>
            </div>
          )}

          {textConfigs.length === 0 && !isCreating ? (
            <div className="text-center py-8">
              <Type className="w-12 h-12 mx-auto mb-4 text-crd-lightGray opacity-50" />
              <p className="text-crd-lightGray text-sm mb-4">No kinetic text yet</p>
              <CRDButton onClick={() => setIsCreating(true)} variant="primary" size="sm">
                Add Text Effect
              </CRDButton>
            </div>
          ) : (
            <div className="space-y-2">
              {textConfigs.map((textConfig) => {
                const animation = animationTypes.find(a => a.id === textConfig.animation_type);
                return (
                  <div
                    key={textConfig.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedText === textConfig.id
                        ? 'bg-crd-green/10 border-crd-green/50'
                        : 'bg-crd-mediumGray/10 border-crd-mediumGray/30 hover:border-crd-green/30'
                    }`}
                    onClick={() => setSelectedText(textConfig.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{animation?.icon || '📝'}</span>
                        <span className="text-crd-white text-sm font-medium">
                          {textConfig.text.substring(0, 20)}
                          {textConfig.text.length > 20 ? '...' : ''}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeText(textConfig.id);
                        }}
                        className="text-crd-lightGray hover:text-crd-red"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
                        <span className="text-crd-lightGray">{animation?.name || 'Unknown'}</span>
                      </div>
                      <div className="bg-crd-mediumGray/20 px-2 py-1 rounded">
                        <span className="text-crd-lightGray">{textConfig.font_size}px</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTextData && (
        <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-base">Text Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Text Content</label>
              <Input
                value={selectedTextData.text}
                onChange={(e) => updateText(selectedTextData.id, { text: e.target.value })}
                className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white"
                placeholder="Enter your text..."
              />
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Animation Type</label>
              <Select
                value={selectedTextData.animation_type}
                onValueChange={(value: any) => updateText(selectedTextData.id, { animation_type: value })}
              >
                <SelectTrigger className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-crd-darker border-crd-mediumGray/40">
                  {animationTypes.map((animation) => (
                    <SelectItem key={animation.id} value={animation.id}>
                      <div className="flex items-center gap-2">
                        <span>{animation.icon}</span>
                        <span>{animation.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Font Size</label>
                <Slider
                  value={[selectedTextData.font_size]}
                  onValueChange={([value]) => updateText(selectedTextData.id, { font_size: value })}
                  min={8}
                  max={72}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-crd-lightGray mt-1">{selectedTextData.font_size}px</div>
              </div>

              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Font Weight</label>
                <Slider
                  value={[selectedTextData.font_weight]}
                  onValueChange={([value]) => updateText(selectedTextData.id, { font_weight: value })}
                  min={100}
                  max={900}
                  step={100}
                  className="w-full"
                />
                <div className="text-xs text-crd-lightGray mt-1">{selectedTextData.font_weight}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Animation Speed</label>
                <Slider
                  value={[selectedTextData.animation_speed]}
                  onValueChange={([value]) => updateText(selectedTextData.id, { animation_speed: value })}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-crd-lightGray mt-1">{selectedTextData.animation_speed}x</div>
              </div>

              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Animation Delay</label>
                <Slider
                  value={[selectedTextData.animation_delay]}
                  onValueChange={([value]) => updateText(selectedTextData.id, { animation_delay: value })}
                  min={0}
                  max={5000}
                  step={100}
                  className="w-full"
                />
                <div className="text-xs text-crd-lightGray mt-1">{selectedTextData.animation_delay}ms</div>
              </div>
            </div>

            <div>
              <label className="text-crd-lightGray text-sm mb-2 block">Font Family</label>
              <Select
                value={selectedTextData.font_family}
                onValueChange={(value) => updateText(selectedTextData.id, { font_family: value })}
              >
                <SelectTrigger className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-crd-darker border-crd-mediumGray/40">
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};