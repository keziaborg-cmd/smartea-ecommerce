// Ported verbatim from design-bundle/Smartea.dc.html (pdpData()) — approved copy.
// Editorial rule (see design-bundle/README.md): no countdowns, no fake
// "últimas unidades", no artificial urgency, no clinical claims in `gatilhos`.
import type { TeaSlug } from "./teas";
import type { JourneySlug } from "./journeys";

export interface PdpGatilho {
  k: string;
  t: string;
}

export interface PdpFaqItem {
  q: string;
  a: string;
}

export interface PdpEntry {
  problema: string;
  solucao: string;
  beneficios: string[];
  como: string;
  // Relação muitos-para-muitos chá <-> jornada, confirmada pelo usuário em
  // 2026-08-14 (ex.: Camomila está em Sono E Ansiedade & Estresse).
  jornadas: JourneySlug[];
  diferencial: string;
  gatilhos: PdpGatilho[];
  faq: PdpFaqItem[];
}

export const pdpData: Record<TeaSlug, PdpEntry> = {
  "cha-verde": {
    problema:
      "A rotina corrida cobra um preço silencioso — noites mal dormidas, estresse acumulado e a sensação de estar sempre no limite deixam o corpo mais vulnerável.",
    solucao:
      "Um ritual diário simples que devolve um momento de cuidado ao dia, com antioxidantes que ajudam o corpo a se manter em equilíbrio.",
    beneficios: ["Antioxidantes", "L-teanina", "Vitamina C", "Zinco"],
    como: "Folhas selecionadas na colheita natural, preparadas em água quente por alguns minutos — sem açúcar, sem conservantes. Parte da manhã, antes de começar o dia.",
    jornadas: ["produtividade", "compulsividade"],
    diferencial:
      "A lata do Chá Verde conecta às jornadas de Produtividade & Foco e Compulsividade Alimentar no Smartea+ (21 dias cada), com a Flora guiando pausas e pequenos hábitos ao longo do dia.",
    gatilhos: [
      { k: "Prova social", t: "Já faz parte da rotina de milhares de pessoas." },
      { k: "Tradição", t: "Folhas reconhecidas pela tradição do uso antioxidante." },
      { k: "Colheita natural", t: "Sem produção em massa — cada lote respeita o tempo da colheita." },
    ],
    faq: [
      { q: "O Chá Verde tem cafeína?", a: "Sim, em quantidade moderada — pode ser consumido pela manhã." },
      { q: "Posso tomar gelado?", a: "Sim, é só deixar esfriar após o preparo." },
      { q: "Quantas xícaras rende a lata de 150g?", a: "Cerca de 60 xícaras, usando 1 colher de chá por preparo." },
      { q: "Preciso adoçar?", a: "O blend já foi pensado para ser saboroso sem açúcar." },
      { q: "Grávidas podem consumir?", a: "Recomendamos consultar um médico antes, como com qualquer chá com cafeína." },
    ],
  },
  camomila: {
    problema:
      "A mente não desacelera quando a cabeça encosta no travesseiro — pensamentos do dia se acumulam e o sono demora a chegar.",
    solucao:
      "Um ritual noturno que sinaliza para o corpo que é hora de desacelerar, criando uma pausa consciente antes de dormir.",
    beneficios: ["Relaxamento natural", "Sem cafeína", "Aroma floral suave", "100% natural"],
    como: "Flores de camomila em infusão, preparadas cerca de 30 minutos antes de dormir, como parte de um ritual — não só uma bebida.",
    jornadas: ["sono", "ansiedade"],
    diferencial:
      "Ativa as jornadas de Sono e Ansiedade & Estresse no Smartea+ (21 dias cada), com a Flora sugerindo respiração guiada junto ao ritual do chá.",
    gatilhos: [
      { k: "Prova social", t: "Relatos de quem incorporou o ritual noturno." },
      { k: "Tradição", t: "Uso tradicional da camomila para relaxar." },
    ],
    faq: [
      { q: "Tem cafeína?", a: "Não, pode ser consumido à noite sem afetar o sono." },
      { q: "Qual o melhor horário para tomar?", a: "Cerca de 30 minutos antes de dormir." },
      { q: "Posso misturar com outro chá da Smartea?", a: "Pode. A camomila combina bem com a cidreira para um ritual noturno ainda mais suave." },
      { q: "Quanto tempo dura a lata de 100g?", a: "Rende cerca de 40 xícaras — perto de um mês e meio de ritual diário à noite." },
      { q: "É indicado para crianças?", a: "Recomendamos uso adulto; para crianças, consulte um pediatra." },
    ],
  },
  jasmin: {
    problema:
      "No meio do dia, a cabeça fica pesada de tarefas empilhadas e falta um respiro antes de continuar.",
    solucao:
      "Uma pausa curta e aromática que limpa a mente sem depender de mais uma dose de cafeína pesada.",
    beneficios: ["Leveza", "Aroma floral energizante", "Baixo teor de cafeína"],
    como: "Infusão rápida, pode ser preparada em poucos minutos entre uma tarefa e outra.",
    jornadas: ["ansiedade"],
    diferencial:
      "Parte da jornada de Ansiedade & Estresse de 21 dias no Smartea+, com pausas guiadas pela Flora entre um compromisso e outro.",
    gatilhos: [
      { k: "Prova social", t: "Quem usa como ritual de pausa no trabalho." },
      { k: "Lote menor", t: "Lata de 80g, de produção reduzida." },
    ],
    faq: [
      { q: "Posso tomar mais de uma vez ao dia?", a: "Pode. É leve o suficiente para acompanhar mais de uma pausa ao longo do dia." },
      { q: "Tem cafeína?", a: "Sim, em teor baixo — ajuda sem deixar agitado." },
      { q: "Como conservar depois de aberto?", a: "Mantenha a lata bem fechada, longe de umidade e luz direta, para preservar o aroma." },
      { q: "Serve para depois do almoço?", a: "Sim, é uma ótima pausa aromática para retomar a tarde." },
    ],
  },
  "cha-preto": {
    problema:
      "A energia despenca no meio da tarde e o café em excesso vira a única saída — com efeitos colaterais na ansiedade e no sono à noite.",
    solucao:
      "Uma fonte de energia mais estável ao longo do dia, sem os picos e quedas do café tradicional.",
    beneficios: ["Cafeína natural", "Corpo intenso", "Foco sustentado"],
    como: "Folhas de chá preto selecionadas, com liberação de energia mais gradual — ideal para o meio da manhã ou início da tarde.",
    jornadas: ["produtividade"],
    diferencial: "Conecta à jornada de Produtividade & Foco de 21 dias no Smartea+, guiada pela Flora.",
    gatilhos: [
      { k: "Prova social", t: "Quem substituiu parte do café pelo ritual." },
      { k: "Tradição", t: "Uso tradicional do chá preto para energia." },
    ],
    faq: [
      { q: "Tem mais cafeína que o Chá Verde?", a: "Sim, o chá preto tem teor mais alto, com energia mais sustentada." },
      { q: "Posso tomar à noite?", a: "Não recomendado, pela cafeína." },
      { q: "Rende quantas xícaras a lata de 180g?", a: "Cerca de 70 xícaras, com 1 colher de chá por preparo." },
      { q: "Posso tomar com leite?", a: "Pode. O chá preto aceita bem um toque de leite, se preferir." },
    ],
  },
  cidreira: {
    problema:
      "A ansiedade se acumula ao longo do dia sem um momento reservado para simplesmente respirar.",
    solucao:
      "Um ritual de pausa que pode ser feito a qualquer hora — não só à noite — para reconectar com o presente.",
    beneficios: ["Ervas calmantes", "Aroma suave", "Sem cafeína"],
    como: "Infusão relaxante, pode ser preparada em qualquer momento do dia que pedir uma pausa.",
    jornadas: ["sono", "ansiedade"],
    diferencial: "Parte das jornadas de Sono e Ansiedade & Estresse no Smartea+ (21 dias cada).",
    gatilhos: [
      { k: "Prova social", t: "Quem reservou um momento do dia só para respirar." },
      { k: "Honestidade", t: "Não promete eliminar a ansiedade — oferece um ritual de pausa." },
    ],
    faq: [
      { q: "Tem cafeína?", a: "Não." },
      { q: "Posso tomar em qualquer horário?", a: "Sim. É um ritual de pausa que cabe a qualquer momento do dia." },
      { q: "Quanto tempo dura a lata de 120g?", a: "Rende cerca de 45 xícaras, usando 1 colher de sopa por preparo." },
      { q: "Posso oferecer para quem tem ansiedade?", a: "É um chá calmante natural, mas não substitui acompanhamento profissional se necessário." },
    ],
  },
  hibisco: {
    problema:
      "A vontade de beliscar fora de hora aparece antes de qualquer decisão consciente — e o impulso vence antes da pausa.",
    solucao:
      "Um ritual de hidratação saborosa que cria um intervalo consciente entre a vontade e a ação.",
    beneficios: ["Sabor marcante", "Hidratação saborosa", "Sem açúcar"],
    como: "Pode ser consumido gelado ou quente, como substituto consciente nos momentos de vontade de beliscar.",
    jornadas: ["compulsividade"],
    diferencial:
      "Ativa a jornada de Compulsividade Alimentar de 21 dias no Smartea+, com a Flora ajudando a identificar gatilhos e criar pausas.",
    gatilhos: [
      { k: "Prova social", t: "Quem trocou o beliscar por uma pausa saborosa." },
      { k: "Cuidado", t: "Não é fórmula milagrosa: é parte de um ritual mais amplo de autocuidado." },
    ],
    faq: [
      { q: "Posso tomar gelado no verão?", a: "Sim, fica ótimo gelado com um toque de limão." },
      { q: "Tem cafeína?", a: "Não." },
      { q: "Ajuda a “cortar” a vontade de doce?", a: "Não é uma promessa — é um ritual de pausa consciente, e os resultados variam por pessoa." },
      { q: "Quanto tempo dura a lata de 200g?", a: "Rende cerca de 70 xícaras, quente ou gelado." },
    ],
  },
};

export function getTeasForJourney(journeySlug: JourneySlug): TeaSlug[] {
  return (Object.entries(pdpData) as [TeaSlug, PdpEntry][])
    .filter(([, entry]) => entry.jornadas.includes(journeySlug))
    .map(([teaSlug]) => teaSlug);
}
