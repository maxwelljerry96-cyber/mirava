create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_description text not null default '',
  description text not null default '',
  price_minor integer not null check (price_minor >= 0),
  currency text not null default 'EGP',
  category text not null default 'Fruit Elixir',
  featured boolean not null default false,
  active boolean not null default true,
  stock integer not null default 0 check (stock >= 0),
  ingredients text[] not null default '{}',
  benefits text[] not null default '{}',
  image_url text not null,
  gallery text[] not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.bundles (
  id uuid primary key default gen_random_uuid(),
  external_key text unique not null,
  slug text unique not null,
  name text not null,
  description text not null default '',
  price_minor integer not null check (price_minor >= 0),
  currency text not null default 'EGP',
  image_url text not null,
  active boolean not null default true,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.bundle_items (
  bundle_id uuid not null references public.bundles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  primary key (bundle_id, product_id)
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null check (type in ('percent', 'fixed')),
  value integer not null,
  minimum_order_minor integer not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  full_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text not null default '',
  city text not null,
  country text not null,
  postal_code text not null default '',
  status text not null default 'pending_payment' check (status in ('pending_payment','paid','processing','shipped','delivered','cancelled','refunded')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  subtotal_minor integer not null,
  discount_minor integer not null default 0,
  shipping_minor integer not null default 0,
  total_minor integer not null,
  currency text not null default 'EGP',
  coupon_id uuid references public.coupons(id),
  paystack_access_code text,
  paystack_data jsonb,
  paid_at timestamptz,
  confirmation_sent_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  bundle_id uuid references public.bundles(id) on delete set null,
  external_product_key text,
  name text not null,
  slug text not null,
  image_url text not null,
  quantity integer not null check (quantity > 0),
  unit_price_minor integer not null,
  created_at timestamptz default now(),
  check (product_id is not null or bundle_id is not null or external_product_key is not null)
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id),
  bundle_id uuid references public.bundles(id),
  order_id uuid references public.orders(id),
  quantity_change integer not null,
  reason text not null,
  created_at timestamptz default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  resolved boolean not null default false,
  created_at timestamptz default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
drop trigger if exists bundles_touch on public.bundles;
create trigger bundles_touch before update on public.bundles for each row execute function public.touch_updated_at();
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.fulfill_order(p_reference text, p_paystack_data jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  order_row public.orders%rowtype;
  line record;
  component record;
begin
  select * into order_row from public.orders where reference = p_reference for update;
  if not found then raise exception 'Order not found'; end if;
  if order_row.payment_status = 'paid' then return order_row.id; end if;

  for line in select * from public.order_items where order_id = order_row.id loop
    if line.product_id is not null then
      update public.products
      set stock = stock - line.quantity
      where id = line.product_id and stock >= line.quantity;
      if not found then raise exception 'Insufficient stock for %', line.name; end if;
      insert into public.inventory_movements(product_id, order_id, quantity_change, reason)
      values(line.product_id, order_row.id, -line.quantity, 'paid_order');
    elsif line.bundle_id is not null then
      update public.bundles
      set stock = stock - line.quantity
      where id = line.bundle_id and stock >= line.quantity;
      if not found then raise exception 'Insufficient bundle stock for %', line.name; end if;
      insert into public.inventory_movements(bundle_id, order_id, quantity_change, reason)
      values(line.bundle_id, order_row.id, -line.quantity, 'paid_bundle');

      for component in
        select bi.product_id, bi.quantity * line.quantity as required_quantity, p.name
        from public.bundle_items bi
        join public.products p on p.id = bi.product_id
        where bi.bundle_id = line.bundle_id
      loop
        update public.products
        set stock = stock - component.required_quantity
        where id = component.product_id and stock >= component.required_quantity;
        if not found then raise exception 'Insufficient stock for bundle component %', component.name; end if;
        insert into public.inventory_movements(product_id, bundle_id, order_id, quantity_change, reason)
        values(component.product_id, line.bundle_id, order_row.id, -component.required_quantity, 'paid_bundle_component');
      end loop;
    end if;
  end loop;

  update public.orders
  set payment_status = 'paid', status = 'paid', paid_at = now(), paystack_data = p_paystack_data
  where id = order_row.id;
  return order_row.id;
end
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.bundles enable row level security;
alter table public.bundle_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "public products" on public.products;
create policy "public products" on public.products for select using (active = true);
drop policy if exists "public bundles" on public.bundles;
create policy "public bundles" on public.bundles for select using (active = true);
drop policy if exists "public bundle items" on public.bundle_items;
create policy "public bundle items" on public.bundle_items for select using (true);
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update using (auth.uid() = id);
drop policy if exists "own orders" on public.orders;
create policy "own orders" on public.orders for select using (auth.uid() = user_id);
drop policy if exists "own order items" on public.order_items;
create policy "own order items" on public.order_items for select using (
  exists(select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

insert into public.products(slug,name,short_description,description,price_minor,currency,category,featured,active,stock,ingredients,benefits,image_url,gallery) values
('mango-passion','Mango Passion','Mango, passionfruit and ginger in one bright tropical blend.','A bold, sunny fruit elixir with ripe mango, tart passionfruit and a clean ginger finish.',14500,'EGP','Tropical',true,true,120,array['Mango','Passionfruit','Ginger','Filtered water'],array['Natural energy','Vitamin-rich fruit'],'/assets/product-mango-passion.webp',array['/assets/product-mango-passion.webp']),
('berry-glow','Berry Glow','A juicy berry blend with a bright finish.','Deep berry flavour and clean acidity.',15500,'EGP','Berry',true,true,100,array['Strawberry','Blueberry','Raspberry','Apple'],array['Berry flavour','Natural colour'],'/assets/product-berry-glow.webp',array['/assets/product-berry-glow.webp']),
('lemon-yuzu','Lemon Yuzu','Crisp citrus refreshment.','Bright lemon meets aromatic yuzu.',14000,'EGP','Citrus',true,true,120,array['Lemon','Yuzu','Mint'],array['Refreshing citrus','Clean finish'],'/assets/product-lemon-yuzu.webp',array['/assets/product-lemon-yuzu.webp']),
('lavender-lemon','Lavender Lemon','Soft floral citrus.','Gentle lavender and bright lemon.',16500,'EGP','Botanical',true,true,80,array['Lemon','Lavender','Chamomile'],array['Botanical flavour','Elegant finish'],'/assets/product-lavender-lemon.webp',array['/assets/product-lavender-lemon.webp'])
on conflict(slug) do update set
name=excluded.name,short_description=excluded.short_description,description=excluded.description,
price_minor=excluded.price_minor,category=excluded.category,stock=excluded.stock,
ingredients=excluded.ingredients,benefits=excluded.benefits,image_url=excluded.image_url,active=true;

insert into public.bundles(external_key,slug,name,description,price_minor,currency,image_url,active,stock) values
('immunity-bundle','immunity-bundle','The Immunity Bundle','Six bright bottles built around tropical fruit, berry and citrus.',79000,'EGP','/assets/bundle-immunity.webp',true,20),
('wellness-bundle','wellness-bundle','The Wellness Bundle','Twelve bottles covering all four FRUTÉO flavours.',149000,'EGP','/assets/bundle-wellness.webp',true,15),
('detox-bundle','detox-bundle','The Fresh Reset Bundle','Six crisp citrus and botanical bottles.',82000,'EGP','/assets/bundle-detox.webp',true,20)
on conflict(external_key) do update set
name=excluded.name,description=excluded.description,price_minor=excluded.price_minor,image_url=excluded.image_url,active=true,stock=excluded.stock;

insert into public.bundle_items(bundle_id, product_id, quantity)
select b.id, p.id, v.quantity
from (values
  ('immunity-bundle','mango-passion',2),
  ('immunity-bundle','berry-glow',2),
  ('immunity-bundle','lemon-yuzu',2),
  ('wellness-bundle','mango-passion',3),
  ('wellness-bundle','berry-glow',3),
  ('wellness-bundle','lemon-yuzu',3),
  ('wellness-bundle','lavender-lemon',3),
  ('detox-bundle','lemon-yuzu',3),
  ('detox-bundle','lavender-lemon',3)
) as v(bundle_key, product_slug, quantity)
join public.bundles b on b.external_key = v.bundle_key
join public.products p on p.slug = v.product_slug
on conflict(bundle_id, product_id) do update set quantity = excluded.quantity;

insert into public.coupons(code,type,value,minimum_order_minor,active)
values('FRUIT10','percent',10,50000,true)
on conflict(code) do nothing;
