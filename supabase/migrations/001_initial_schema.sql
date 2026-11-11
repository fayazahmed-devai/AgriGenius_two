-- =============================================================================
-- AGRO-AI ASSISTANT: COMPLETE PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- Target Database: PostgreSQL 15+ (Supabase)
-- Version: 1.0.0
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up any existing trigger functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- Extends Supabase auth.users with farming-specific demographics
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    country TEXT DEFAULT 'India',
    state TEXT,
    district TEXT,
    village TEXT,
    preferred_language TEXT DEFAULT 'en',
    farming_experience INTEGER DEFAULT 0,
    land_area NUMERIC(12,3),
    land_unit TEXT DEFAULT 'acre',
    farming_type TEXT,
    irrigation_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. FARMS TABLE
-- Specific parcels / farms owned by the farmer
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    location TEXT,
    state TEXT,
    district TEXT,
    soil_type TEXT,
    soil_ph NUMERIC(4,2),
    land_area NUMERIC(12,3) NOT NULL,
    land_unit TEXT DEFAULT 'acre',
    irrigation_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. CROP RECOMMENDATIONS TABLE
-- Stores AI-generated crop suitability advisories
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    input_data JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    advisory_language TEXT DEFAULT 'en',
    model_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. SOIL REPORTS TABLE
-- Stores soil laboratory tests & AI soil health assessments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.soil_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    soil_data JSONB NOT NULL,
    analysis JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. FERTILIZER ADVISORIES TABLE
-- Stores crop stage-specific nutrient & fertilizer recommendations
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fertilizer_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    input_data JSONB NOT NULL,
    advisory JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. IRRIGATION ADVISORIES TABLE
-- Stores water management and irrigation schedules
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.irrigation_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    input_data JSONB NOT NULL,
    advisory JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. DISEASE REPORTS TABLE
-- Stores foliar symptoms, multimodal image paths, and diagnosis reports
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.disease_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    image_path TEXT,
    analysis JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. CULTIVATION CALENDARS TABLE
-- Stores chronologically ordered farming activities from sowing to harvest
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cultivation_calendars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    start_date DATE,
    activities JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. CHAT CONVERSATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. CHAT MESSAGES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- TRIGGERS FOR UPDATED_AT COLUMNS
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_farms_updated_at ON public.farms;
CREATE TRIGGER trg_farms_updated_at
    BEFORE UPDATE ON public.farms
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_calendars_updated_at ON public.cultivation_calendars;
CREATE TRIGGER trg_calendars_updated_at
    BEFORE UPDATE ON public.cultivation_calendars
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER trg_conversations_updated_at
    BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Automatic Profile Creation Trigger when a User signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, preferred_language)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Farmer'),
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_recs_user_id ON public.crop_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_recs_farm_id ON public.crop_recommendations(farm_id);
CREATE INDEX IF NOT EXISTS idx_crop_recs_created ON public.crop_recommendations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_soil_reports_user_id ON public.soil_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_soil_reports_created ON public.soil_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_fert_adv_user_id ON public.fertilizer_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_fert_adv_created ON public.fertilizer_advisories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_irrig_adv_user_id ON public.irrigation_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_irrig_adv_created ON public.irrigation_advisories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_disease_rep_user_id ON public.disease_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_disease_rep_created ON public.disease_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_calendars_user_id ON public.cultivation_calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_calendars_created ON public.cultivation_calendars(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.chat_messages(created_at ASC);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Users can ONLY access their own records
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultivation_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Farms Policies
CREATE POLICY "Users can view own farms" ON public.farms
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own farms" ON public.farms
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own farms" ON public.farms
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own farms" ON public.farms
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Crop Recommendations Policies
CREATE POLICY "Users can view own crop recommendations" ON public.crop_recommendations
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crop recommendations" ON public.crop_recommendations
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own crop recommendations" ON public.crop_recommendations
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Soil Reports Policies
CREATE POLICY "Users can view own soil reports" ON public.soil_reports
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own soil reports" ON public.soil_reports
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own soil reports" ON public.soil_reports
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fertilizer Advisories Policies
CREATE POLICY "Users can view own fertilizer advisories" ON public.fertilizer_advisories
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fertilizer advisories" ON public.fertilizer_advisories
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own fertilizer advisories" ON public.fertilizer_advisories
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Irrigation Advisories Policies
CREATE POLICY "Users can view own irrigation advisories" ON public.irrigation_advisories
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own irrigation advisories" ON public.irrigation_advisories
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own irrigation advisories" ON public.irrigation_advisories
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Disease Reports Policies
CREATE POLICY "Users can view own disease reports" ON public.disease_reports
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disease reports" ON public.disease_reports
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own disease reports" ON public.disease_reports
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Cultivation Calendars Policies
CREATE POLICY "Users can view own calendars" ON public.cultivation_calendars
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendars" ON public.cultivation_calendars
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendars" ON public.cultivation_calendars
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendars" ON public.cultivation_calendars
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Chat Conversations Policies
CREATE POLICY "Users can view own chat conversations" ON public.chat_conversations
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat conversations" ON public.chat_conversations
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat conversations" ON public.chat_conversations
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat conversations" ON public.chat_conversations
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Chat Messages Policies
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
    FOR SELECT TO authenticated USING (
        auth.uid() = user_id AND EXISTS (
            SELECT 1 FROM public.chat_conversations c 
            WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own chat messages" ON public.chat_messages
    FOR INSERT TO authenticated WITH CHECK (
        auth.uid() = user_id AND EXISTS (
            SELECT 1 FROM public.chat_conversations c 
            WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()
        )
    );

-- -----------------------------------------------------------------------------
-- SUPABASE STORAGE CONFIGURATION FOR CROP IMAGES
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('crop-images', 'crop-images', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Authenticated users can upload crop images to their user folder
CREATE POLICY "Users can upload their own crop images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'crop-images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can read their own crop images
CREATE POLICY "Users can view their own crop images"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'crop-images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own crop images
CREATE POLICY "Users can delete their own crop images"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'crop-images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

