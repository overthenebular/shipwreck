import type { RadioLog } from "@/lib/radioLog";

export function RadioLogCard({ log }: { log: RadioLog }) {
  return (
    <article className="log-card" aria-live="polite">
      <header><p>RECEIVED TRANSMISSION</p><span>ARCHIVE / {log.number}</span></header>
      <div className="log-meta">
        <p>로그 # {log.number}</p>
        <p>· 날짜 : {log.date}</p>
        <p>· {log.coordinate ? "위치 좌표" : "추정 위치"} : {log.coordinate ?? log.locationHint}</p>
        <p>· 내부 해상 : {log.code} / {log.summary}</p>
      </div>
      <div className="log-body">
        <p className="static">{log.openingLine}</p>
        {log.body.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
        <p>{log.closingLine}</p>
      </div>
      <footer><p>[통신 로그 저장됨 / {log.datetime}]</p></footer>
    </article>
  );
}
