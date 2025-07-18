import { TemplateEngine, AnimationFrame } from '../engine';

// Convert existing CosmicDance keyframes to template engine format
const COSMIC_KEYFRAMES: AnimationFrame[] = [
  {
    progress: 0,
    sun: { x: -30, y: 80, scale: 0.8, opacity: 0.3, glow: 0.2, color: '#FFA500' },
    moon: { x: 0, y: 80, scale: 0.2, opacity: 0.4 },
    card: { y: 0, lean: 0 },
    environment: { backgroundColor: 'rgba(15, 15, 15, 0.95)', intensity: 0.3 },
    lighting: { intensity: 0.4, color: '#FFA500' }
  },
  {
    progress: 0.2,
    sun: { x: -15, y: 70, scale: 1.0, opacity: 0.5, glow: 0.4, color: '#FFB84D' },
    moon: { x: 0, y: 100, scale: 0.3, opacity: 0.6 },
    card: { y: -2, lean: 2 },
    environment: { backgroundColor: 'rgba(20, 15, 25, 0.9)', intensity: 0.5 },
    lighting: { intensity: 0.6, color: '#FFB84D' }
  },
  {
    progress: 0.4,
    sun: { x: 0, y: 60, scale: 1.2, opacity: 0.7, glow: 0.6, color: '#FFD700' },
    moon: { x: 0, y: 110, scale: 0.4, opacity: 0.8 },
    card: { y: -5, lean: 5 },
    environment: { backgroundColor: 'rgba(25, 20, 35, 0.85)', intensity: 0.7 },
    lighting: { intensity: 0.8, color: '#FFD700' }
  },
  {
    progress: 0.6,
    sun: { x: 15, y: 50, scale: 1.4, opacity: 0.9, glow: 0.8, color: '#FFED4E' },
    moon: { x: 0, y: 110, scale: 0.4, opacity: 0.8 },
    card: { y: -8, lean: 8 },
    environment: { backgroundColor: 'rgba(30, 25, 45, 0.8)', intensity: 0.85 },
    lighting: { intensity: 1.0, color: '#FFED4E' }
  },
  {
    progress: 0.8,
    sun: { x: 30, y: 40, scale: 1.6, opacity: 1.0, glow: 1.0, color: '#FFF700' },
    moon: { x: 0, y: 120, scale: 0.5, opacity: 0.9 },
    card: { y: -10, lean: 10 },
    environment: { backgroundColor: 'rgba(35, 30, 55, 0.75)', intensity: 0.9 },
    lighting: { intensity: 1.2, color: '#FFF700' }
  },
  {
    progress: 1.0,
    sun: { x: 45, y: 30, scale: 1.8, opacity: 1.0, glow: 1.2, color: '#FFFFFF' },
    moon: { x: 0, y: 120, scale: 0.5, opacity: 0.9 },
    card: { y: -12, lean: 12, lock: true },
    environment: { backgroundColor: 'rgba(40, 35, 65, 0.7)', intensity: 1.0 },
    lighting: { intensity: 1.5, color: '#FFFFFF' }
  }
];

export const cosmicTemplate: TemplateEngine = {
  id: 'cosmic',
  name: 'Cosmic Dance',
  initialCamera: {
    position: [0, 0, 5],
    target: [0, 0, 0],
    zoom: 1
  },
  keyframes: COSMIC_KEYFRAMES,
  autoTrigger: true,
  transitionToStudio: true,
  replayable: true
};