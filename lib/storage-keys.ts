/**
 * Chaves que o site guarda no navegador (localStorage). Os nomes mudaram no rebrand (Smartea →
 * Almara); quem já tinha a chave antiga não pode perder o consentimento de cookies, a sessão do
 * CRM nem o carrinho, então migrateLegacyStorage() copia o valor antigo pro nome novo (se o novo
 * ainda não existir) e apaga o antigo. Roda antes de qualquer leitura e é idempotente.
 *
 * Os nomes antigos ficam só aqui. Dá pra apagar LEGACY (e a migração) algumas semanas depois do
 * lançamento, quando quase ninguém mais tiver as chaves antigas.
 */
export const STORAGE_KEYS = {
  consent: "almara-consent",
  anonymousId: "almara-aid",
  session: "almara-sid",
  attribution: "almara-attr",
  cart: "almara-cart",
} as const;

const LEGACY: Record<keyof typeof STORAGE_KEYS, string> = {
  consent: "smartea-consent",
  anonymousId: "smartea-aid",
  session: "smartea-sid",
  attribution: "smartea-attr",
  cart: "smartea-cart",
};

let migrated = false;

export function migrateLegacyStorage(storage: Pick<Storage, "getItem" | "setItem" | "removeItem"> | undefined = typeof localStorage === "undefined" ? undefined : localStorage): void {
  if (migrated || !storage) return;
  try {
    for (const k of Object.keys(STORAGE_KEYS) as (keyof typeof STORAGE_KEYS)[]) {
      const old = storage.getItem(LEGACY[k]);
      if (old === null) continue;
      if (storage.getItem(STORAGE_KEYS[k]) === null) storage.setItem(STORAGE_KEYS[k], old);
      storage.removeItem(LEGACY[k]);
    }
    migrated = true;
  } catch {
    // navegador sem armazenamento (modo privado restrito): segue sem migrar
  }
}

/** Só pros testes. */
export function resetStorageMigrationForTests() {
  migrated = false;
}
