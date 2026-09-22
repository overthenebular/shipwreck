"use client";

import { useEffect, useRef } from "react";

const signals = [
  { duration: "4.1s", delay: "0s" },
  { duration: "5.7s", delay: "1.4s" },
  { duration: "6.3s", delay: "2.2s" },
  { duration: "4.8s", delay: ".8s" },
];

function placeSignal(dot: HTMLSpanElement) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 8 + Math.random() * 34;
  dot.style.left = `${50 + Math.cos(angle) * radius}%`;
  dot.style.top = `${50 + Math.sin(angle) * radius}%`;
}

export function Radar() {
  const radarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    radarRef.current?.querySelectorAll<HTMLSpanElement>(".signal").forEach(placeSignal);
  }, []);

  return (
    <div className="radar-block">
      <div ref={radarRef} className="radar" role="img" aria-label="신호를 탐색하며 천천히 회전하는 레이더">
        <div className="radar-ring ring-1" />
        <div className="radar-ring ring-2" />
        <div className="radar-cross horizontal" />
        <div className="radar-cross vertical" />
        <div className="radar-sweep" />
        {signals.map((signal, index) => (
          <span
            key={index}
            className="signal"
            style={{ animationDelay: signal.delay, animationDuration: signal.duration }}
            onAnimationIteration={(event) => placeSignal(event.currentTarget)}
          />
        ))}
        <span className="radar-center" />
      </div>
      <div className="radar-readout" aria-hidden="true">
        <span>RANGE 40 NM</span><span>SWEEP 06 RPM</span>
      </div>
    </div>
  );
}
