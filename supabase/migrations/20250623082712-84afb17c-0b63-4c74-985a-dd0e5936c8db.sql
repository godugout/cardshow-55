
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table first (since other tables reference it)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_profiles' AND schemaname = 'public') THEN
    CREATE TABLE public.user_profiles (
      id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      bio TEXT,
      full_name TEXT,
      location TEXT,
      website TEXT,
      social_links JSONB DEFAULT '{}',
      verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Create user_preferences table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_preferences' AND schemaname = 'public') THEN
    CREATE TABLE public.user_preferences (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
      theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
      quality_settings JSONB DEFAULT '{"texture_quality": "high", "animation_quality": "high", "particle_effects": true}',
      notifications_enabled JSONB DEFAULT '{"trades": true, "messages": true, "updates": true, "marketing": false}',
      privacy_settings JSONB DEFAULT '{"profile_public": true, "collections_public": false, "activity_public": false}',
      accessibility_options JSONB DEFAULT '{"reduced_motion": false, "high_contrast": false, "large_text": false}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Create user_stats table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_stats' AND schemaname = 'public') THEN
    CREATE TABLE public.user_stats (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
      cards_created INTEGER DEFAULT 0,
      cards_owned INTEGER DEFAULT 0,
      trades_completed INTEGER DEFAULT 0,
      total_spent DECIMAL(12,2) DEFAULT 0.00,
      total_earned DECIMAL(12,2) DEFAULT 0.00,
      reputation_score INTEGER DEFAULT 0,
      last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Create card_sets table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'card_sets' AND schemaname = 'public') THEN
    CREATE TABLE public.card_sets (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      release_date DATE,
      total_cards INTEGER DEFAULT 0,
      creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
      is_published BOOLEAN DEFAULT FALSE,
      cover_image_url TEXT,
      price DECIMAL(10,2),
      royalty_percentage DECIMAL(5,2) DEFAULT 5.00,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Now safely update the collections table
DO $$ 
BEGIN
  -- If collections table has owner_id, rename it to user_id
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'owner_id') 
     AND NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'user_id') THEN
    ALTER TABLE public.collections RENAME COLUMN owner_id TO user_id;
  END IF;
  
  -- Add user_id column if it doesn't exist and owner_id didn't exist either
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'user_id') THEN
    ALTER TABLE public.collections ADD COLUMN user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE;
  END IF;

  -- Add other missing columns to collections
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'name') THEN
    ALTER TABLE public.collections ADD COLUMN name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'collections' AND column_name = 'is_public') THEN
    ALTER TABLE public.collections ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Update cards table with missing columns
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'name') THEN
    ALTER TABLE public.cards ADD COLUMN name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'card_set_id') THEN
    ALTER TABLE public.cards ADD COLUMN card_set_id UUID REFERENCES public.card_sets(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'rarity') THEN
    ALTER TABLE public.cards ADD COLUMN rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary'));
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'total_supply') THEN
    ALTER TABLE public.cards ADD COLUMN total_supply INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'current_supply') THEN
    ALTER TABLE public.cards ADD COLUMN current_supply INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'is_tradeable') THEN
    ALTER TABLE public.cards ADD COLUMN is_tradeable BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Create remaining tables
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_card_ownership' AND schemaname = 'public') THEN
    CREATE TABLE public.user_card_ownership (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
      card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
      quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
      acquisition_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      acquisition_method TEXT DEFAULT 'purchase' CHECK (acquisition_method IN ('purchase', 'trade', 'gift', 'created', 'airdrop')),
      acquisition_price DECIMAL(10,2),
      is_favorite BOOLEAN DEFAULT FALSE,
      UNIQUE(user_id, card_id)
    );
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_cards_creator_id ON public.cards(creator_id);
CREATE INDEX IF NOT EXISTS idx_cards_is_public ON public.cards(is_public);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_is_public ON public.collections(is_public);

-- Create trigger functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
