
-- Add missing columns to the cards table
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS crd_catalog_inclusion boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS print_available boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS collection_id uuid REFERENCES public.collections(id),
ADD COLUMN IF NOT EXISTS team_id uuid;

-- Update existing cards to have proper default values
UPDATE public.cards 
SET crd_catalog_inclusion = true 
WHERE crd_catalog_inclusion IS NULL;

UPDATE public.cards 
SET print_available = false 
WHERE print_available IS NULL;

-- Make sure marketplace_listing has proper default for existing records
UPDATE public.cards 
SET marketplace_listing = false 
WHERE marketplace_listing IS NULL;

-- Add index for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_cards_creator_id ON public.cards(creator_id);
CREATE INDEX IF NOT EXISTS idx_cards_visibility ON public.cards(visibility);
CREATE INDEX IF NOT EXISTS idx_cards_is_public ON public.cards(is_public);
