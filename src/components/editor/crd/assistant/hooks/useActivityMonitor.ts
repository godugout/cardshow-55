import { useState, useEffect, useMemo } from 'react';

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
  const [stepStartTime, setStepStartTime] = useState(new Date());
  const [lastActivity, setLastActivity] = useState(new Date());
  const [isIdle, setIsIdle] = useState(false);

  // Calculate current step based on completion (memoized to prevent recalculation)
  const currentStep = useMemo((): ActivityState['currentStep'] => {
    if (props.previewMode === 'print' || props.previewMode === 'preview') {
      return 'export';
    }
    if (props.cardTitle || props.playerImage) {
      return 'content';
    }
    if (props.selectedTemplate && props.colorPalette) {
      return 'design';
    }
    return 'template';
  }, [props.selectedTemplate, props.colorPalette, props.cardTitle, props.playerImage, props.previewMode]);

  // Reset step start time when step changes
  const [prevStep, setPrevStep] = useState(currentStep);
  useEffect(() => {
    if (currentStep !== prevStep) {
      setStepStartTime(new Date());
      setPrevStep(currentStep);
    }
  }, [currentStep, prevStep]);

  // Update last activity when any props change
  useEffect(() => {
    setLastActivity(new Date());
    setIsIdle(false);
  }, [props.cardTitle, props.playerImage, props.selectedTemplate, props.colorPalette, props.effects, props.previewMode]);

  // Idle detection
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      setIsIdle(true);
    }, 30000); // 30 seconds idle threshold

    return () => clearTimeout(idleTimer);
  }, [lastActivity]);

  // Calculate time on step
  const timeOnStep = useMemo(() => {
    return Date.now() - stepStartTime.getTime();
  }, [stepStartTime]);

  // Return stable activity state
  return useMemo((): ActivityState => ({
    cardTitle: props.cardTitle,
    playerImage: props.playerImage,
    selectedTemplate: props.selectedTemplate,
    colorPalette: props.colorPalette,
    effects: props.effects,
    previewMode: props.previewMode,
    lastActivity,
    currentStep,
    timeOnStep,
    isIdle
  }), [
    props.cardTitle,
    props.playerImage, 
    props.selectedTemplate,
    props.colorPalette,
    props.effects,
    props.previewMode,
    lastActivity,
    currentStep,
    timeOnStep,
    isIdle
  ]);
};