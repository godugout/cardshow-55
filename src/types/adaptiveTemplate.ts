
import type { ModularTemplate, CardElement, ElementPosition } from './modularTemplate';

export interface AdaptiveLayout {
  square: {
    imagePosition: ElementPosition;
    infoZones: InfoZone[];
  };
  fullBleed: {
    imagePosition: ElementPosition;
    infoZones: InfoZone[];
  };
}

export interface InfoZone {
  id: string;
  position: ElementPosition;
  type: 'title' | 'subtitle' | 'stats' | 'logo' | 'decoration';
  priority: number; // 1-5, higher means more important to keep visible
}

export interface AdaptiveTemplate extends ModularTemplate {
  adaptiveLayout: AdaptiveLayout;
  centerProtection: {
    radius: number; // percentage of image to keep clear in center
    minVisibleArea: number; // minimum % of image that must remain visible
  };
  supportedFormats: ('square' | 'circle' | 'fullBleed')[];
}

export interface AdaptiveCardPreviewProps {
  template: AdaptiveTemplate;
  selectedPhoto?: string;
  imageFormat: 'square' | 'circle' | 'fullBleed';
  customElements?: Partial<CardElement>[];
  className?: string;
}
