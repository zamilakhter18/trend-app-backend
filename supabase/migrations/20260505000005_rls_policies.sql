-- User Profiles: Public read, owner update
CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profile
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profile
  FOR UPDATE USING (auth.uid() = user_id);

-- Trends: Public read, creator write
CREATE POLICY "Trends are viewable by everyone" ON public.trends
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own trends" ON public.trends
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own trends" ON public.trends
  FOR UPDATE USING (auth.uid() = creator_id);

-- Trend Content: Public read, creator of trend write
CREATE POLICY "Trend content is viewable by everyone" ON public.trend_content
  FOR SELECT USING (true);

-- Engagements: Public read, owner write
CREATE POLICY "Engagements are viewable by everyone" ON public.engagements
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own engagements" ON public.engagements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Saves: Owner read/write
CREATE POLICY "Users can view their own saves" ON public.saves
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saves" ON public.saves
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves" ON public.saves
  FOR DELETE USING (auth.uid() = user_id);

-- Products: Public read
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

-- Scoring and AI: Public read, restricted write
CREATE POLICY "Trend scores are viewable by everyone" ON public.trend_scores
  FOR SELECT USING (true);

CREATE POLICY "AI analysis is viewable by everyone" ON public.ai_analysis
  FOR SELECT USING (true);
