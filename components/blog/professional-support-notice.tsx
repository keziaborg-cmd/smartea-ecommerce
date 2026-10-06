// Mostrado automaticamente nos artigos de risco "alto" (ansiedade, sono,
// pausa/compulsividade) — além do próprio texto do artigo já trazer esse
// cuidado (ver prompt de sistema do pipeline), isso garante o aviso de forma
// estrutural, não só confiando que a IA escreveu certo em todo artigo.
export function ProfessionalSupportNotice() {
  return (
    <div className="mt-8 rounded-card-conteudo border border-[#e6dfc9] bg-gatilho-bg p-5 text-sm text-tinta/80">
      Este conteúdo é educativo e não substitui acompanhamento profissional. Se o que você sente tem sido intenso
      ou persistente, vale buscar apoio de um psicólogo, nutricionista ou outro profissional de saúde.
    </div>
  );
}
