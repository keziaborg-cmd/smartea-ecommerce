-- Pesos líquidos das latas novas (embalagem Almara). Os preços mudam depois, em outra migration.
update public.shop_products set weight_grams = 120, updated_at = now() where slug = 'cha-verde';
update public.shop_products set weight_grams = 65,  updated_at = now() where slug = 'camomila';
update public.shop_products set weight_grams = 50,  updated_at = now() where slug = 'jasmin';
update public.shop_products set weight_grams = 120, updated_at = now() where slug = 'cha-preto';
update public.shop_products set weight_grams = 60,  updated_at = now() where slug = 'cidreira';
update public.shop_products set weight_grams = 95,  updated_at = now() where slug = 'hibisco';
