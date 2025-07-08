/**
 * Revolutionary Interactive Card System
 * Foundation types for living, breathing digital trading cards
 */

// ============= Core Interactive Card Types =============

export type CardBehaviorTrigger = 
  | 'tap' | 'hover' | 'swipe' | 'shake' | 'heartbeat' | 'voice'
  | 'weather_rain' | 'weather_sun' | 'weather_snow' | 'weather_storm'
  | 'time_morning' | 'time_noon' | 'time_evening' | 'time_night'
  | 'proximity' | 'temperature' | 'orientation' | 'scroll'
  | 'card_collection_complete' | 'other_card_nearby' | 'achievement_unlock';

export type CardStateCondition = 
  | 'always' | 'never' | 'random' | 'timer' | 'user_level' 
  | 'card_age' | 'view_count' | 'weather' | 'time_of_day'
  | 'biometric_data' | 'device_orientation' | 'battery_level';

export interface CardBehaviorAction {
  id: string;
  type: 'animation' | 'sound' | 'particle_effect' | 'state_change' | 'mini_game' | 'reveal_content' | 'haptic_feedback';
  parameters: Record<string, any>;
  duration?: number;
  delay?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'bounce' | 'elastic';
}

export interface CardBehaviorRule {
  id: string;
  name: string;
  trigger: CardBehaviorTrigger;
  conditions: Array<{
    type: CardStateCondition;
    value: any;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'matches';
  }>;
  actions: CardBehaviorAction[];
  cooldown?: number; // milliseconds
  maxExecutions?: number;
  priority: number;
}

export interface CardState {
  id: string;
  name: string;
  description?: string;
  visual_properties: {
    background?: string;
    opacity?: number;
    scale?: number;
    rotation?: number;
    filter?: string;
    overlay?: string;
    particles?: ParticleSystemConfig;
  };
  audio_properties?: {
    background_music?: string;
    sound_effects?: Array<{
      trigger: string;
      audio_url: string;
      volume: number;
    }>;
  };
  transition_rules: CardBehaviorRule[];
}

// ============= Particle System =============

export interface ParticleSystemConfig {
  id: string;
  type: 'fire' | 'water' | 'lightning' | 'sparkles' | 'snow' | 'smoke' | 'magic' | 'custom';
  emission_rate: number;
  particle_count: number;
  lifetime: number;
  size: { min: number; max: number };
  velocity: { min: number; max: number };
  direction: { x: number; y: number };
  gravity: number;
  color_start: string;
  color_end: string;
  blend_mode: 'normal' | 'multiply' | 'screen' | 'overlay';
  texture?: string;
  physics_enabled: boolean;
}

// ============= Mini-Games =============

export type MiniGameType = 'scratch_off' | 'puzzle' | 'memory' | 'tap_sequence' | 'gesture_match' | 'rhythm' | 'quiz';

export interface MiniGameConfig {
  id: string;
  type: MiniGameType;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit?: number;
  reward_on_completion: {
    unlock_state?: string;
    reveal_content?: string;
    unlock_mini_game?: string;
    award_points?: number;
  };
  parameters: Record<string, any>;
}

// ============= Typography & Text Effects =============

export interface KineticTextConfig {
  id: string;
  text: string;
  font_family: string;
  font_size: number;
  font_weight: number;
  animation_type: 'typewriter' | 'wave' | 'bounce' | 'glow' | 'rainbow' | 'glitch' | 'matrix';
  animation_speed: number;
  animation_delay: number;
  color_scheme: string[];
  stroke_width?: number;
  stroke_color?: string;
  shadow_config?: {
    offset_x: number;
    offset_y: number;
    blur: number;
    color: string;
  };
}

// ============= Biometric Integration =============

export interface BiometricTrigger {
  id: string;
  type: 'heartbeat' | 'breathing' | 'stress_level' | 'activity_level' | 'sleep_quality';
  threshold_low: number;
  threshold_high: number;
  actions_on_trigger: CardBehaviorAction[];
}

// ============= Cross-Platform Card DNA =============

export interface CardDNA {
  genetic_code: string; // Unique hash representing card's core traits
  remix_permissions: {
    allow_visual_remix: boolean;
    allow_behavior_remix: boolean;
    allow_audio_remix: boolean;
    require_attribution: boolean;
    commercial_use: boolean;
  };
  inheritance_traits: Array<{
    trait_name: string;
    trait_value: any;
    dominance: number; // 0-1, how likely this trait is to be inherited
  }>;
  generation: number; // How many times this card has been remixed
  parent_cards: string[]; // IDs of cards this was remixed from
}

// ============= Collaborative Features =============

export interface CardFusionRequest {
  id: string;
  initiator_card_id: string;
  target_card_id: string;
  fusion_type: 'visual_merge' | 'behavior_merge' | 'complete_fusion';
  proposed_changes: Partial<InteractiveCardData>;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  expiry_date: string;
}

