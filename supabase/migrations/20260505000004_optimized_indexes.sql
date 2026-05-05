-- GIN index for tags searching
CREATE INDEX IF NOT EXISTS idx_trend_metadata_tags ON public.trend_metadata USING GIN (tags);

-- B-Tree index for feed sorting (created_at)
CREATE INDEX IF NOT EXISTS idx_trends_created_at ON public.trends (created_at DESC);

-- B-Tree index for feed sorting (precomputed score)
CREATE INDEX IF NOT EXISTS idx_trend_scores_score ON public.trend_scores (score DESC);

-- B-Tree indexes for relationship lookups
CREATE INDEX IF NOT EXISTS idx_engagements_trend_id ON public.engagements (trend_id);
CREATE INDEX IF NOT EXISTS idx_engagements_user_id ON public.engagements (user_id);
CREATE INDEX IF NOT EXISTS idx_saves_user_id ON public.saves (user_id);
CREATE INDEX IF NOT EXISTS idx_products_trend_id ON public.products (trend_id);
CREATE INDEX IF NOT EXISTS idx_clickouts_product_id ON public.clickouts (product_id);
