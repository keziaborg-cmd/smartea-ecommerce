import { teas, type Tea } from "@/data/teas";
import { quizData } from "@/data/quiz-data";

// Índices em `quizData` usados como critério de desempate — ver proposta
// aprovada pelo usuário em 2026-08-14. O modelo de pontuação continua
// pontuando chás diretamente (não jornadas); reformular para pontuar
// jornada primeiro fica para um projeto separado, se um dia for necessário.
const FLAVOR_QUESTION_INDEX = 2; // "Qual sabor te agrada mais?"
const CAFFEINE_QUESTION_INDEX = 3; // "Você aceita cafeína?"

export function computeScores(answers: number[]): Record<string, number> {
  const scores: Record<string, number> = {};
  teas.forEach((t) => {
    scores[t.name] = 0;
  });

  answers.forEach((optionIndex, questionIndex) => {
    const option = quizData[questionIndex]?.opts[optionIndex];
    if (!option) return;
    Object.entries(option.scores).forEach(([name, points]) => {
      scores[name] = (scores[name] ?? 0) + (points ?? 0);
    });
  });

  return scores;
}

function teasWithMaxScore(scores: Record<string, number>, candidates: Tea[]): Tea[] {
  let bestValue = -Infinity;
  let winners: Tea[] = [];
  candidates.forEach((t) => {
    const value = scores[t.name] ?? 0;
    if (value > bestValue) {
      bestValue = value;
      winners = [t];
    } else if (value === bestValue) {
      winners.push(t);
    }
  });
  return winners;
}

// Critério de desempate quando 2+ chás empatam no placar total:
// 1) sabor preferido (pergunta 3) — sinal mais direto de preferência de paladar;
// 2) aceitação de cafeína (pergunta 4);
// 3) último recurso: ordem de `data/teas.ts`, mantida aqui de forma
//    explícita e documentada em vez de cair nisso por acidente.
function breakTie(winners: Tea[], answers: number[]): Tea {
  if (winners.length <= 1) return winners[0];

  let candidates = winners;

  const flavorOption = quizData[FLAVOR_QUESTION_INDEX]?.opts[answers[FLAVOR_QUESTION_INDEX]];
  if (flavorOption) {
    const flavorMatches = candidates.filter((t) => (flavorOption.scores[t.name] ?? 0) > 0);
    if (flavorMatches.length === 1) return flavorMatches[0];
    if (flavorMatches.length > 1) candidates = flavorMatches;
  }

  const caffeineOption = quizData[CAFFEINE_QUESTION_INDEX]?.opts[answers[CAFFEINE_QUESTION_INDEX]];
  if (caffeineOption) {
    const caffeineMatches = candidates.filter((t) => (caffeineOption.scores[t.name] ?? 0) > 0);
    if (caffeineMatches.length === 1) return caffeineMatches[0];
    if (caffeineMatches.length > 1) candidates = caffeineMatches;
  }

  return candidates[0];
}

export function computeRecommendation(answers: number[]): Tea {
  const scores = computeScores(answers);
  const winners = teasWithMaxScore(scores, teas);
  return breakTie(winners, answers);
}

export function computeComplementary(answers: number[], primarySlug: string): Tea {
  const scores = computeScores(answers);
  const candidates = teas.filter((t) => t.slug !== primarySlug);
  const winners = teasWithMaxScore(scores, candidates);
  if (winners.length === 0) return candidates[0] ?? teas[1];
  return breakTie(winners, answers);
}
