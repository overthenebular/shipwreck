import {
  SEA_STATE_BY_CODE,
  type SeaCode,
  type SeaState,
} from "../data/seaStates.ts";

type Scores = Record<SeaCode, number>;

const MODERATE_TIE_ORDER: SeaCode[] = [
  "SEA-02", "SEA-01", "SEA-04", "SEA-06", "SEA-03",
  "SEA-05", "SEA-07", "SEA-09", "SEA-10", "SEA-08",
];

function matches(input: string, pattern: RegExp) {
  return pattern.test(input);
}

function add(scores: Scores, code: SeaCode, amount: number) {
  scores[code] += amount;
}

/**
 * 짧은 입력을 여러 정서 신호의 조합으로 평가한다.
 * 극단 코드와 행동 기반 코드는 필요한 신호가 함께 나타날 때만 열어 둔다.
 */
export function selectSeaState(userInput: string): SeaState {
  const input = userInput.trim().toLowerCase();
  const scores = Object.fromEntries(
    MODERATE_TIE_ORDER.map((code) => [code, 0]),
  ) as Scores;

  const stable = matches(input, /편안|평온|안도|마음이 놓|가벼워|좋아진/);
  const recovery = matches(input, /괜찮아진|나아진|회복|조금은 괜찮|다시 조금/);
  if (stable) add(scores, "SEA-01", 8);
  if (recovery) add(scores, "SEA-01", 10);

  const hesitant = matches(input, /망설|마음이 걸|괜히.*걸|조금 불편|어딘가 불편|주저|애매/);
  const lowUnease = matches(input, /신경 쓰|고민|마음에 남|불안/);
  if (hesitant) add(scores, "SEA-02", 10);
  if (lowUnease) add(scores, "SEA-02", 5);

  const positiveChange = matches(input, /설레|기대|시작|새로운|새로|변화|해볼|펼쳐질/);
  const nearFuture = matches(input, /이제|곧|앞으로|다가올|될 것 같|시작될/);
  if (positiveChange) add(scores, "SEA-03", 9);
  if (positiveChange && nearFuture) add(scores, "SEA-03", 6);

  const remembrance = matches(input, /그립|생각났|떠올랐|보고 싶|지난|예전|과거|문득.*생각/);
  const absenceOrWaiting = matches(input, /기다림|기다리|오지 않|도착하지 않|응답이 없|부재|미련/);
  if (remembrance) add(scores, "SEA-04", 11);
  if (absenceOrWaiting) add(scores, "SEA-04", 9);

  const fatigue = matches(input, /피곤|지쳤|힘들|버겁|무겁|부담|기운이 없/);
  const persistence = matches(input, /버텨|해야 한다|해야 해|아직.*끝내|계속.*하|붙들|남은 힘|포기하지|끝내지는 않/);
  if (fatigue) add(scores, "SEA-06", 7);
  if (fatigue && persistence) add(scores, "SEA-05", 16);

  const lowEnergy = matches(input, /아무것도 하고 싶지|무기력|가라앉|움직이고 싶지|움직이지 못|침잠|기운이 없|누워만/);
  if (lowEnergy) add(scores, "SEA-06", 13);

  const overwhelmed = matches(input, /감당.*벅차|벅차|크게 흔들|압도|거세게 흔들|정신없/);
  const retainedControl = matches(input, /정신.*붙들|아직.*말할 수|질서.*유지|통제.*유지|정신은.*있|붙잡고 있/);
  if (overwhelmed) add(scores, "SEA-07", 5);
  if (overwhelmed && retainedControl) add(scores, "SEA-07", 15);

  const severeBreak = matches(input, /안 돼|모르겠다|무너진|무너진다|이어지지 않|생각.*끊|못 견디|파편|붕괴/);
  const fragments = input.split(/[.!?…。]+/).map((part) => part.trim()).filter(Boolean);
  const multipleSevereSignals = (input.match(/안 돼|모르겠다|무너진|이어지지 않|끊|못 견디/g) ?? []).length >= 2;
  const fragmentedExpression = fragments.length >= 3 || multipleSevereSignals;
  if (severeBreak) add(scores, "SEA-08", 5);
  if (severeBreak && fragmentedExpression) add(scores, "SEA-08", 17);

  const negativeFuture = matches(input, /곧|다가올|앞으로|올 것|일어날|예감|전조/);
  const threat = matches(input, /좋지 않|불길|위험|나쁜 일|걱정|불안|경계|두렵|신경 쓰/);
  if (negativeFuture && threat) add(scores, "SEA-09", 18);

  const numbness = matches(input, /아무 감정도|감정.*남아 있지|무감각|공허|텅 빈|비어 있|아무것도 느끼|감각이 없/);
  const unnaturalStillness = matches(input, /이상할 만큼 조용|부자연.*조용|낯설.*정적|시간이 멈춘|끝났는데.*조용/);
  if (numbness) add(scores, "SEA-10", 17);
  if (unnaturalStillness) add(scores, "SEA-10", 19);

  // 단어 하나처럼 맥락이 부족한 입력은 과격하게 확대하지 않는다.
  const compact = input.replace(/[.!?\s]/g, "");
  if (/^(불안|조용함|조용|끝)$/.test(compact)) add(scores, "SEA-02", 12);
  if (/^(피곤함|피곤|피로)$/.test(compact)) add(scores, "SEA-06", 12);
  if (/^(공허함|공허|무감각)$/.test(compact)) add(scores, "SEA-10", 18);
  if (/^(설렘|기대)$/.test(compact)) add(scores, "SEA-03", 12);
  if (/^(그리움|기다림)$/.test(compact)) add(scores, "SEA-04", 12);

  // 강한 코드에는 각각의 구분 신호가 반드시 필요하다.
  if (!(fatigue && persistence)) scores["SEA-05"] = Number.NEGATIVE_INFINITY;
  if (!(overwhelmed && retainedControl)) scores["SEA-07"] = Number.NEGATIVE_INFINITY;
  if (!(severeBreak && fragmentedExpression)) scores["SEA-08"] = Number.NEGATIVE_INFINITY;
  if (!(negativeFuture && threat)) scores["SEA-09"] = Number.NEGATIVE_INFINITY;
  if (!(numbness || unnaturalStillness)) scores["SEA-10"] = Number.NEGATIVE_INFINITY;

  const selectedCode = MODERATE_TIE_ORDER.reduce((best, code) =>
    scores[code] > scores[best] ? code : best,
  );

  return SEA_STATE_BY_CODE[selectedCode];
}
