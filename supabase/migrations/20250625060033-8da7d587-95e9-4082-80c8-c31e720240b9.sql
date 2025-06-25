
-- Create design projects table for storing creator projects
CREATE TABLE public.design_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text,
  template_id uuid,
  layers jsonb NOT NULL DEFAULT '[]'::jsonb,
  canvas jsonb NOT NULL DEFAULT '{}'::jsonb,
  version integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft',
  collaborators jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_modified timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.design_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for design projects
CREATE POLICY "Users can view their own projects" ON public.design_projects
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can create their own projects" ON public.design_projects
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own projects" ON public.design_projects
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own projects" ON public.design_projects
  FOR DELETE USING (auth.uid() = creator_id);

-- Create project collaborators table
CREATE TABLE public.project_collaborators (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.design_projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  username text NOT NULL,
  role text NOT NULL DEFAULT 'viewer',
  permissions text[] NOT NULL DEFAULT '{}',
  invited_at timestamp with time zone NOT NULL DEFAULT now(),
  joined_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;

-- Create collaboration comments table
CREATE TABLE public.collaboration_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.design_projects(id) ON DELETE CASCADE NOT NULL,
  layer_id text,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  username text NOT NULL,
  content text NOT NULL,
  position jsonb,
  resolved boolean NOT NULL DEFAULT false,
  replies jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collaboration_comments ENABLE ROW LEVEL SECURITY;

-- Create creator templates table (referencing existing card_templates_creator but with proper name)
CREATE TABLE public.creator_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  preview_images text[] NOT NULL DEFAULT '{}',
  category text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  price numeric NOT NULL DEFAULT 0.00,
  download_count integer NOT NULL DEFAULT 0,
  rating numeric NOT NULL DEFAULT 0.00,
  review_count integer NOT NULL DEFAULT 0,
  layers jsonb NOT NULL DEFAULT '[]'::jsonb,
  canvas jsonb NOT NULL DEFAULT '{}'::jsonb,
  license text NOT NULL DEFAULT 'personal',
  compatibility text[] NOT NULL DEFAULT '{}',
  file_size integer NOT NULL DEFAULT 0,
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.creator_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for creator templates
CREATE POLICY "Anyone can view public templates" ON public.creator_templates
  FOR SELECT USING (true);

CREATE POLICY "Creators can manage their own templates" ON public.creator_templates
  FOR ALL USING (auth.uid() = creator_id);
