-- Source of truth for the database schema.
-- Apply changes here first, then update src/lib/actions and src/types to match.

create extension if not exists pgcrypto;

create table customer_lead (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null unique,
  id_card_number text not null,
  ncb_grade text,
  verification_method text not null default 'manual' check (verification_method in ('card', 'manual')),
  gender text check (gender in ('male', 'female')),
  birth_date date,
  created_at timestamptz not null default now()
);

-- One loan-application attempt for a lead. A customer_lead can have many
-- opportunities (e.g. repeat visits, abandoned drafts) -- each row snapshots
-- the lead's identity at creation time plus every input collected on the
-- Ratebook page, filled in progressively as the user completes that form.
create table customer_lead_opportunity (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references customer_lead (id),

  first_name text not null,
  last_name text not null,
  phone text not null,
  id_card_number text not null,
  ncb_grade text,
  verification_method text not null check (verification_method in ('card', 'manual')),
  gender text check (gender in ('male', 'female')),
  birth_date date,

  loan_purpose text check (loan_purpose in ('need-money', 'buy-car')),
  collateral_type text check (collateral_type in ('motorcycle', 'car', 'truck', 'land')),
  refinance_status text check (refinance_status in ('still-paying', 'paid-off')),
  -- only set when refinance_status = 'still-paying'; free text because the
  -- approved finance list lives in mock data and changes over time.
  existing_finance_company text,

  -- follow-up stage shown on the lead-list card. Only one value exists today
  -- ("ติดตาม"); the domain isn't fully known yet so it's left unconstrained.
  status text not null default 'ติดตาม',
  -- branch/staff assignment shown on the lead-list card. No branch/staff
  -- entity or auth context exists yet, so these are populated with mock
  -- values at creation time rather than modeled as real relations.
  branch_name text,
  reference_code text,
  staff_name text,
  staff_code text,

  license_plate_number text,
  license_plate_province text,
  chassis_number text,
  brand_model text,

  -- Vehicle facts for รถยนต์/มอเตอร์ไซค์ come from the ratebook workbooks
  -- (Ratebook/*.xlsx, see scripts/generate-ratebook.mjs); รถบรรทุก still comes
  -- from the mock catalog. car_brand/car_model/car_sub_model/car_body_type hold
  -- the ratebook's own wording so they can be shown without a lookup, while
  -- car_condition/car_doors/car_transmission stay slugs.
  --
  -- car_type stores the workbook CARTYPE as text (1/2/3/8), distinct from
  -- collateral_type (the top-level หลักประกัน type) and car_body_type.
  -- Mock truck/land vehicles use slugs. Legacy ratebook slugs are not supported.
  car_brand text,
  car_model text,
  car_year text,
  car_condition text,
  car_doors text,
  car_type text,
  car_engine_cc text,
  car_transmission text,
  car_body_type text,
  car_sub_model text,
  -- Identity of the chosen row: the ratebook Code (e.g. MERC04AE) for
  -- รถยนต์/มอเตอร์ไซค์, the mock catalog's sub-model slug for รถบรรทุก. A
  -- Sub-Model alone is not unique -- BENZ S280 2005 lists two priced rows
  -- under "2.8 RWD (2799ซีซี)" -- so this is what the form reloads from.
  car_ratebook_code text,
  -- ราคาประเมิน and Rate Book (วงเงินจัด) of that row. รถบรรทุก has no
  -- ratebook price, so car_ratebook_price stays null there.
  car_appraisal_price integer,
  car_ratebook_price integer,
  selected_product_id text,

  requested_amount text,
  wants_wheel_card text check (wants_wheel_card in ('yes', 'no')),
  has_ppi text check (has_ppi in ('yes', 'no')),
  installment_term text check (installment_term in ('12', '18', '24', '30', '36', '42', '48', '54', '60')),

  possession_date text,
  car_insurance_expiry text,
  car_insurance_company text,
  compulsory_expiry text,
  compulsory_bundled_with_car_insurance boolean not null default false,
  compulsory_company text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customer_lead_opportunity_lead_id_idx on customer_lead_opportunity (lead_id);
