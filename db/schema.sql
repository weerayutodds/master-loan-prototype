-- Source of truth for the database schema.
-- Apply changes here first, then update src/lib/actions and src/types to match.

create extension if not exists pgcrypto;

create table customer_lead (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null unique,
  id_card_number text not null,
  ncb_grade text not null,
  created_at timestamptz not null default now()
);
