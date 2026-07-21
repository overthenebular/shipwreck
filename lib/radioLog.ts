import { isSeaCode, type SeaCode, type SeaState } from "../data/seaStates.ts";

export interface GeneratedRadioLogContent {
  seaCode: SeaCode;
  openingLine: string;
  body: string[];
  closingLine: string;
}

export interface RadioLog {
  number: string;
  date: string;
  datetime: string;
  coordinate: string | null;
  locationHint: string;
  code: SeaCode;
  summary: string;
  openingLine: string;
  body: string[];
  closingLine: string;
  generationMode: "ai" | "fallback";
}

function isNonEmptyLine(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function parseGeneratedRadioLogContent(
  text: string,
  selectedSeaState: SeaState,
): GeneratedRadioLogContent | null {
  try {
    const value = JSON.parse(text) as Record<string, unknown>;
    if (!isSeaCode(value.seaCode) || value.seaCode !== selectedSeaState.code) return null;
    if (!isNonEmptyLine(value.openingLine) || !isNonEmptyLine(value.closingLine)) return null;
    if (!Array.isArray(value.body) || value.body.length < 3 || value.body.length > 5) return null;
    if (!value.body.every(isNonEmptyLine)) return null;
    return {
      seaCode: value.seaCode,
      openingLine: value.openingLine.trim(),
      body: value.body.map((line) => line.trim()),
      closingLine: value.closingLine.trim(),
    };
  } catch {
    return null;
  }
}

function stableIndex(seed: string, length: number) {
  const hash = Array.from(seed).reduce((total, character) => total + character.codePointAt(0)!, 0);
  return hash % length;
}

export function createFallbackContent(
  userInput: string,
  selectedSeaState: SeaState,
): GeneratedRadioLogContent {
  const openings = [
    "[치직...] 오늘 상태를 기록한다.",
    "[신호 불안정...] 현재 위치에서 기록을 송신한다.",
    "[잡음 수신...] 표류 기록 채널을 연다.",
    "[치직...] 짧은 상태 보고를 남긴다.",
  ];
  const closings = [
    "현재 상태를 저장한다. 통신 종료.",
    "수신 여부는 확인하지 않는다. 기록 종료.",
    "기록을 남긴다. 송신은 여기서 끝낸다.",
    "오늘 기록은 여기까지 남긴다. 통신 종료.",
  ];
  const cleaned = userInput.replace(/[\r\n]+/g, " ").trim();
  const surface = selectedSeaState.waveAndVisibility.split("·")[0].trim();
  const index = stableIndex(cleaned, openings.length);

  return {
    seaCode: selectedSeaState.code,
    openingLine: openings[index],
    body: [
      `나는 오늘의 상태를 “${cleaned}”라고 짧게 기록한다.`,
      `선체의 움직임은 ${surface}에 가까운 것으로 확인된다.`,
      "지금 확인되는 범위는 이 짧은 기록까지다.",
    ],
    closingLine: closings[index],
  };
}
