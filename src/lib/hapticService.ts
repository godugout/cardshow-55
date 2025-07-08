import type { QualityLevel } from '@/hooks/usePerformanceMonitor';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'rarity_common' | 'rarity_uncommon' | 'rarity_rare' | 'rarity_legendary';

export interface HapticFeedbackConfig {
  pattern: HapticPattern;
  duration?: number;
  intensity?: number;
  delay?: number;
}

interface HapticPatternDefinition {
  duration: number;
  intensity: number;
  pattern?: number[];
}

const HAPTIC_PATTERNS: Record<HapticPattern, HapticPatternDefinition> = {
  // Basic patterns
  light: { duration: 10, intensity: 0.3 },
  medium: { duration: 25, intensity: 0.6 },
  heavy: { duration: 50, intensity: 1.0 },
  
  // Feedback patterns
  success: { duration: 30, intensity: 0.7, pattern: [10, 5, 15] },
  error: { duration: 40, intensity: 0.8, pattern: [20, 10, 20] },
  
  // Rarity-based premium patterns
  rarity_common: { duration: 15, intensity: 0.4 },
  rarity_uncommon: { duration: 25, intensity: 0.6, pattern: [15, 5, 10] },
  rarity_rare: { duration: 35, intensity: 0.8, pattern: [20, 5, 15, 5, 10] },
  rarity_legendary: { duration: 60, intensity: 1.0, pattern: [30, 10, 20, 10, 30] },
};

class HapticService {
  private isSupported: boolean;
  private isEnabled: boolean = true;
  private lastFeedbackTime: number = 0;
  private feedbackQueue: Array<{ config: HapticFeedbackConfig; timestamp: number }> = [];
  private readonly THROTTLE_MS = 16; // ~60fps throttling

  constructor() {
    this.isSupported = 'vibrate' in navigator;
    
    // Check for battery API to be conservative on mobile
    if ('getBattery' in navigator) {
      (navigator as any).getBattery?.().then((battery: any) => {
        if (battery.level < 0.2) {
          this.isEnabled = false; // Disable on low battery
        }
      });
    }
  }

  /**
   * Check if haptic feedback is available and enabled
   */
  isAvailable(): boolean {
    return this.isSupported && this.isEnabled;
  }

  /**
   * Enable or disable haptic feedback
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Execute haptic feedback with performance considerations
   */
  feedback(config: HapticFeedbackConfig, performanceQuality?: QualityLevel): void {
    if (!this.isAvailable()) return;

    const now = Date.now();
    
    // Throttle feedback to prevent performance issues
    if (now - this.lastFeedbackTime < this.THROTTLE_MS) {
      this.queueFeedback(config, now);
      return;
    }

    this.executeFeedback(config, performanceQuality);
    this.lastFeedbackTime = now;
  }

  /**
   * Queue feedback for throttled execution
   */
  private queueFeedback(config: HapticFeedbackConfig, timestamp: number): void {
    this.feedbackQueue.push({ config, timestamp });
    
    // Limit queue size
    if (this.feedbackQueue.length > 3) {
      this.feedbackQueue.shift();
    }

    // Process queue after throttle period
    setTimeout(() => {
      this.processQueue();
    }, this.THROTTLE_MS);
  }

  /**
   * Process queued feedback
   */
  private processQueue(): void {
    if (this.feedbackQueue.length === 0) return;

    const { config } = this.feedbackQueue.shift()!;
    this.executeFeedback(config);
    this.lastFeedbackTime = Date.now();
  }

  /**
   * Execute the actual haptic feedback
   */
  private executeFeedback(config: HapticFeedbackConfig, performanceQuality?: QualityLevel): void {
    const pattern = HAPTIC_PATTERNS[config.pattern];
    if (!pattern) return;

    // Adjust intensity based on performance quality
    let adjustedIntensity = pattern.intensity;
    if (performanceQuality === 'low') {
      adjustedIntensity *= 0.5; // Reduce intensity on low performance
    } else if (performanceQuality === 'ultra') {
      adjustedIntensity = Math.min(1.0, adjustedIntensity * 1.2); // Boost on high performance
    }

    // Override with custom values if provided
    const duration = config.duration ?? pattern.duration;
    const intensity = config.intensity ?? adjustedIntensity;

    try {
      if (pattern.pattern) {
        // Complex pattern with multiple vibrations
        const scaledPattern = pattern.pattern.map(p => Math.round(p * intensity));
        navigator.vibrate(scaledPattern);
      } else {
        // Simple single vibration
        const scaledDuration = Math.round(duration * intensity);
        navigator.vibrate(scaledDuration);
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Quick access methods for common patterns
   */
  light(): void {
    this.feedback({ pattern: 'light' });
  }

  medium(): void {
    this.feedback({ pattern: 'medium' });
  }

  heavy(): void {
    this.feedback({ pattern: 'heavy' });
  }

  success(): void {
    this.feedback({ pattern: 'success' });
  }

  error(): void {
    this.feedback({ pattern: 'error' });
  }

  rarity(rarity: 'common' | 'uncommon' | 'rare' | 'legendary'): void {
    this.feedback({ pattern: `rarity_${rarity}` as HapticPattern });
  }

  /**
   * Stop all haptic feedback
   */
  stop(): void {
    if (this.isSupported) {
      navigator.vibrate(0);
    }
    this.feedbackQueue = [];
  }
}

// Export singleton instance
export const hapticService = new HapticService();