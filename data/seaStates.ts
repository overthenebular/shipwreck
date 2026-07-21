export type SeaCode =
  | "SEA-01" | "SEA-02" | "SEA-03" | "SEA-04" | "SEA-05"
  | "SEA-06" | "SEA-07" | "SEA-08" | "SEA-09" | "SEA-10";

export interface SeaState {
  code: SeaCode;
  internalCondition: string;
  waveAndVisibility: string;
  coreResponse: string[];
  variations: string[];
  writingRules: string[];
  soundTextures: string[];
}

export const SEA_STATES: SeaState[] = [
  {
    code: "SEA-01",
    internalCondition: "맑음 · 바람 약함",
    waveAndVisibility: "잔잔함 · 시야 양호",
    coreResponse: ["안정", "회복"],
    variations: ["희망", "안도", "담담한 기쁨"],
    writingRules: ["희망을 직접 선언하지 않는다.", "켜진 불빛, 수리된 장비, 따뜻한 음식처럼 작은 회복으로 암시한다."],
    soundTextures: ["잔물결", "가벼운 바람", "먼 금속음"],
  },
  {
    code: "SEA-02",
    internalCondition: "약한 흐림 · 바람 약함",
    waveAndVisibility: "미세한 출렁임 · 시야 유지",
    coreResponse: ["낮은 긴장", "망설임"],
    variations: ["조심", "불편", "기다림"],
    writingRules: ["짧고 고른 문장으로 쓴다.", "결론을 서두르지 않고 관찰을 한 번 더 남긴다."],
    soundTextures: ["돛천 스침", "가벼운 선체 마찰"],
  },
  {
    code: "SEA-03",
    internalCondition: "맑음 · 바람 증가",
    waveAndVisibility: "작은 파도 · 시야 선명",
    coreResponse: ["변화의 예감"],
    variations: ["기대", "초조", "준비"],
    writingRules: ["무언가 시작될 듯한 감각을 만든다.", "관찰 뒤에 작은 준비 행동을 붙인다."],
    soundTextures: ["선명해지는 바람", "팽팽해진 로프"],
  },
  {
    code: "SEA-04",
    internalCondition: "간헐적 비",
    waveAndVisibility: "잔물결+비 · 시야 흔들림",
    coreResponse: ["회상", "그리움"],
    variations: ["외로움", "기다림", "잔잔한 상실"],
    writingRules: ["문장 끝을 완전히 닫지 않는다.", "과거의 대상이나 도착하지 않은 응답을 간접적으로 언급한다."],
    soundTextures: ["빗방울", "젖은 갑판", "멀어진 신호"],
  },
  {
    code: "SEA-05",
    internalCondition: "비바람 · 구름 많음",
    waveAndVisibility: "거친 파도 · 시야 제한",
    coreResponse: ["버팀", "피로", "책임"],
    variations: ["결단", "고독", "집중"],
    writingRules: ["군더더기 없이 상태와 조치를 기록한다.", "감정 설명보다 행동과 책임을 앞세운다."],
    soundTextures: ["굵은 비", "목재 마찰", "숨 고르기"],
  },
  {
    code: "SEA-06",
    internalCondition: "완전 흐림",
    waveAndVisibility: "잔물결 · 빛 없음",
    coreResponse: ["침잠", "반응 지연"],
    variations: ["무기력", "내면 회수", "공백"],
    writingRules: ["문장 사이 여백을 길게 둔다.", "식은 컵, 젖은 목재, 꺼진 계기판 같은 사물로 상태를 드러낸다."],
    soundTextures: ["먼 물소리", "느린 삐걱임", "낮은 잡음"],
  },
  {
    code: "SEA-07",
    internalCondition: "폭우",
    waveAndVisibility: "거센 파도 · 시야 불량",
    coreResponse: ["위기 보고", "대응"],
    variations: ["공포", "긴박", "통제 유지"],
    writingRules: ["문장 구조는 유지한다.", "상태→조치 순으로 쓰고, 요청이 필요하다면 한 번만 남긴다."],
    soundTextures: ["강한 물보라", "경보음", "끊기는 교신"],
  },
  {
    code: "SEA-08",
    internalCondition: "폭풍",
    waveAndVisibility: "극한 파도 · 시야 거의 없음",
    coreResponse: ["생존 행동"],
    variations: ["절박", "혼란", "버티기"],
    writingRules: ["단문과 파편으로 끊는다.", "주어를 생략할 수 있으며 설명보다 지금 해야 할 행동만 남긴다."],
    soundTextures: ["금속 충돌", "찢긴 바람", "무전 파열음"],
  },
  {
    code: "SEA-09",
    internalCondition: "폭풍 전조",
    waveAndVisibility: "낮고 무거운 파도 · 빛 급감",
    coreResponse: ["대비", "경계"],
    variations: ["불길함", "집중", "체념 섞인 준비"],
    writingRules: ["다가오는 위험을 이미 알고 대비하는 상태다.", "체크리스트처럼 건조하게 준비 사항을 기록한다."],
    soundTextures: ["압력이 낮아지는 정적", "먼 천둥", "로프 장력"],
  },
  {
    code: "SEA-10",
    internalCondition: "무풍 · 무광",
    waveAndVisibility: "잔잔하지만 부자연스러움 · 시야 정지",
    coreResponse: ["정적", "정체"],
    variations: ["안도", "무기력", "폭풍 뒤 공백", "불길한 평온"],
    writingRules: ["대부분은 건조한 사실 묘사로 유지한다.", "마지막 한 문장만 기묘하게 열어둔다."],
    soundTextures: ["소리 거의 없음", "희미한 전기 잡음"],
  },
];

export const SEA_OPERATION_RULES = [
  "실황 날씨는 바깥의 상태, SEA 코드는 송신자의 내부 상태다. 둘은 서로 달라도 된다.",
  "실제 날씨를 함께 표기할 때는 WX 코드나 별도 actualWeather 항목으로 분리한다.",
  "코드는 감정명보다 사용자의 행동, 속도, 긴장도, 반응 상태를 중심으로 선택한다.",
  "감정명은 출력하지 않고 사물, 행동, 장면으로 번역한다.",
  "사운드 요소는 한 로그에 0~1개만 사용한다.",
  "같은 코드 안에서도 변주를 허용하고 동일한 비유, 사물, 결말을 반복하지 않는다.",
] as const;

export const SEA_STATE_BY_CODE = Object.fromEntries(
  SEA_STATES.map((state) => [state.code, state]),
) as Record<SeaCode, SeaState>;

export function isSeaCode(value: unknown): value is SeaCode {
  return typeof value === "string" && value in SEA_STATE_BY_CODE;
}
