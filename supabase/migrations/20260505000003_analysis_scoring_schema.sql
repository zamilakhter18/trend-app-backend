-- Create ai_analysis table
CREATE TABLE IF NOT EXISTS public.ai_analysis (
  trend_id UUID PRIMARY KEY REFERENCES public.trends(id) ON DELETE CASCADE,
  raw_analysis JSONB,
  refined_summary TEXT,
  keywords TEXT[] DEFAULT '{}',
  vision_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trend_scores table
CREATE TABLE IF NOT EXISTS public.trend_scores (
  trend_id UUID PRIMARY KEY REFERENCES public.trends(id) ON DELETE CASCADE,
  score DECIMAL DEFAULT 0,
  velocity DECIMAL DEFAULT 0,
  engagement_count INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Create sponsored_content table
CREATE TABLE IF NOT EXISTS public.sponsored_content (
  trend_id UUID PRIMARY KEY REFERENCES public.trends(id) ON DELETE CASCADE,
  advertiser_id UUID REFERENCES public.user_profile(user_id) ON DELETE SET NULL,
  budget DECIMAL,
  bid_amount DECIMAL,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsored_content ENABLE ROW LEVEL SECURITY;
