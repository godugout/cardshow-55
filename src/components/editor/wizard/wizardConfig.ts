
export const WIZARD_STEPS = [
  { 
    number: 1, 
    title: 'Upload & Frame Selection', 
    description: 'Upload your photo and choose the perfect frame' 
  },
  { 
    number: 2, 
    title: 'Finalize & Publish', 
    description: 'Complete your card details and publish options' 
  }
];

export const BULK_WIZARD_STEPS = [
  { 
    number: 1, 
    title: 'Upload Images', 
    description: 'Select multiple images for batch processing' 
  },
  { 
    number: 2, 
    title: 'Auto-Process', 
    description: 'AI analyzes and creates cards automatically' 
  },
  { 
    number: 3, 
    title: 'Review & Edit', 
    description: 'Review generated cards and make adjustments' 
  },
  { 
    number: 4, 
    title: 'Publish Collection', 
    description: 'Publish your card collection' 
  }
];

// Default templates for backward compatibility
export const DEFAULT_TEMPLATES = [
  {
    id: 'baseball-classic',
    name: 'Baseball Classic',
    category: 'sports',
    description: 'Traditional baseball card layout perfect for player stats',
    usage_count: 1250,
    is_premium: false,
    preview_url: '/templates/baseball-classic.jpg',
    tags: ['baseball', 'sports', 'classic', 'stats']
  }
];
