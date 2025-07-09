import { useState, useEffect } from 'react';

interface ActivityState {
  cardTitle: string;
  playerImage: string | null;
  selectedTemplate: string;
  colorPalette: string;
  effects: string[];
  previewMode: 'edit' | 'preview' | 'print';
  lastActivity: Date;
  currentStep: 'template' | 'design' | 'content' | 'export';
  timeOnStep: number;
  isIdle: boolean;
}

interface UseActivityMonitorProps {
  cardTitle: string;
  playerImage: string | null;
  selectedTemplate: string;
  colorPalette: string;
  effects: string[];
  previewMode: 'edit' | 'preview' | 'print';
}

export const useActivityMonitor = (props: UseActivityMonitorProps): ActivityState => {
  const [activityState, setActivityState] = useState<ActivityState>({
    ...props,
    lastActivity: new Date(),
    currentStep: 'template',
    timeOnStep: 0,
    isIdle: false
  });

  const [stepStartTime, setStepStartTime] = useState(new Date());

  // Detect current step based on completion
  useEffect(() => {
    let newStep: ActivityState['currentStep'] = 'template';
    
    if (props.selectedTemplate && props.colorPalette) {
      newStep = 'design';
    }
    if (props.cardTitle || props.playerImage) {
      newStep = 'content';
    }
    if (props.previewMode === 'print' || props.previewMode === 'preview') {
      newStep = 'export';
    }

    setActivityState(prev => {
      const shouldUpdateStep = newStep !== prev.currentStep;
      const now = new Date();
      
      if (shouldUpdateStep) {
        setStepStartTime(now);
      }

      return {
        ...prev,
        cardTitle: props.cardTitle,
        playerImage: props.playerImage,
        selectedTemplate: props.selectedTemplate,
        colorPalette: props.colorPalette,
        effects: props.effects,
        previewMode: props.previewMode,
        currentStep: newStep,
        lastActivity: now,
        timeOnStep: shouldUpdateStep ? 0 : Date.now() - stepStartTime.getTime(),
        isIdle: false
      };
    });
  }, [props.cardTitle, props.playerImage, props.selectedTemplate, props.colorPalette, props.effects, props.previewMode, stepStartTime]);

  // Idle detection
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      setActivityState(prev => ({ ...prev, isIdle: true }));
    }, 30000); // 30 seconds idle threshold

    return () => clearTimeout(idleTimer);
  }, [activityState.lastActivity]);

  return activityState;
};