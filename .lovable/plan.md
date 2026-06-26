
# Migração para Supabase — AutoMarket (schema expandido)

## 1. Migration SQL completa

```sql
-- =========================================================
-- 1. Tabelas base
-- =========================================================
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text
);

create table public.models (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete restrict,
  name text not null,
  category text,
  unique (brand_id, name)
);

create table public.seller_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  seller_type text not null check (seller_type in ('particular','loja')),
  city text,
  state text,
  rating numeric(2,1) default 0,
  total_reviews int not null default 0,
  cnpj text,
  store_name text,
  logo_url text,
  created_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models(id) on delete restrict,
  year int not null,
  price numeric not null,
  mileage_km int,
  fuel_type text,
  transmission text,
  color text,
  image_url text,                      -- legado; preenchido com images[0]
  seller_id uuid references public.seller_profiles(id) on delete set null,
  version text,
  city text,
  state text,
  description text,
  features text[],
  images text[],
  views int not null default 0,
  status text not null default 'pending'
    check (status in ('draft','pending','active','paused','expired','rejected')),
  highlighted_until timestamptz,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 2. Grants (Data API)
-- =========================================================
grant select on public.brands           to anon, authenticated;
grant all    on public.brands           to service_role;

grant select on public.models           to anon, authenticated;
grant all    on public.models           to service_role;

grant select on public.seller_profiles  to anon, authenticated;
grant insert, update on public.seller_profiles to authenticated;
grant all    on public.seller_profiles  to service_role;

grant select on public.vehicles                 to anon, authenticated;
grant insert, update, delete on public.vehicles to authenticated;
grant all    on public.vehicles                 to service_role;

-- =========================================================
-- 3. RLS
-- =========================================================
alter table public.brands           enable row level security;
alter table public.models           enable row level security;
alter table public.seller_profiles  enable row level security;
alter table public.vehicles         enable row level security;

create policy "brands public read"  on public.brands for select using (true);
create policy "models public read"  on public.models for select using (true);

create policy "seller_profiles public read"
  on public.seller_profiles for select using (true);
create policy "seller_profiles insert own"
  on public.seller_profiles for insert with check (auth.uid() = id);
create policy "seller_profiles update own"
  on public.seller_profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "vehicles public read"
  on public.vehicles for select using (true);
create policy "vehicles insert own"
  on public.vehicles for insert with check (auth.uid() = seller_id);
create policy "vehicles update own"
  on public.vehicles for update using (auth.uid() = seller_id) with check (auth.uid() = seller_id);
create policy "vehicles delete own"
  on public.vehicles for delete using (auth.uid() = seller_id);

-- =========================================================
-- 4. Seed: brands + models
-- =========================================================
insert into public.brands (name) values
  ('Toyota'), ('Honda'), ('Fiat'), ('Dodge');

insert into public.models (brand_id, name, category)
select b.id, m.name, m.category
from (values
  ('Toyota', 'Corolla',  'Sedan'),
  ('Honda',  'Civic',    'Sedan'),
  ('Fiat',   'Toro',     'Picape'),
  ('Dodge',  'RAM 1500', 'Picape')
) as m(brand_name, name, category)
join public.brands b on b.name = m.brand_name;

-- =========================================================
-- 5. Seed: seller_profiles (1 particular + 1 loja)
--    IDs fixos para serem referenciados pelos veículos seed.
--    Não referenciam auth.users — FK aceita órfãos apenas
--    se removermos a FK; mantemos a FK e por isso os sellers
--    seed serão inseridos via supabaseAdmin DEPOIS de criar
--    usuários demo no auth. (Ver passo 6.)
-- =========================================================
-- (seller_profiles + vehicles seed feitos no passo 6, fora desta migration de schema)
```

> **Nota importante:** `seller_profiles.id` referencia `auth.users(id)`. Não dá para semear sellers só com SQL na migration sem antes existir o `auth.users` correspondente. Por isso a parte de seed de sellers + veículos vai em um **script de seed separado** (passo 6), executado uma vez via service role, que cria 2 usuários demo no Supabase Auth, insere o perfil e popula os veículos vinculados.

