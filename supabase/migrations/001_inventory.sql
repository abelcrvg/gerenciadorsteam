create extension if not exists pgcrypto;

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  name text not null,
  login text,
  password text,
  email text,
  recovery_notes text,
  cost numeric(10,2) not null default 0,
  sale_value numeric(10,2) not null default 0,
  status text not null default 'Disponível' check (status in ('Disponível','Reservada','Vendida')),
  entry_date date not null default current_date,
  sale_date date,
  observations text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, code)
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  app_id bigint,
  cover_url text,
  created_at timestamptz not null default now(),
  unique(owner_id, name)
);

create table if not exists public.account_games (
  account_id uuid not null references public.accounts(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  primary key (account_id, game_id)
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  product_name text not null,
  amount numeric(10,2) not null default 0,
  sold_at timestamptz not null default now(),
  customer text,
  order_reference text,
  observations text,
  created_at timestamptz not null default now()
);

create index if not exists accounts_owner_idx on public.accounts(owner_id);
create index if not exists games_owner_idx on public.games(owner_id);
create index if not exists sales_owner_idx on public.sales(owner_id);
create index if not exists account_games_game_idx on public.account_games(game_id);

alter table public.accounts enable row level security;
alter table public.games enable row level security;
alter table public.account_games enable row level security;
alter table public.sales enable row level security;

create policy "accounts owner select" on public.accounts for select using (auth.uid() = owner_id);
create policy "accounts owner insert" on public.accounts for insert with check (auth.uid() = owner_id);
create policy "accounts owner update" on public.accounts for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "accounts owner delete" on public.accounts for delete using (auth.uid() = owner_id);

create policy "games owner select" on public.games for select using (auth.uid() = owner_id);
create policy "games owner insert" on public.games for insert with check (auth.uid() = owner_id);
create policy "games owner update" on public.games for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "games owner delete" on public.games for delete using (auth.uid() = owner_id);

create policy "account_games owner select" on public.account_games for select
using (exists (select 1 from public.accounts a where a.id = account_id and a.owner_id = auth.uid()));
create policy "account_games owner insert" on public.account_games for insert
with check (exists (select 1 from public.accounts a where a.id = account_id and a.owner_id = auth.uid())
and exists (select 1 from public.games g where g.id = game_id and g.owner_id = auth.uid()));
create policy "account_games owner delete" on public.account_games for delete
using (exists (select 1 from public.accounts a where a.id = account_id and a.owner_id = auth.uid()));

create policy "sales owner select" on public.sales for select using (auth.uid() = owner_id);
create policy "sales owner insert" on public.sales for insert with check (auth.uid() = owner_id);
create policy "sales owner update" on public.sales for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "sales owner delete" on public.sales for delete using (auth.uid() = owner_id);
