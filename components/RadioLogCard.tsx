import type { RadioLog } from "@/lib/radioLog";

type DisplayPhase = "idle" | "transmitting" | "decoding" | "received" | "degraded";

export function RadioLogCard({ log, phase }: { log: RadioLog | null; phase: DisplayPhase }) {
  const isProcessing = phase === "transmitting" || phase === "decoding";
  const visibleLog = isProcessing ? null : log;

  return (
    <article className="log-card" aria-label="수신된 통신 기록">
      <header><p>RECEIVED TRANSMISSION</p><span>ARCHIVE / {visibleLog?.number ?? "---"}</span></header>
      <div className="log-meta">
        <p>LOG # <span>{visibleLog?.number ?? "---"}</span></p>
        <p>DATE <span>{visibleLog?.date ?? "---"}</span></p>
        <p>POSITION <span>{visibleLog ? visibleLog.coordinate ?? visibleLog.locationHint : "---"}</span></p>
        <p>SEA STATE <span>{visibleLog ? `${visibleLog.code} / ${visibleLog.summary}` : "---"}</span></p>
      </div>
      <div className="log-body" aria-live="polite">
        {visibleLog ? (
          <div className="log-transcript">
            <p className="static">{visibleLog.openingLine}</p>
            {visibleLog.body.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
            <p>{visibleLog.closingLine}</p>
          </div>
        ) : (
          <p className="log-placeholder">{isProcessing ? "DECODING TRANSMISSION..." : phase === "degraded" ? "SIGNAL DEGRADED" : "AWAITING TRANSMISSION"}</p>
        )}
      </div>
      <footer><p>{visibleLog ? `${visibleLog.generationMode === "fallback" ? "SIGNAL DEGRADED" : "LOG RECEIVED"} / ${visibleLog.datetime}` : `STATUS / ${isProcessing ? "DECODING" : phase === "degraded" ? "SIGNAL DEGRADED" : "STANDBY"}`}</p></footer>
    </article>
  );
}
