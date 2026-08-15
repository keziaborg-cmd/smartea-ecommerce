-- Volume-discount pricing: 3 tiers per product (1 unit / 2 units / 3+ units).
-- Tier applies per the CART'S total unit count across all products (any mix
-- of flavors), not per-product quantity — see shop-create-order for the
-- authoritative server-side calculation.

alter table public.shop_products
  add column price_tier2_cents integer,
  add column price_tier3_cents integer;

-- Sanity constraints: each tier should be a genuine discount, never pricier
-- than the one before it.
alter table public.shop_products
  add constraint shop_products_tier2_not_pricier
    check (price_tier2_cents is null or price_tier2_cents <= price_cents),
  add constraint shop_products_tier3_not_pricier
    check (price_tier3_cents is null or price_tier3_cents <= price_tier2_cents);

update public.shop_products set
  price_cents = 2490, price_tier2_cents = 2090, price_tier3_cents = 1990
  where slug = 'cha-verde';

update public.shop_products set
  price_cents = 2290, price_tier2_cents = 1990, price_tier3_cents = 1890
  where slug = 'camomila';

update public.shop_products set
  price_cents = 3490, price_tier2_cents = 3190, price_tier3_cents = 2990
  where slug = 'jasmin';

update public.shop_products set
  price_cents = 2890, price_tier2_cents = 2590, price_tier3_cents = 2490
  where slug = 'cha-preto';

update public.shop_products set
  price_cents = 1990, price_tier2_cents = 1690, price_tier3_cents = 1590
  where slug = 'cidreira';

update public.shop_products set
  price_cents = 2290, price_tier2_cents = 1990, price_tier3_cents = 1890
  where slug = 'hibisco';

alter table public.shop_products
  alter column price_tier2_cents set not null,
  alter column price_tier3_cents set not null;