## 2. Seed de sellers e veículos (passo 6)

Script único `scripts/seed-vehicles.ts` (rodado manualmente, fora do build):
- Cria `demo-particular@automarket.dev` e `demo-loja@automarket.dev` via `supabaseAdmin.auth.admin.createUser`.
- Insere `seller_profiles` correspondentes (1 `particular`, 1 `loja` verificada).
- Insere ~8 veículos amarrados aos modelos seed (Corolla, Civic, Toro, RAM 1500), distribuídos entre os 2 sellers, com `images[]` apontando para os assets já existentes em `src/assets/car-*.jpg` servidos via URL pública.

## 3. Código — arquivos alterados

**Criados**
- Migration acima (schema + grants + RLS + seed de brands/models).
- `scripts/seed-vehicles.ts` (seed de sellers + vehicles, via service role).
- `src/lib/vehicles-api.ts`:
  - `fetchVehicles()` / `fetchVehicleById(id)` usando
    ```ts
    supabase.from('vehicles').select(
      '*, models(name, category, brands(name, logo_url)), seller_profiles(display_name, seller_type, rating, city, state)'
    ).order('created_at', { ascending: false })
    ```
  - `rowToVehicle(row)` mapeando **somente campos reais**:
    - `brand` ← `models.brands.name`
    - `model` ← `models.name`
    - `category` ← `models.category`
    - `version` ← `vehicles.version`
    - `km` ← `mileage_km`, `fuel` ← `fuel_type`, `gearbox` ← `transmission`
    - `city`/`state` ← `vehicles.city`/`state`
    - `images` ← `vehicles.images` (array real do banco)
    - `description`, `features`, `views`, `status`, `is_new`
    - `highlighted` ← `highlighted_until && highlighted_until > now()`
    - `seller` ← objeto montado a partir de `seller_profiles`
    - Veículos com `models`, `brands` ou `seller_profiles` nulos são filtrados fora (não há fallback fake).
  - Hooks `useVehicles()` / `useVehicle(id)` com TanStack Query.

**Editados** (deixam de importar `VEHICLES`, `findVehicleBySlug`, `similarVehicles` de `mock-data`)
- `src/routes/index.tsx`
- `src/routes/veiculos.tsx`
- `src/routes/veiculos.$slug.tsx`
- `src/routes/favoritos.tsx`
- `src/routes/comparar.tsx`
- `src/lib/filters.ts` — `applyFilters` passa a receber `vehicles: Vehicle[]` por argumento em vez de importar `VEHICLES`.

**Não tocados**
- `src/components/VehicleCard.tsx`, `FilterSidebar.tsx`, `Header.tsx`, `CompareBar.tsx`, `BottomNav.tsx`, etc. — o adapter entrega o tipo `Vehicle` que eles já consomem.
- `src/lib/mock-data.ts` — preservado (sem imports ativos), conforme pedido.
- `src/routes/inbox.tsx` permanece usando `MOCK_CONVERSATIONS` (fora do escopo desta migração).

## 4. Confirmação antes de aplicar

Pontos que valem confirmar antes de eu sair do plan mode:

1. **Seed de sellers**: ok rodar como script `scripts/seed-vehicles.ts` chamado manualmente (e não dentro da migration SQL), porque a FK `seller_profiles.id → auth.users.id` exige usuários reais no Auth? Alternativa: deixar essa FK como `on delete cascade` mas sem `references` rígido — não recomendo, perde integridade.
2. **`image_url` legado**: mantemos a coluna nesta migration (preenchida com `images[0]` no seed) e dropamos em migration futura. Confirma?
3. **Filtros que hoje listam `BRANDS`, `CATEGORIES`, `STATES` fixos**: passam a vir de `brands`/`models.category` distintos via Supabase, ou ok manter as listas estáticas do `mock-data.ts` apenas como vocabulário de filtro (sem afetar dados)?
