
-- Create admin roles table
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view admin roles" ON public.admin_roles
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage admin roles" ON public.admin_roles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid()
  ));

-- Insert your user as admin (replace with your actual user ID from auth.users)
-- You'll need to get your user ID after logging in
INSERT INTO public.admin_roles (user_id, role) 
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'jay@godugout.com'
ON CONFLICT (user_id) DO NOTHING;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$;