// ============= Environmental Responsiveness =============

export interface EnvironmentalConfig {
  weather_enabled: boolean;
  time_enabled: boolean;
  location_enabled: boolean;
  device_sensors_enabled: boolean;
  
  weather_effects: Array<{
    weather_type: 'rain' | 'snow' | 'sun' | 'storm' | 'fog' | 'wind';
    visual_changes: Partial<CardState['visual_properties']>;
    audio_changes?: Partial<CardState['audio_properties']>;
    particle_effects?: ParticleSystemConfig[];
  }>;
  
  time_effects: Array<{
    time_range: { start: string; end: string }; // 24h format
    visual_changes: Partial<CardState['visual_properties']>;
    audio_changes?: Partial<CardState['audio_properties']>;
  }>;
}

// ============= Main Interactive Card Structure =============

export interface InteractiveCardData {
  // Base card properties (extends existing CardData)
  id: string;
  title: string;
  description?: string;
  rarity: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  
  // Interactive features
  is_interactive: boolean;
  default_state_id: string;
  states: CardState[];
  behavior_rules: CardBehaviorRule[];
  
  // Media assets
  assets: {
    images: Array<{ id: string; url: string; type: 'layer' | 'background' | 'overlay' | 'texture' }>;
    audio: Array<{ id: string; url: string; type: 'background' | 'effect' | 'voice' }>;
    videos: Array<{ id: string; url: string; type: 'background' | 'overlay' | 'effect' }>;
    models_3d: Array<{ id: string; url: string; format: 'gltf' | 'obj' | 'fbx' }>;
  };
  
  // Interactive systems
  particle_systems: ParticleSystemConfig[];
  mini_games: MiniGameConfig[];
  kinetic_text: KineticTextConfig[];
  biometric_triggers: BiometricTrigger[];
  environmental_config: EnvironmentalConfig;
  
  // Collaboration & DNA
  card_dna: CardDNA;
  fusion_history: Array<{
    fusion_id: string;
    fused_with: string[];
    fusion_date: string;
    fusion_type: string;
  }>;
  
  // Distribution & Platform Integration
  platform_optimizations: {
    discord: { animated: boolean; size_limit: number };
    twitter: { gif_preview: string; static_fallback: string };
    instagram: { story_format: string; post_format: string };
    tiktok: { vertical_format: string; effects_enabled: boolean };
  };
  
  // Performance & Quality
  performance_profile: {
    target_fps: number;
    memory_budget: number; // MB
    battery_impact: 'low' | 'medium' | 'high';
    network_requirements: 'offline' | 'minimal' | 'streaming';
  };
  
  // Marketplace & API
  api_endpoints: Array<{
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT';
    purpose: string;
    authentication_required: boolean;
  }>;
  
  // QR & Physical Integration
  qr_code_data?: {
    qr_url: string;
    physical_card_id?: string;
    unlock_conditions?: Array<{
      type: 'scan_count' | 'location' | 'time_window';
      value: any;
    }>;
  };
  
  // Version control for collaborative editing
  version: number;
  edit_history: Array<{
    editor_id: string;
    timestamp: string;
    changes: Partial<InteractiveCardData>;
    change_description: string;
  }>;
}

// ============= Visual Programming Types =============

export interface VisualNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'logic' | 'data';
  position: { x: number; y: number };
  inputs: Array<{ id: string; type: string; connected_to?: string }>;
  outputs: Array<{ id: string; type: string; connected_to?: string[] }>;
  parameters: Record<string, any>;
  ui_data: {
    color: string;
    icon: string;
    label: string;
  };
}

export interface VisualConnection {
  id: string;
  from_node: string;
  from_output: string;
  to_node: string;
  to_input: string;
}

export interface VisualBehaviorGraph {
  id: string;
  name: string;
  description?: string;
  nodes: VisualNode[];
  connections: VisualConnection[];
  variables: Array<{
    id: string;
    name: string;
    type: 'number' | 'string' | 'boolean' | 'object';
    default_value: any;
  }>;
}

// ============= Testing & Simulation =============

export interface CardTestScenario {
  id: string;
  name: string;
  description: string;
  environment: {
    device_type: 'mobile' | 'tablet' | 'desktop' | 'vr';
    weather: string;
    time_of_day: string;
    user_biometrics?: {
      heartbeat: number;
      stress_level: number;
    };
  };
  expected_outcomes: Array<{
    trigger: string;
    expected_action: string;
    success_criteria: string;
  }>;
}

export interface MockBattleConfig {
  opponent_card: string;
  battle_type: 'turn_based' | 'real_time' | 'puzzle';
  victory_conditions: Array<{
    condition: string;
    points: number;
  }>;
  special_interactions: Array<{
    when: string;
    effect: string;
  }>;
}