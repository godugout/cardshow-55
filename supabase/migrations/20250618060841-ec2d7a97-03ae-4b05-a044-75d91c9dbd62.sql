
-- Add collection templates table
CREATE TABLE IF NOT EXISTS public.collection_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_hash TEXT UNIQUE NOT NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  card_filters JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0
);

-- Add collection memberships for secret groups
CREATE TABLE IF NOT EXISTS public.collection_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  can_view_member_cards BOOLEAN DEFAULT false,
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, user_id)
);

-- Add template_id and group settings to collections
ALTER TABLE public.collections 
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.collection_templates(id),
ADD COLUMN IF NOT EXISTS is_group BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS group_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS allow_member_card_sharing BOOLEAN DEFAULT false;

-- Add RLS policies for collection templates
ALTER TABLE public.collection_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public templates are viewable by everyone" ON public.collection_templates
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own templates" ON public.collection_templates
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can create templates" ON public.collection_templates
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own templates" ON public.collection_templates
  FOR UPDATE USING (auth.uid() = creator_id);

-- Add RLS policies for collection memberships
ALTER TABLE public.collection_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view memberships for their collections" ON public.collection_memberships
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_id AND c.owner_id = auth.uid()
    )
  );

CREATE POLICY "Collection owners can manage memberships" ON public.collection_memberships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_id AND c.owner_id = auth.uid()
    )
  );

-- Function to generate collection group codes
CREATE OR REPLACE FUNCTION generate_group_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
BEGIN
  code := upper(substring(md5(random()::text) from 1 for 8));
  RETURN code;
END;
$$;

-- Function to create collection from template
CREATE OR REPLACE FUNCTION create_collection_from_template(
  template_id UUID,
  collection_title TEXT,
  user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_collection_id UUID;
  template_data RECORD;
BEGIN
  -- Get template data
  SELECT * INTO template_data FROM public.collection_templates WHERE id = template_id;
  
  -- Create new collection
  INSERT INTO public.collections (title, description, owner_id, template_id, visibility)
  VALUES (collection_title, template_data.description, user_id, template_id, 'private')
  RETURNING id INTO new_collection_id;
  
  -- Update template usage count
  UPDATE public.collection_templates 
  SET usage_count = usage_count + 1 
  WHERE id = template_id;
  
  RETURN new_collection_id;
END;
$$;
