// Ported verbatim from design-bundle/Smartea.dc.html (quizData()/quizWhy()).
// `scores` is keyed by tea *name* (matches the prototype) — lib/quiz/scoring.ts
// maps name -> slug via data/teas.ts.

export interface QuizOption {
  label: string;
  scores: Partial<Record<string, number>>;
}

export interface QuizQuestion {
  q: string;
  opts: QuizOption[];
}

export const quizData: QuizQuestion[] = [
  {
    q: "Qual o momento do dia mais difícil para você?",
    opts: [
      { label: "A manhã, pra engrenar", scores: { "Chá Preto": 2, "Chá Verde": 2 } },
      { label: "A tarde, quando cai a energia", scores: { "Chá Verde": 2, Jasmin: 1 } },
      { label: "A noite, pra desacelerar", scores: { Camomila: 2, Cidreira: 2 } },
      { label: "A hora de dormir", scores: { Camomila: 3, Cidreira: 2 } },
    ],
  },
  {
    q: "O que você busca no seu ritual?",
    opts: [
      { label: "Calma", scores: { Camomila: 3, Cidreira: 2, Jasmin: 1 } },
      { label: "Foco", scores: { "Chá Verde": 3, "Chá Preto": 2 } },
      { label: "Disposição", scores: { "Chá Preto": 3, "Chá Verde": 2 } },
      { label: "Uma pausa no dia", scores: { Hibisco: 3, "Chá Verde": 2 } },
    ],
  },
  {
    q: "Qual sabor te agrada mais?",
    opts: [
      { label: "Floral", scores: { Jasmin: 3, Camomila: 1, Hibisco: 1 } },
      { label: "Frutado & cítrico", scores: { Hibisco: 3, Cidreira: 1 } },
      { label: "Herbal & suave", scores: { Cidreira: 2, Camomila: 1, "Chá Verde": 1 } },
      { label: "Encorpado", scores: { "Chá Preto": 3, "Chá Verde": 1 } },
    ],
  },
  {
    q: "Você aceita cafeína?",
    opts: [
      { label: "Sim, quero o estímulo", scores: { "Chá Preto": 2, "Chá Verde": 2 } },
      { label: "Prefiro sem cafeína", scores: { Camomila: 2, Cidreira: 2, Hibisco: 1, Jasmin: 1 } },
      { label: "Tanto faz", scores: {} },
    ],
  },
  {
    q: "Como você quer o seu ritual?",
    opts: [
      { label: "Suave & leve", scores: { Jasmin: 2, Camomila: 1, Cidreira: 1 } },
      { label: "Reconfortante", scores: { Camomila: 2, Cidreira: 2 } },
      { label: "Marcante & intenso", scores: { "Chá Preto": 2, Hibisco: 2, "Chá Verde": 1 } },
    ],
  },
];

export const quizWhy: Record<string, string> = {
  "Chá Verde": "Foco e antioxidantes em equilíbrio — energia limpa, sem exageros.",
  Camomila: "Calma que floresce: o convite perfeito para desacelerar o seu dia.",
  Jasmin: "Leveza floral para um instante suave no meio da correria.",
  "Chá Preto": "Corpo e cafeína na medida certa para turbinar o seu foco.",
  Cidreira: "Um respiro sem cafeína que acalma o corpo e a mente.",
  Hibisco: "Sabor vibrante e cor intensa — um chá que se faz notar e marca bem o seu intervalo.",
};
