create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  password_hash text,
  role text not null default 'user' check (role in ('user', 'admin')),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_otps (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  otp_hash text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_otps_email_idx on public.email_otps (email);
create index if not exists email_otps_expires_at_idx on public.email_otps (expires_at);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price decimal(10,2) not null default 0,
  supplier text,
  description text,
  -- brand_id text,
  images jsonb not null default '[]'::jsonb,
  tags jsonb,
  sku text not null unique,
  quantity integer not null default 0 check (quantity >= 0),
  discount_price decimal(10,2),
  year integer not null default (extract(year from now())::integer),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_serials (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  serial_number text not null unique,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold', 'returned', 'damaged')),
  gift_claimed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  full_name text,
  email text,
  phone text,
  address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  total decimal(10,2) not null default 0,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gift_redemption (
  id uuid primary key default gen_random_uuid(),
  serial_id uuid not null unique references public.product_serials(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete set null,
  redeemed_at timestamptz not null default now()
);

create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists product_serials_product_id_idx on public.product_serials (product_id);
create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists reviews_product_id_idx on public.reviews (product_id);
create index if not exists gift_redemption_customer_id_idx on public.gift_redemption (customer_id);

create or replace function public.sync_product_quantity()
returns trigger
language plpgsql
as $$
begin
  update public.products
  set quantity = (
    select count(*)::integer
    from public.product_serials
    where product_id = coalesce(new.product_id, old.product_id)
  )
  where id = coalesce(new.product_id, old.product_id);

  return coalesce(new, old);
end;
$$;

drop trigger if exists product_serials_quantity_sync on public.product_serials;
create trigger product_serials_quantity_sync
after insert or delete on public.product_serials
for each row
execute function public.sync_product_quantity();

alter table public.profiles enable row level security;
alter table public.email_otps enable row level security;
alter table public.products enable row level security;
alter table public.product_serials enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.gift_redemption enable row level security;

drop policy if exists profiles_owner_read on public.profiles;
create policy profiles_owner_read on public.profiles for select using (auth.uid() = id);
drop policy if exists email_otps_service_only on public.email_otps;
create policy email_otps_service_only on public.email_otps for all using (false) with check (false);
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products for select using (true);
drop policy if exists serials_public_read on public.product_serials;
create policy serials_public_read on public.product_serials for select using (true);
drop policy if exists orders_owner_read on public.orders;
create policy orders_owner_read on public.orders for select using (auth.uid() = customer_id);
drop policy if exists orders_owner_insert on public.orders;
create policy orders_owner_insert on public.orders for insert with check (auth.uid() = customer_id);
drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read on public.reviews for select using (true);
drop policy if exists reviews_owner_insert on public.reviews;
create policy reviews_owner_insert on public.reviews for insert with check (auth.uid() = customer_id);
drop policy if exists reviews_owner_update on public.reviews;
create policy reviews_owner_update on public.reviews for update using (auth.uid() = customer_id);
drop policy if exists gifts_owner_read on public.gift_redemption;
create policy gifts_owner_read on public.gift_redemption for select using (auth.uid() = customer_id);
drop policy if exists gifts_owner_insert on public.gift_redemption;
create policy gifts_owner_insert on public.gift_redemption for insert with check (auth.uid() = customer_id);
drop policy if exists customers_owner_read on public.customers;
create policy customers_owner_read on public.customers for select using (auth.uid() = profile_id);

-- SKU Series table for custom/manual sequence formats
create table if not exists public.sku_series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  prefix text not null,
  separator text not null default '-',
  include_year boolean not null default true,
  padding integer not null default 3,
  current_counter integer not null default 1,
  suffix text,
  category text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sku_series enable row level security;
drop policy if exists sku_series_public_read on public.sku_series;
create policy sku_series_public_read on public.sku_series for select using (true);
drop policy if exists sku_series_public_all on public.sku_series;
create policy sku_series_public_all on public.sku_series for all using (true) with check (true);
