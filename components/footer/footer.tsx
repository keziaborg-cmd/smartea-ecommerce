import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ola@smartea.com";
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "smartea";

  return (
    <footer className="mt-[70px] bg-verde-escuro px-[6vw] pb-10 pt-14 text-[#cfe0c9]">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-start justify-between gap-10 xl:max-w-[1400px] 2xl:max-w-[1600px]">
        <div className="max-w-[320px]">
          <div className="mb-4 inline-flex items-center rounded-pill bg-creme px-[26px] py-3">
            <Image src="/logo.png" alt="Smartea" width={69} height={46} className="h-[46px] w-auto" />
          </div>
          <p className="text-sm leading-relaxed text-[#a9c1a2]">
            Chás naturais para o corpo e a mente. Calma que floresce, foco que transforma.
          </p>
        </div>
        <div className="flex flex-wrap gap-16">
          <div>
            <div className="mb-3.5 text-sm font-extrabold text-creme">Navegar</div>
            <div className="flex flex-col gap-2.5">
              <Link href="/sobre" className="text-sm text-[#a9c1a2] hover:text-creme">
                Sobre
              </Link>
              <Link href="/produtos" className="text-sm text-[#a9c1a2] hover:text-creme">
                Produtos
              </Link>
              <Link href="/smartea-mais" className="text-sm text-[#a9c1a2] hover:text-creme">
                Smartea+
              </Link>
              <Link href="/carrinho" className="text-sm text-[#a9c1a2] hover:text-creme">
                Carrinho
              </Link>
              <Link href="/privacidade" className="text-sm text-[#a9c1a2] hover:text-creme">
                Política de Privacidade
              </Link>
            </div>
          </div>
          <div>
            <div className="mb-3.5 text-sm font-extrabold text-creme">Contato</div>
            <div className="flex flex-col gap-2.5">
              <a href={`mailto:${email}`} className="text-sm text-[#a9c1a2] hover:text-creme">
                {email}
              </a>
              <span className="text-sm text-[#a9c1a2]">@{instagram}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-9 max-w-[1240px] border-t border-creme/15 pt-[22px] text-[13px] text-[#88a382] xl:max-w-[1400px] 2xl:max-w-[1600px]">
        © 2026 Smartea. Todos os direitos reservados.
      </div>
    </footer>
  );
}
