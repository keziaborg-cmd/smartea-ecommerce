import Image from "next/image";
import Link from "next/link";

// Renderiza DENTRO do layout raiz (Nav/Footer continuam aparecendo) sempre
// que uma rota não bate com nada — ver app/layout.tsx. Tema da cópia segue a
// mesma metáfora de "jornada/trilha" usada no resto do site, em vez de um
// genérico "404 - página não encontrada".
export default function NotFound() {
  return (
    <main className="animate-pagein flex flex-col items-center px-[6vw] py-20 text-center">
      <Image src="/flora.png" alt="Mara, mascote da Almara" width={220} height={275} className="h-[220px] w-auto" priority />
      <p className="eyebrow mt-6 text-eyebrow-claro">Ops</p>
      <h1 className="mt-3 font-display text-[clamp(32px,5vw,52px)] text-verde-escuro">
        Essa trilha ainda não existe por aqui
      </h1>
      <p className="mx-auto mt-4 max-w-md text-tinta/80">
        A página que você procura não foi encontrada — mas sua jornada pode continuar a partir daqui.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/" className="rounded-pill bg-verde-escuro px-8 py-3.5 text-sm font-semibold text-creme">
          Voltar pro início
        </Link>
        <Link href="/produtos" className="font-semibold text-verde-folha hover:underline">
          Ver os chás →
        </Link>
      </div>
    </main>
  );
}
