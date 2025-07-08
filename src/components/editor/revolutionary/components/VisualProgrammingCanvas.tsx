import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Plus, Play, Settings, Trash2, Link, Zap } from 'lucide-react';
import { CardBehaviorRule, VisualNode, VisualConnection } from '@/types/interactiveCard';

interface VisualProgrammingCanvasProps {
  behaviorRules: CardBehaviorRule[];
  onAddRule: (rule: CardBehaviorRule) => void;
  onUpdateRule: (ruleId: string, updates: Partial<CardBehaviorRule>) => void;
}

export const VisualProgrammingCanvas: React.FC<VisualProgrammingCanvasProps> = ({
  behaviorRules,
  onAddRule,
  onUpdateRule
}) => {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createNewRule = useCallback(() => {
    const newRule: CardBehaviorRule = {
      id: `rule_${Date.now()}`,
      name: 'New Behavior',
      trigger: 'tap',
      conditions: [],
      actions: [{
        id: `action_${Date.now()}`,
        type: 'animation',
        parameters: { type: 'pulse', intensity: 0.5 }
      }],
      priority: 1
    };
    onAddRule(newRule);
    setSelectedRule(newRule.id);
    setIsCreating(false);
  }, [onAddRule]);

  const triggerIcons = {
    tap: '👆',
    hover: '🖱️',
    swipe: '👋',
    shake: '📳',
    heartbeat: '💓',
    voice: '🎤',
    weather_rain: '🌧️',
    weather_sun: '☀️',
    time_morning: '🌅',
    time_evening: '🌆'
  };

  const actionIcons = {
    animation: '🎬',
    sound: '🔊',
    particle_effect: '✨',
    state_change: '🔄',
    mini_game: '🎮',
    reveal_content: '👁️',
    haptic_feedback: '📳'
  };

  return (
    <div className="space-y-4">
      <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-crd-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Visual Programming
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
        <CardContent className="space-y-3">
          {isCreating && (
            <div className="p-3 bg-crd-green/10 border border-crd-green/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-crd-white text-sm font-medium">Create New Behavior</span>
                <div className="flex gap-2">
                  <CRDButton onClick={createNewRule} variant="primary" size="sm">
                    Create
                  </CRDButton>
                  <CRDButton 
                    onClick={() => setIsCreating(false)} 
                    variant="secondary" 
                    size="sm"
                  >
                    Cancel
                  </CRDButton>
                </div>
              </div>
              <p className="text-crd-lightGray text-xs">
                Start with a simple if-this-then-that rule
              </p>
            </div>
          )}

          {behaviorRules.length === 0 && !isCreating ? (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 mx-auto mb-4 text-crd-lightGray opacity-50" />
              <p className="text-crd-lightGray text-sm mb-4">No behaviors yet</p>
              <CRDButton onClick={() => setIsCreating(true)} variant="primary" size="sm">
                Create First Behavior
              </CRDButton>
            </div>
          ) : (
            <div className="space-y-2">
              {behaviorRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedRule === rule.id
                      ? 'bg-crd-green/10 border-crd-green/50'
                      : 'bg-crd-mediumGray/10 border-crd-mediumGray/30 hover:border-crd-green/30'
                  }`}
                  onClick={() => setSelectedRule(rule.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-crd-white font-medium text-sm">{rule.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-crd-lightGray">Priority: {rule.priority}</span>
                      <button className="text-crd-lightGray hover:text-crd-white">
                        <Settings className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-crd-mediumGray/20 px-2 py-1 rounded">
                      <span>{triggerIcons[rule.trigger] || '⚡'}</span>
                      <span className="text-crd-lightGray capitalize">
                        {rule.trigger.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <Link className="w-3 h-3 text-crd-lightGray" />
                    
                    <div className="flex items-center gap-1">
                      {rule.actions.map((action, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-crd-mediumGray/20 px-2 py-1 rounded">
                          <span>{actionIcons[action.type] || '🎯'}</span>
                          <span className="text-crd-lightGray capitalize">
                            {action.type.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {rule.conditions.length > 0 && (
                    <div className="mt-2 text-xs text-crd-lightGray">
                      Conditions: {rule.conditions.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRule && (
        <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-base">Behavior Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center text-crd-lightGray text-sm">
                Visual programming interface coming soon!
                <br />
                Drag-and-drop nodes for building complex behaviors.
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-crd-blue/20 rounded text-center">
                  <div className="text-lg mb-1">🎯</div>
                  <div className="text-xs text-crd-white">Triggers</div>
                </div>
                <div className="p-2 bg-crd-purple/20 rounded text-center">
                  <div className="text-lg mb-1">🔀</div>
                  <div className="text-xs text-crd-white">Logic</div>
                </div>
                <div className="p-2 bg-crd-orange/20 rounded text-center">
                  <div className="text-lg mb-1">⚡</div>
                  <div className="text-xs text-crd-white">Actions</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};