
-- Create storage bucket for card images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'card-images',
  'card-images', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Create storage bucket for user uploads (general)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-uploads',
  'user-uploads',
  true, 
  15728640, -- 15MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Create RLS policies for card-images bucket
CREATE POLICY "Anyone can view card images" ON storage.objects
FOR SELECT USING (bucket_id = 'card-images');

CREATE POLICY "Authenticated users can upload card images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'card-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own card images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'card-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own card images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'card-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create RLS policies for user-uploads bucket
CREATE POLICY "Anyone can view user uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'user-uploads');

CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-uploads' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Update the existing media table to work with our upload system
ALTER TABLE public.media 
ADD COLUMN IF NOT EXISTS bucket_id text DEFAULT 'user-uploads',
ADD COLUMN IF NOT EXISTS storage_path text;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_media_owner_id ON public.media(owner_id);
CREATE INDEX IF NOT EXISTS idx_media_bucket_id ON public.media(bucket_id);

-- Enable RLS on media table if not already enabled
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for media table
DROP POLICY IF EXISTS "Users can view their own media" ON public.media;
CREATE POLICY "Users can view their own media" ON public.media
FOR SELECT USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own media" ON public.media;
CREATE POLICY "Users can insert their own media" ON public.media
FOR INSERT WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own media" ON public.media;
CREATE POLICY "Users can update their own media" ON public.media
FOR UPDATE USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own media" ON public.media;
CREATE POLICY "Users can delete their own media" ON public.media
FOR DELETE USING (owner_id = auth.uid());
