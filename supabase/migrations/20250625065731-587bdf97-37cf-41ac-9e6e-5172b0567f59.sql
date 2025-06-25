
-- Create admin roles and permissions system
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert core permissions
INSERT INTO public.admin_permissions (permission_name, description, category) VALUES
('user_management', 'Manage user accounts and profiles', 'users'),
('content_moderation', 'Moderate content and handle reports', 'content'),
('financial_management', 'Access financial data and transactions', 'finance'),
('system_administration', 'Full system administration access', 'system'),
('analytics_access', 'Access to analytics and reporting', 'analytics'),
('support_management', 'Handle support tickets and user issues', 'support');

-- Create role permissions mapping
CREATE TABLE IF NOT EXISTS public.admin_role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  permission_id UUID REFERENCES public.admin_permissions(id) ON DELETE CASCADE,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, permission_id)
);

-- Insert default role permissions
INSERT INTO public.admin_role_permissions (role, permission_id) 
SELECT 'super_admin', id FROM public.admin_permissions;

INSERT INTO public.admin_role_permissions (role, permission_id) 
SELECT 'admin', id FROM public.admin_permissions WHERE category IN ('users', 'content', 'analytics', 'support');

INSERT INTO public.admin_role_permissions (role, permission_id) 
SELECT 'moderator', id FROM public.admin_permissions WHERE category IN ('content', 'support');

-- Enhanced audit logs with better structure
ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS automated_action BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Create content moderation queue
CREATE TABLE IF NOT EXISTS public.content_moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  reported_by UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'escalated')),
  ai_flags JSONB DEFAULT '{}',
  moderator_notes TEXT,
  resolution_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create user analytics aggregation table
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  metric_date DATE NOT NULL,
  login_count INTEGER DEFAULT 0,
  cards_created INTEGER DEFAULT 0,
  cards_viewed INTEGER DEFAULT 0,
  transactions_count INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  session_duration_minutes INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, metric_date)
);

-- Create system metrics table
CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT DEFAULT 'gauge' CHECK (metric_type IN ('gauge', 'counter', 'histogram')),
  tags JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial transactions aggregation
CREATE TABLE IF NOT EXISTS public.financial_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date DATE NOT NULL,
  total_revenue NUMERIC DEFAULT 0,
  total_fees NUMERIC DEFAULT 0,
  total_payouts NUMERIC DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  avg_transaction_value NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(transaction_date)
);

-- Create support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL DEFAULT 'TKT-' || EXTRACT(epoch FROM NOW())::INTEGER,
  user_id UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  resolution TEXT,
  first_response_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ticket messages
CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- Create function to check admin permissions
CREATE OR REPLACE FUNCTION public.has_admin_permission(permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_roles ar
    JOIN public.admin_role_permissions arp ON ar.role = arp.role
    JOIN public.admin_permissions ap ON arp.permission_id = ap.id
    WHERE ar.user_id = auth.uid() 
    AND ap.permission_name = has_admin_permission.permission_name
  );
$$;

-- Create RLS policies for admin tables
CREATE POLICY "Admin users can manage permissions" ON public.admin_permissions
  FOR ALL USING (public.has_admin_permission('system_administration'));

CREATE POLICY "Admin users can view role permissions" ON public.admin_role_permissions
  FOR SELECT USING (public.has_admin_permission('user_management'));

CREATE POLICY "Moderators can access moderation queue" ON public.content_moderation_queue
  FOR ALL USING (public.has_admin_permission('content_moderation'));

CREATE POLICY "Admin users can view user analytics" ON public.user_analytics
  FOR SELECT USING (public.has_admin_permission('analytics_access'));

CREATE POLICY "Admin users can view system metrics" ON public.system_metrics
  FOR SELECT USING (public.has_admin_permission('system_administration'));

CREATE POLICY "Admin users can view financial analytics" ON public.financial_analytics
  FOR SELECT USING (public.has_admin_permission('financial_management'));

CREATE POLICY "Support staff can manage tickets" ON public.support_tickets
  FOR ALL USING (public.has_admin_permission('support_management'));

CREATE POLICY "Support staff can manage ticket messages" ON public.support_ticket_messages
  FOR ALL USING (public.has_admin_permission('support_management'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id_created_at ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_moderation_status ON public.content_moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_user_analytics_date ON public.user_analytics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_system_metrics_name_recorded ON public.system_metrics(metric_name, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
