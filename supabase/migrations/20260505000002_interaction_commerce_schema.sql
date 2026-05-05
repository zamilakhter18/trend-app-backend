-- Create engagements table
CREATE TABLE IF NOT EXISTS public.engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profile(user_id) ON DELETE CASCADE,
  trend_id UUID REFERENCES public.trends(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'like', 'comment', 'share'
  content TEXT, -- For comments
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saves table
CREATE TABLE IF NOT EXISTS public.saves (
  user_id UUID REFERENCES public.user_profile(user_id) ON DELETE CASCADE,
  trend_id UUID REFERENCES public.trends(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, trend_id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id UUID REFERENCES public.trends(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL,
  currency TEXT DEFAULT 'USD',
  affiliate_url TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clickouts table
CREATE TABLE IF NOT EXISTS public.clickouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profile(user_id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clickouts ENABLE ROW LEVEL SECURITY;
