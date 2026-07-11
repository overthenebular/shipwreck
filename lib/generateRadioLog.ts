export type RadioLog = { number: string; date: string; datetime: string; coordinate: string; code: string; summary: string; body: string[] };

const profiles = [
  { code: "SEA-10", summary: "완전 무풍, 정체 상태", words: ["멈춤", "정지", "아무것도", "정체", "가만", "침대"], image: "바람 없는 해면처럼 멈춰 있었다" },
  { code: "SEA-08", summary: "폭풍, 큰 파도", words: ["무섭", "공포", "불안", "분노", "살려", "버티"], image: "거센 파도가 선체를 계속 두드렸다" },
  { code: "SEA-06", summary: "완전 흐림, 낮은 에너지", words: ["우울", "피곤", "지침", "방전", "낮은", "무기력"], image: "낮게 내려앉은 구름 아래에서 동력이 줄어들었다" },
  { code: "SEA-04", summary: "비 간헐, 잔물결", words: ["그립", "기다", "미련", "불확실"], image: "간헐적인 비가 지나간 항로를 흐리게 했다" },
  { code: "SEA-01", summary: "맑음, 바람 약함", words: ["평온", "좋다", "괜찮", "희망"], image: "약한 바람이 선체를 천천히 밀고 있다" },
  { code: "SEA-02", summary: "약간 흐림, 바람 약함", words: ["생각", "고요", "차분"], image: "옅은 구름 아래 잔물결만 오래 이어졌다" },
];

export function generateRadioLog(userInput: string): RadioLog {
  const profile = profiles.find((item) => item.words.some((word) => userInput.includes(word))) ?? profiles[5];
  const now = new Date();
  const date = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(now);
  const datetime = `${new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul", dateStyle: "short", timeStyle: "short", hour12: false }).format(now)} KST`;
  const number = String(Math.floor(Math.random() * 900) + 100);
  const cleaned = userInput.replace(/[.!?]+$/g, "");
  return {
    number, date, datetime, coordinate: "N 33°27′ / E 126°33′", code: profile.code, summary: profile.summary,
    body: [
      `나는 오늘의 상태를 “${cleaned}”라고 기록했다.`,
      `주변은 ${profile.image}.`,
      "정확한 항로는 아직 확인되지 않았지만 현재 위치를 잃지 않기 위해 이 신호를 남긴다.",
      "멈춰 있는 시간도 표류 기록의 일부로 확인된다.",
    ],
  };
}
