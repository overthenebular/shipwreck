"use client";

import { useEffect, useRef, useState } from "react";

const SWEEP_DURATION_MS = 10_000;
const MIN_RADIUS = 13;
const MAX_RADIUS = 39;
const MIN_SPACING = 12;

type Signal = {
  id: string;
  x: number;
  y: number;
  delayMs: number;
  fadeMs: number;
  weak: boolean;
};

function createSignals(cycle: number): Signal[] {
  const count = 2 + Math.floor(Math.random() * 4);
  const next: Signal[] = [];

  for (let attempts = 0; next.length < count && attempts < 100; attempts++) {
    const fadeMs = 1_000 + Math.random() * 2_000;
    const delayMs = 150 + Math.random() * (SWEEP_DURATION_MS - fadeMs - 300);
    const angle = (delayMs / SWEEP_DURATION_MS) * Math.PI * 2;
    const radius = Math.sqrt(MIN_RADIUS ** 2 + Math.random() * (MAX_RADIUS ** 2 - MIN_RADIUS ** 2));
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;

    if (next.some((signal) => Math.hypot(signal.x - x, signal.y - y) < MIN_SPACING)) continue;

    next.push({
      id: `${cycle}-${next.length}`,
      x,
      y,
      delayMs,
      fadeMs,
      weak: Math.random() < 0.3,
    });
  }

  return next;
}

export function Radar({ receiverStatus, onSweep, onSignalDetected }: {
  receiverStatus: string;
  onSweep: () => void;
  onSignalDetected: (weak: boolean) => void;
}) {
  const cycleRef = useRef(0);
  const [signals, setSignals] = useState<Signal[]>([]);
  const soundedSignalsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSignals(createSignals(cycleRef.current)));
    return () => cancelAnimationFrame(frame);
  }, []);

  function startNextSweep() {
    onSweep();
    cycleRef.current += 1;
    soundedSignalsRef.current.clear();
    setSignals(createSignals(cycleRef.current));
  }

  function detectSignal(signal: Signal) {
    if (soundedSignalsRef.current.has(signal.id)) return;
    soundedSignalsRef.current.add(signal.id);
    onSignalDetected(signal.weak);
  }

  return (
    <div className="radar-block">
      <div className="radar-dial">
        <div className="radar" role="img" aria-label="신호를 탐색하며 천천히 회전하는 레이더">
          <div className="radar-ring ring-1" />
          <div className="radar-ring ring-2" />
          <div className="radar-ring ring-3" />
          <div className="radar-cross horizontal" />
          <div className="radar-cross vertical" />
          <div
            className="radar-sweep"
            style={{ animationDuration: `${SWEEP_DURATION_MS}ms` }}
            onAnimationIteration={startNextSweep}
          />
          {signals.map((signal) => (
            <span
              key={signal.id}
              className={signal.weak ? "signal signal--weak" : "signal"}
              onAnimationStart={(event) => {
                if (event.animationName === "signal-echo") detectSignal(signal);
              }}
              style={{
                left: `${signal.x}%`,
                top: `${signal.y}%`,
                animationDelay: `${signal.delayMs}ms`,
                animationDuration: `${signal.fadeMs}ms`,
              }}
            />
          ))}
          <span className="radar-center" />
        </div>
        <div className="radar-compass" aria-hidden="true">
          <span className="radar-compass-n">N</span>
          <span className="radar-compass-e">E</span>
          <span className="radar-compass-s">S</span>
          <span className="radar-compass-w">W</span>
        </div>
      </div>
      <div className="radar-readout" aria-hidden="true">
        <span>RANGE 40 NM</span><span>SWEEP 06 RPM</span>
      </div>
      <p className="receiver-status" role="status" aria-live="polite">
        <span className="status-dot" /><span key={receiverStatus} className="status-text">{receiverStatus}</span>
      </p>
    </div>
  );
}
