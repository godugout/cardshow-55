-- Fix the trigger function that's causing the constraint error
-- Drop and recreate the function with proper constraint handling

-- First add a unique constraint on team_id if it doesn't exist
ALTER TABLE team_color_palettes 
ADD CONSTRAINT team_color_palettes_team_id_unique UNIQUE (team_id);

-- Drop the existing function
DROP FUNCTION IF EXISTS generate_team_palette();

-- Recreate with proper error handling
CREATE OR REPLACE FUNCTION generate_team_palette()
RETURNS TRIGGER AS $$
DECLARE
    optimal_navbar_bg TEXT := '240 5 95';
    optimal_text_primary TEXT := '240 6 11';
BEGIN
    -- Simple palette generation without ON CONFLICT for now
    INSERT INTO public.team_color_palettes (
        team_id,
        primary_hsl,
        secondary_hsl,
        accent_hsl,
        neutral_hsl,
        navbar_bg_hsl,
        text_primary_hsl,
        text_secondary_hsl,
        cta_bg_hsl,
        contrast_ratio,
        accessibility_level
    ) VALUES (
        NEW.id,
        '0 0 50',
        '0 0 100',
        '0 0 75', 
        '0 0 25',
        optimal_navbar_bg,
        optimal_text_primary,
        '0 0 70',
        '0 0 60',
        4.5,
        'AA'
    );
    
    RETURN NEW;
EXCEPTION WHEN unique_violation THEN
    -- If team already exists, update it
    UPDATE team_color_palettes 
    SET 
        navbar_bg_hsl = optimal_navbar_bg,
        text_primary_hsl = optimal_text_primary,
        updated_at = now()
    WHERE team_id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;