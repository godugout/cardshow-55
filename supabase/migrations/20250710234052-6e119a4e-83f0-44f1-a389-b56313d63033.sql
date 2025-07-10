-- Add unique constraint and fix the function properly
-- Add constraint first
DO $$
BEGIN
    ALTER TABLE team_color_palettes 
    ADD CONSTRAINT team_color_palettes_team_id_unique UNIQUE (team_id);
EXCEPTION 
    WHEN duplicate_object THEN 
        RAISE NOTICE 'Constraint already exists';
END $$;

-- Drop the trigger and function with CASCADE, then recreate
DROP FUNCTION IF EXISTS generate_team_palette() CASCADE;

-- Recreate with proper constraint handling
CREATE OR REPLACE FUNCTION generate_team_palette()
RETURNS TRIGGER AS $$
DECLARE
    optimal_navbar_bg TEXT := '240 5 95';
    optimal_text_primary TEXT := '240 6 11';
BEGIN
    -- Use ON CONFLICT now that we have the constraint
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
    )
    ON CONFLICT (team_id) DO UPDATE SET
        navbar_bg_hsl = optimal_navbar_bg,
        text_primary_hsl = optimal_text_primary,
        updated_at = now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER generate_team_palette_trigger
    AFTER INSERT ON sports_teams
    FOR EACH ROW
    EXECUTE FUNCTION generate_team_palette();