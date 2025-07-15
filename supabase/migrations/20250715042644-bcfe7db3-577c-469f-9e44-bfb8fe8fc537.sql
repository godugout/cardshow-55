-- Create table for storing ransom letter elements
CREATE TABLE public.ransom_letter_elements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character TEXT NOT NULL, -- The letter/character (A, B, C, etc.)
  display_name TEXT NOT NULL, -- Human readable name
  
  -- Visual style properties
  font_family TEXT NOT NULL,
  font_size_em NUMERIC NOT NULL DEFAULT 1.0,
  font_weight TEXT NOT NULL DEFAULT 'normal',
  font_style TEXT NOT NULL DEFAULT 'normal',
  text_color TEXT NOT NULL,
  text_shadow TEXT,
  text_decoration TEXT DEFAULT 'none',
  
  -- Background properties  
  background_color TEXT,
  background_pattern TEXT, -- solid, gradient, stripes, dots, etc.
  background_css TEXT, -- Full CSS background property
  
  -- Layout properties
  border_radius TEXT DEFAULT '0px',
  border_style TEXT DEFAULT 'none',
  padding TEXT DEFAULT '4px 6px',
  margin TEXT DEFAULT '0 2px',
  box_shadow TEXT DEFAULT 'none',
  
  -- Animation/transform properties
  rotation_deg NUMERIC DEFAULT 0,
  skew_deg NUMERIC DEFAULT 0,
  scale_factor NUMERIC DEFAULT 1.0,
  
  -- Image references (if using actual images)
  image_url TEXT,
  thumbnail_url TEXT,
  
  -- Categorization
  style_category TEXT NOT NULL DEFAULT 'classic', -- classic, newspaper, magazine, metallic, pop-art, etc.
  source_type TEXT NOT NULL DEFAULT 'generated', -- generated, scanned, traced, etc.
  rarity TEXT NOT NULL DEFAULT 'common', -- common, uncommon, rare, epic
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_ransom_elements_character ON public.ransom_letter_elements(character);
CREATE INDEX idx_ransom_elements_style_category ON public.ransom_letter_elements(style_category);
CREATE INDEX idx_ransom_elements_rarity ON public.ransom_letter_elements(rarity);
CREATE INDEX idx_ransom_elements_tags ON public.ransom_letter_elements USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE public.ransom_letter_elements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view ransom elements" 
ON public.ransom_letter_elements 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create ransom elements" 
ON public.ransom_letter_elements 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own ransom elements" 
ON public.ransom_letter_elements 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own ransom elements" 
ON public.ransom_letter_elements 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_ransom_elements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ransom_elements_updated_at
BEFORE UPDATE ON public.ransom_letter_elements
FOR EACH ROW
EXECUTE FUNCTION public.update_ransom_elements_updated_at();

-- Insert some sample elements based on the reference images
INSERT INTO public.ransom_letter_elements (
  character, display_name, font_family, font_size_em, font_weight, 
  text_color, background_css, style_category, rarity, tags, description
) VALUES 
-- Classic newspaper style letters
('A', 'Bold Red A', 'Arial Black', 1.2, 'bold', '#ffffff', '#dc2626', 'newspaper', 'common', ARRAY['bold', 'red', 'classic'], 'Bold red background with white text'),
('B', 'Blue Comic B', 'Comic Sans MS', 1.1, 'bold', '#1e40af', '#e0f2fe', 'magazine', 'common', ARRAY['blue', 'comic', 'light'], 'Blue text on light blue background'),
('C', 'Yellow Gradient C', 'Impact', 1.3, 'bold', '#7c2d12', 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', 'pop-art', 'uncommon', ARRAY['yellow', 'gradient', 'impact'], 'Yellow gradient background with brown text'),

-- Metallic style letters  
('D', 'Purple Metallic D', 'Georgia', 1.0, 'bold', '#ffffff', 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)', 'metallic', 'rare', ARRAY['purple', 'metallic', 'serif'], 'Metallic purple gradient effect'),
('E', 'Green Vintage E', 'Times New Roman', 1.1, 'normal', '#ffffff', '#059669', 'vintage', 'common', ARRAY['green', 'vintage', 'serif'], 'Classic green background'),

-- Striped and patterned letters
('F', 'Striped Rainbow F', 'Helvetica Neue', 1.2, 'bold', '#000000', 'repeating-linear-gradient(45deg, #ff6b6b, #ff6b6b 8px, #ffffff 8px, #ffffff 16px)', 'pop-art', 'epic', ARRAY['striped', 'rainbow', 'pattern'], 'Rainbow striped pattern'),
('G', 'Halftone Pink G', 'Trebuchet MS', 1.0, 'bold', '#ffffff', 'radial-gradient(circle at 20% 50%, #e91e63 20%, transparent 50%), radial-gradient(circle at 70% 50%, #e91e63 20%, transparent 50%), #fce4ec', 'comic', 'rare', ARRAY['halftone', 'pink', 'dots'], 'Comic book halftone effect');

-- Add more sample data for numbers and symbols
INSERT INTO public.ransom_letter_elements (
  character, display_name, font_family, font_size_em, font_weight, 
  text_color, background_css, style_category, rarity, tags, description
) VALUES 
('1', 'Electric Blue 1', 'Courier New', 1.1, 'bold', '#ffffff', '#2563eb', 'digital', 'common', ARRAY['blue', 'number', 'monospace'], 'Electric blue monospace number'),
('2', 'Orange Pop 2', 'Arial Black', 1.3, 'bold', '#ffffff', '#ea580c', 'pop-art', 'common', ARRAY['orange', 'number', 'bold'], 'Bright orange pop art style'),
('!', 'Red Alert Exclamation', 'Impact', 1.4, 'bold', '#ffffff', '#dc2626', 'alert', 'uncommon', ARRAY['red', 'symbol', 'alert'], 'High impact red exclamation mark'),
('?', 'Mystery Purple Question', 'Georgia', 1.2, 'bold', '#fbbf24', '#7c3aed', 'mystery', 'rare', ARRAY['purple', 'yellow', 'symbol'], 'Mysterious purple with gold text');