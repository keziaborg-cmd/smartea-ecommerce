// Editorial rule: no countdowns, no fake "últimas unidades", no artificial
// urgency, no clinical claims in `gatilhos`.
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
  // 2026-08-14 (ex.: Camomila está em Sono E Ansiedade).
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
      "Um companheiro natural pra quem escolhe o Chá Verde no ritual das jornadas Produtividade ou Pausa no Smartea+ — mas funciona bem em qualquer uma das quatro.",
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
      "Combina com o ritual das jornadas Sono e Ansiedade no Smartea+ — sem cafeína, serve bem a qualquer hora do dia.",
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
      "Um sabor leve e floral pra quem quer um chá suave no ritual de qualquer jornada do Smartea+, a qualquer hora.",
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
    diferencial:
      "Com cafeína natural, é a escolha de quem quer o ritual do Smartea+ no início do dia — em qualquer jornada.",
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
    diferencial:
      "Sem cafeína, combina com o ritual de qualquer jornada do Smartea+ — sabor leve, presente em qualquer hora do dia.",
    gatilhos: [
      { k: "Prova social", t: "Quem reservou um momento do dia só para respirar." },
      { k: "Honestidade", t: "Não promete eliminar a ansiedade — oferece um ritual de pausa." },
    ],
    faq: [
      { q: "Tem cafeína?", a: "Não." },
      { q: "Posso tomar em qualquer horário?", a: "Sim. É um ritual de pausa que cabe a qualquer momento do dia." },
      { q: "Quanto tempo dura a lata de 120g?", a: "Rende cerca de 45 xícaras, usando 1 colher de sopa por preparo." },
      { q: "Posso oferecer para quem tem ansiedade?", a: "É um chá sem cafeína, de aroma suave — mas não substitui acompanhamento profissional se necessário." },
    ],
  },
  hibisco: {
    problema:
      "O dia inteiro emendado, sem um intervalo que seja realmente seu.\n\nVocê para, mas para com o celular na mão. Descansa, mas descansando de um jeito que continua entregando estímulo. No fim do dia dá aquela sensação de não ter havido nenhum espaço em lugar nenhum.",
    solucao:
      "O Hibisco é um chá difícil de tomar no automático.\n\nA cor rubi aparece na água em segundos, o sabor é ácido e franco, e a xícara pede um pouco de atenção enquanto você bebe. É exatamente esse tipo de presença que faz um intervalo de cinco minutos parecer um intervalo de verdade.\n\nSem cafeína — então serve tanto para a pausa da tarde quanto para a do fim do dia.",
    beneficios: ["Sabor marcante", "Sem cafeína", "Sem açúcar", "Bom quente e gelado"],
    como: "1. Uma colher de sopa para 200 ml de água quente, pouco antes de ferver.\n\n2. Deixe em infusão de 4 a 6 minutos. Menos tempo, mais leve; mais tempo, mais marcante.\n\n3. Beba sem fazer mais nada junto. A infusão já é parte da pausa.\n\nNo calor, prepare a mesma medida, deixe esfriar e sirva com gelo.",
    jornadas: ["compulsividade"],
    diferencial:
      "Combina com o ritual da jornada Pausa no Smartea+ — um intervalo seu no meio do dia, com conteúdo diário e um jardim que cresce junto. Funciona bem em qualquer outra jornada também.",
    gatilhos: [{ k: "O momento certo", t: "Feito para o momento do dia em que tudo se emenda." }],
    faq: [
      { q: "O Hibisco tem cafeína?", a: "Não. Pode ser tomado a qualquer hora, inclusive à noite." },
      {
        q: "Qual o sabor?",
        a: "Ácido, floral e bem marcante, com cor rubi intensa. Lembra frutas vermelhas. Quem prefere chás suaves costuma reduzir o tempo de infusão ou adoçar levemente.",
      },
      { q: "Posso tomar gelado?", a: "Pode, e fica ótimo. Mesma medida, deixe esfriar e sirva com gelo e uma rodela de limão." },
      { q: "Quantas xícaras rende a lata?", a: "Cerca de 70 xícaras, no preparo indicado." },
      {
        q: "Como conservar?",
        a: "Em local seco e arejado, longe da luz e do calor, com a embalagem bem fechada depois de aberta.",
      },
      {
        q: "Preciso do aplicativo para tomar o chá?",
        a: "Não. O Hibisco é ótimo sozinho. O Smartea+ existe para quem quer transformar o hábito numa rotina com acompanhamento.",
      },
      {
        q: "Posso tomar todo dia?",
        a: "Sim, como qualquer chá de consumo comum. Gestantes, lactantes, pessoas em uso de medicamentos ou com alguma condição de saúde devem consultar um profissional antes de incluir qualquer ingrediente novo na rotina.",
      },
    ],
  },
};

export function getTeasForJourney(journeySlug: JourneySlug): TeaSlug[] {
  return (Object.entries(pdpData) as [TeaSlug, PdpEntry][])
    .filter(([, entry]) => entry.jornadas.includes(journeySlug))
    .map(([teaSlug]) => teaSlug);
}
