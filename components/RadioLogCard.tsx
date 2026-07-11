import type { RadioLog } from "@/lib/generateRadioLog";

export function RadioLogCard({ log }: { log: RadioLog }) {
  return (
    <article className="log-card" aria-live="polite">
      <header><p>RECEIVED TRANSMISSION</p><span>ARCHIVE / {log.number}</span></header>
      <div className="log-meta"><p>로그 # {log.number}</p><p>· 날짜 : {log.date}</p><p>· 위치 좌표 : {log.coordinate}</p><p>· 날씨 코드 : {log.code} / {log.summary}</p></div>
      <div className="log-body"><p className="static">[치직...] 수신 여부 불명. 여기는 망망대해.</p>{log.body.map((line) => <p key={line}>{line}</p>)}<p>응답 확인 불가. 기록은 남긴다. 통신 종료.</p></div>
      <footer><p>신호 종료</p><p>[통신 로그 저장됨 / {log.datetime}]</p></footer>
    </article>
  );
}
