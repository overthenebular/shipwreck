"use client";

import { useState } from "react";
import { Radar } from "@/components/Radar";
import { RadioLogCard } from "@/components/RadioLogCard";
import { SignalInput } from "@/components/SignalInput";
import { generateRadioLog, type RadioLog } from "@/lib/generateRadioLog";

export default function Home() {
  const [log, setLog] = useState<RadioLog | null>(null);

  return (
    <main className="station-shell">
      <div className="noise" aria-hidden="true" />
      <header className="masthead">
        <span className="brand-mark" aria-hidden="true">SW</span>
        <p>SHIPWRECK / MIDNIGHT COASTAL RADIO STATION</p>
        <p className="frequency">FREQ. 27.185 MHz</p>
      </header>

      <section className="station" aria-labelledby="station-title">
        <div className="intro">
          <p className="eyebrow"><span />CHANNEL 01 · OPEN</p>
          <h1 id="station-title">심야 해안 통신소</h1>
          <p className="description">오늘의 신호를 남겨주세요.<br />닿지 못해도, 기록은 남습니다.</p>
        </div>

        <Radar />
        <SignalInput onGenerate={async (value) => setLog(generateRadioLog(value))} />
        {log && <RadioLogCard log={log} />}
      </section>

      <footer className="station-footer">
        <p>COASTAL OBSERVATION POST · 33°27′N 126°33′E</p>
        <p><span className="status-dot" />RECEIVER ONLINE</p>
      </footer>
    </main>
  );
}
