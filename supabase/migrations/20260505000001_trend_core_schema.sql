-- Create trends table
CREATE TABLE IF NOT EXISTS public.trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profile(user_id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  phase TEXT DEFAULT 'emerging' CHECK (phase IN ('emerging', 'rising', 'peak', 'fading')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trend_content table
CREATE TABLE IF NOT EXISTS public.trend_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id UUID REFERENCES public.trends(id) ON DELETE CASCADE,
  content_url TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'video', 'image', 'link'
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trend_metadata table
CREATE TABLE IF NOT EXISTS public.trend_metadata (
  trend_id UUID PRIMARY KEY REFERENCES public.trends(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  sentiment_score DECIMAL,
  ai_summary TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_metadata ENABLE ROW LEVEL SECURITY;
