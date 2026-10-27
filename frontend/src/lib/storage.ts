import { BusinessConfig, SurprisePackage, SurpriseService, AddonItem } from '../types';
import { INITIAL_CONFIG, INITIAL_PACKAGES, INITIAL_SERVICES, INITIAL_ADDONS } from '../data/initialData';
import {
  loginAdminApi,
  checkAdminAuthApi,
  logoutAdminApi,
  fetchPackagesApi,
  savePackageApi,
  deletePackageApi,
  uploadPackagePhotoApi,
  fetchConfigApi,
  saveConfigApi,
  getStoredAdminToken,
  submitInquiryApi,
  fetchInquiriesApi,
  updateInquiryStatusApi,
  fetchAddonsApi,
  fetchServicesApi,
  fetchStatusApi
} from './api';

export {
  loginAdminApi,
  checkAdminAuthApi,
  logoutAdminApi,
  fetchPackagesApi,
  savePackageApi,
  deletePackageApi,
  uploadPackagePhotoApi,
  fetchConfigApi,
  saveConfigApi,
  getStoredAdminToken,
  submitInquiryApi,
  fetchInquiriesApi,
  updateInquiryStatusApi,
  fetchAddonsApi,
  fetchServicesApi,
  fetchStatusApi
};

export interface AppState {
  config: BusinessConfig;
  packages: SurprisePackage[];
  services: SurpriseService[];
  addons: AddonItem[];
}

export function loadInitialState(): AppState {
  return {
    config: INITIAL_CONFIG,
    packages: INITIAL_PACKAGES,
    services: INITIAL_SERVICES,
    addons: INITIAL_ADDONS
  };
}

export function generateSupabaseSQL(): string {
  return `-- ====================================================================
-- SUPABASE SCHEMA FOR MOVEMENT CRAFT (SURPRISE EVENT PLANNERS)
-- No customer inquiries are stored in the database.
-- Strictly for Packages, Media Storage, and Admin Management.
-- ====================================================================

-- 1. Packages Table
CREATE TABLE IF NOT EXISTS public.packages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    badge TEXT,
    starting_price NUMERIC NOT NULL,
    discounted_price NUMERIC,
    inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    addons JSONB NOT NULL DEFAULT '[]'::jsonb,
    customization_enabled BOOLEAN DEFAULT true,
    terms TEXT,
    display_order INTEGER DEFAULT 1,
    is_published BOOLEAN DEFAULT true,
    popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Website Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4. Public Policies (Anonymous visitors can read published packages only)
CREATE POLICY "Public can view published packages"
ON public.packages FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "Public can view site settings"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (true);

-- 5. Administrator Policies (Authenticated admin accounts have full management access)
CREATE POLICY "Admins have full access to packages"
ON public.packages FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins have full access to settings"
ON public.site_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Storage Bucket for Package Photographs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('packages-media', 'packages-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view package images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'packages-media');

CREATE POLICY "Authenticated admins can upload package images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'packages-media');

CREATE POLICY "Authenticated admins can update/delete package images"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'packages-media');
`;
}
