import type { CSSProperties } from "react";
import type { RadioLog } from "@/lib/radioLog";

type DisplayPhase = "idle" | "transmitting" | "decoding" | "received" | "degraded";

export function RadioLogCard({ log, phase, audioEnabled, onToggleAudio, volumeLevel, onVolumeChange }: {
  log: RadioLog | null;
  phase: DisplayPhase;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  volumeLevel: number;
  onVolumeChange: (level: number) => void;
}) {
  const isProcessing = phase === "transmitting" || phase === "decoding";
  const visibleLog = isProcessing ? null : log;

  return (
    <article className="log-card" aria-label="수신된 통신 기록">
      <header><p>RECEIVED TRANSMISSION</p><span>ARCHIVE / {visibleLog?.number ?? "---"}</span></header>
      <div className="log-screen">
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
      </div>
      <footer className="receiver-controls">
        <p className="receiver-strip">{visibleLog ? `${visibleLog.generationMode === "fallback" ? "SIGNAL DEGRADED" : "LOG RECEIVED"} / ${visibleLog.datetime}` : `STATUS / ${isProcessing ? "DECODING" : phase === "degraded" ? "SIGNAL DEGRADED" : "STANDBY"}`}</p>
        <div className="control-section">
          <button
            className="radar-audio-toggle"
            type="button"
            aria-label={audioEnabled ? "레이더 오디오 끄기" : "레이더 오디오 켜기"}
            aria-pressed={audioEnabled}
            onClick={onToggleAudio}
          >
            <span>AUDIO</span><span className="toggle-lever" aria-hidden="true" /><small>{audioEnabled ? "ON" : "OFF"}</small>
          </button>
          <div className="level-control">
            <label htmlFor="radar-level">LEVEL <span>{volumeLevel}</span></label>
            <div className="level-knob" style={{ "--knob-angle": `${-125 + volumeLevel * 25}deg` } as CSSProperties}>
              <span className="knob-face" aria-hidden="true" />
              <input id="radar-level" type="range" min="0" max="10" step="1" value={volumeLevel} onChange={(event) => onVolumeChange(Number(event.target.value))} aria-valuetext={`${volumeLevel} / 10`} />
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
