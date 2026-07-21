import assert from "node:assert/strict";
import { test } from "node:test";
import { SEA_STATE_BY_CODE } from "../data/seaStates.ts";
import { buildRadioLogPrompt } from "../lib/radioLogPrompt.ts";
import {
  createFallbackContent,
  parseGeneratedRadioLogContent,
} from "../lib/radioLog.ts";

test("프롬프트에는 선택된 SEA 상태만 상세 전달한다", () => {
  const prompt = buildRadioLogPrompt({
    userInput: "설레면서도 조금 긴장된다.",
    currentDatetime: "2026-07-21 15:30 KST",
    locationHint: "제주 북부 해역",
    selectedSeaState: SEA_STATE_BY_CODE["SEA-03"],
  });

  assert.match(prompt, /SEA-03/);
  assert.match(prompt, /맑음 · 바람 증가/);
  assert.doesNotMatch(prompt, /SEA-09/);
  assert.match(prompt, /정확한 좌표도 만들지 않는다/);
});

test("구조화 응답은 코드·본문 길이·필수 필드를 검증한다", () => {
  const selected = SEA_STATE_BY_CODE["SEA-06"];
  const valid = JSON.stringify({
    seaCode: "SEA-06",
    openingLine: "[치직...] 오늘 상태를 기록한다.",
    body: ["나는 거의 움직이지 못했다.", "계기판의 불빛도 낮다.", "확인되는 움직임은 여기까지다."],
    closingLine: "현재 상태를 저장한다. 통신 종료.",
  });

  assert.ok(parseGeneratedRadioLogContent(valid, selected));
  assert.equal(parseGeneratedRadioLogContent("not-json", selected), null);
  assert.equal(parseGeneratedRadioLogContent(valid.replace("SEA-06", "SEA-08"), selected), null);
  assert.equal(parseGeneratedRadioLogContent(JSON.stringify({ seaCode: "SEA-06", openingLine: "열림", body: [], closingLine: "닫힘" }), selected), null);
});

test("fallback은 입력을 보존하고 허위 좌표나 인물을 만들지 않는다", () => {
  const fallback = createFallbackContent("피곤함", SEA_STATE_BY_CODE["SEA-06"]);
  const output = [fallback.openingLine, ...fallback.body, fallback.closingLine].join(" ");

  assert.equal(fallback.seaCode, "SEA-06");
  assert.equal(fallback.body.length, 3);
  assert.match(output, /피곤함/);
  assert.doesNotMatch(output, /[NS] \d+|위도|경도|가족|연인|회사/);
});
