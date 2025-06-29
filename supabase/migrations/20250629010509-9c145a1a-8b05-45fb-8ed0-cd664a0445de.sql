
-- Add CRDMKR-specific columns to existing card_templates table
ALTER TABLE card_templates ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'manual';
ALTER TABLE card_templates ADD COLUMN IF NOT EXISTS source_file_url TEXT;
ALTER TABLE card_templates ADD COLUMN IF NOT EXISTS fabric_data JSONB;
ALTER TABLE card_templates ADD COLUMN IF NOT EXISTS layers JSONB DEFAULT '[]'::jsonb;
ALTER TABLE card_templates ADD COLUMN IF NOT EXISTS parameters JSONB DEFAULT '[]'::jsonb;
ALTER TABLE card_templates ADD COLUMN IF NOT EXISTS ai_analysis JSONB;

-- Create processing jobs table for async operations
CREATE TABLE IF NOT EXISTS crdmkr_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size BIGINT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  result JSONB,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team variations table for customizations
CREATE TABLE IF NOT EXISTS crdmkr_team_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES card_templates(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  team_colors JSONB DEFAULT '{}'::jsonb,
  team_logos JSONB DEFAULT '{}'::jsonb,
  parameter_overrides JSONB DEFAULT '{}'::jsonb,
  generated_svg TEXT,
  generated_css TEXT,
  preview_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for CRDMKR tables
ALTER TABLE crdmkr_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crdmkr_team_variations ENABLE ROW LEVEL SECURITY;

-- Processing jobs policies
CREATE POLICY "Users can view their own processing jobs" 
  ON crdmkr_processing_jobs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own processing jobs" 
  ON crdmkr_processing_jobs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own processing jobs" 
  ON crdmkr_processing_jobs FOR UPDATE 
  USING (auth.uid() = user_id);

-- Team variations policies
CREATE POLICY "Users can view team variations for their templates" 
  ON crdmkr_team_variations FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM card_templates ct 
    WHERE ct.id = template_id AND ct.creator_id = auth.uid()
  ));

CREATE POLICY "Users can create team variations for their templates" 
  ON crdmkr_team_variations FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM card_templates ct 
    WHERE ct.id = template_id AND ct.creator_id = auth.uid()
  ));

CREATE POLICY "Users can update team variations for their templates" 
  ON crdmkr_team_variations FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM card_templates ct 
    WHERE ct.id = template_id AND ct.creator_id = auth.uid()
  ));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_crdmkr_processing_jobs_user_id ON crdmkr_processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_crdmkr_processing_jobs_status ON crdmkr_processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_crdmkr_team_variations_template_id ON crdmkr_team_variations(template_id);

-- Add updated_at trigger for team variations
CREATE OR REPLACE FUNCTION update_crdmkr_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_crdmkr_team_variations_updated_at
  BEFORE UPDATE ON crdmkr_team_variations
  FOR EACH ROW
  EXECUTE FUNCTION update_crdmkr_updated_at();

CREATE TRIGGER update_crdmkr_processing_jobs_updated_at
  BEFORE UPDATE ON crdmkr_processing_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_crdmkr_updated_at();
