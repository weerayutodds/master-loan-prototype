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

  loan_purpose text check (loan_purpose in ('need-money', 'buy-car')),
  collateral_type text check (collateral_type in ('motorcycle', 'car', 'truck', 'land')),
  refinance_status text check (refinance_status in ('still-paying', 'paid-off')),

  license_plate_number text,
  license_plate_province text,
  chassis_number text,
  brand_model text,

  -- car_type is CarInfo's body-style dropdown (sedan/pickup/...), distinct
  -- from collateral_type above (the top-level หลักประกัน type).
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

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customer_lead_opportunity_lead_id_idx on customer_lead_opportunity (lead_id);
