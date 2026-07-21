import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { selectSeaState } from "../lib/selectSeaState.ts";

const representativeCases = [
  ["편안하다.", "SEA-01"],
  ["조금은 괜찮아진 것 같다.", "SEA-01"],
  ["괜히 마음이 걸린다.", "SEA-02"],
  ["망설여진다.", "SEA-02"],
  ["이제 뭔가 시작될 것 같다.", "SEA-03"],
  ["설레면서도 조금 긴장된다.", "SEA-03"],
  ["문득 그 사람이 생각났다.", "SEA-04"],
  ["그립다.", "SEA-04"],
  ["힘들지만 오늘은 버텨야 한다.", "SEA-05"],
  ["지쳤지만 아직 끝내지는 않았다.", "SEA-05"],
  ["아무것도 하고 싶지 않다.", "SEA-06"],
  ["마음이 계속 가라앉는다.", "SEA-06"],
  ["감당하기 벅차지만 정신은 붙들고 있다.", "SEA-07"],
  ["마음이 크게 흔들리지만 아직 말할 수 있다.", "SEA-07"],
  ["안 돼. 모르겠다. 그냥 버텨야 한다.", "SEA-08"],
  ["무너진다. 아무 생각도 이어지지 않는다.", "SEA-08"],
  ["곧 좋지 않은 일이 올 것만 같다.", "SEA-09"],
  ["다가올 일이 자꾸 신경 쓰인다.", "SEA-09"],
  ["아무 감정도 남아 있지 않다.", "SEA-10"],
  ["모든 게 끝났는데 이상할 만큼 조용하다.", "SEA-10"],
] as const;

describe("대표 짧은 입력의 내부 해상 선택", () => {
  for (const [input, expected] of representativeCases) {
    test(`${input} → ${expected}`, () => {
      assert.equal(selectSeaState(input).code, expected);
    });
  }
});

describe("단어 하나의 과도하지 않은 해석", () => {
  const wordCases = [
    ["피곤함", "SEA-06"],
    ["공허함", "SEA-10"],
    ["설렘", "SEA-03"],
    ["그리움", "SEA-04"],
    ["불안", "SEA-02"],
    ["조용함", "SEA-02"],
    ["끝", "SEA-02"],
    ["기다림", "SEA-04"],
  ] as const;

  for (const [input, expected] of wordCases) {
    test(`${input} → ${expected}`, () => {
      assert.equal(selectSeaState(input).code, expected);
    });
  }
});

test("강도와 통제 신호가 없으면 극단 코드를 열지 않는다", () => {
  assert.notEqual(selectSeaState("무섭다").code, "SEA-08");
  assert.notEqual(selectSeaState("조용하다").code, "SEA-10");
  assert.notEqual(selectSeaState("피곤하다").code, "SEA-05");
});
