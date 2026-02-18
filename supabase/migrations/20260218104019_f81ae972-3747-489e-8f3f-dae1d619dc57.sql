
-- ============================================================
-- AR Land & Reality – Complete Database Migration
-- Idempotent: safe to run on a fresh or existing database.
-- ============================================================

-- ── 1. ENUMS ────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── 2. UTILITY FUNCTION ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ── 3. PROFILES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE,
  full_name  text,
  phone      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 4. USER ROLES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_roles (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role    public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own role"  ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles"  ON public.user_roles;

CREATE POLICY "Users can view own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ── 5. ROLE-CHECK SECURITY DEFINER FUNCTION ─────────────────
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- ── 6. PROPERTIES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.properties (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  type         text NOT NULL,
  location     text NOT NULL,
  district     text NOT NULL DEFAULT '',
  price        bigint NOT NULL,
  area         text NOT NULL,
  area_unit    text NOT NULL DEFAULT 'sqft',
  description  text,
  images       text[] DEFAULT '{}',
  features     text[] DEFAULT '{}',
  seller_name  text,
  seller_phone text,
  seller_email text,
  status       text NOT NULL DEFAULT 'active',
  created_by   uuid,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active properties"              ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can submit properties for review" ON public.properties;
DROP POLICY IF EXISTS "Users can view own submissions"                 ON public.properties;
DROP POLICY IF EXISTS "Admins can manage properties"                   ON public.properties;

-- Anyone can view active listings
CREATE POLICY "Public can view active properties"
  ON public.properties FOR SELECT
  USING (
    status = 'active'
    OR has_role(auth.uid(), 'admin'::public.app_role)
    OR created_by = auth.uid()
  );

-- Authenticated users can submit (must be pending + must own it)
CREATE POLICY "Authenticated users can submit properties for review"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (status = 'pending' AND created_by = auth.uid());

-- Admins can do everything
CREATE POLICY "Admins can manage properties"
  ON public.properties FOR ALL
  USING (has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── 7. TRANSACTIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL,
  property_id         uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  property_title      text NOT NULL,
  property_type       text NOT NULL,
  amount              bigint NOT NULL,
  razorpay_order_id   text,
  razorpay_payment_id text,
  razorpay_signature  text,
  status              text NOT NULL DEFAULT 'pending',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions"   ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions"  ON public.transactions;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR ALL
  USING (has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── 8. STORAGE BUCKET ────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can view property images" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete property images" ON storage.objects;

CREATE POLICY "Anyone can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Auth users can upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Admins can delete property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images' AND has_role(auth.uid(), 'admin'::public.app_role));
