"use client";

import { useState } from "react";
import { Radar } from "@/components/Radar";
import { RadioLogCard } from "@/components/RadioLogCard";
import { SignalInput } from "@/components/SignalInput";
import { useRadarAudio } from "@/hooks/useRadarAudio";
import type { RadioLog } from "@/lib/radioLog";

export default function Home() {
  const { audioEnabled, toggleAudio, volumeLevel, changeVolumeLevel, playSweepPip, playSignalBeep } = useRadarAudio();
  const [log, setLog] = useState<RadioLog | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"idle" | "transmitting" | "decoding" | "received" | "degraded">("idle");
  const loading = phase === "transmitting" || phase === "decoding";
  const receiverStatus = {
    idle: value.trim() ? "SIGNAL DETECTED" : "RECEIVER / STANDBY",
    transmitting: "TRANSMITTING",
    decoding: "DECODING TRANSMISSION",
    received: "LOG RECEIVED",
    degraded: "SIGNAL DEGRADED",
  }[phase];

  async function generateWithAI(userInput: string) {
    const response = await fetch("/api/radio-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput }),
    });
    const result = (await response.json()) as { log?: RadioLog; error?: string };
    if (!response.ok || !result.log) throw new Error(result.error || "신호 해석에 실패했습니다.");
    setLog(result.log);
    setPhase(result.log.generationMode === "fallback" ? "degraded" : "received");
  }

  function updateValue(nextValue: string) {
    setValue(nextValue);
    setError("");
    setPhase("idle");
  }

  async function submitSignal(userInput: string) {
    if (!userInput) {
      setError("신호가 비어 있습니다.");
      return;
    }

    setError("");
    setLog(null);
    setPhase("transmitting");
    const decodingTimer = window.setTimeout(() => {
      setPhase((current) => current === "transmitting" ? "decoding" : current);
    }, 350);

    try {
      await generateWithAI(userInput);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "신호 해석에 실패했습니다.");
      setPhase("degraded");
    } finally {
      window.clearTimeout(decodingTimer);
    }
  }

  return (
    <main className="station-shell">
      <div className="noise" aria-hidden="true" />
      <div className="equipment-frame">
        <header className="masthead">
          <div className="equipment-plate" aria-label="Shipwreck, Midnight Coastal Radio Station, model RX-01">
            <strong>SHIPWRECK</strong>
            <span>MIDNIGHT COASTAL RADIO STATION</span>
            <small>MODEL / RX-01</small>
          </div>
          <div className="equipment-indicators" aria-hidden="true">
            <span className="equipment-indicator is-on">POWER</span>
            <span className={`equipment-indicator ${loading ? "is-on" : ""}`}>TX</span>
            <span className={`equipment-indicator is-on ${phase === "received" || phase === "degraded" ? "is-received" : ""}`}>RX</span>
          </div>
          <p className="frequency">FREQ. 27.185 MHz</p>
        </header>

        <div className="station">
          <section className="receiver-panel" aria-labelledby="station-title">
            <div className="receiver-header">
              <span>RADAR / RX</span>
              <span>CHANNEL 01 · OPEN</span>
            </div>
            <div className="intro">
              <h1 id="station-title">심야 해안 통신소</h1>
              <p className="description"><span>오늘의 신호를 남겨주세요.</span><span>닿지 못해도, 기록은 남습니다.</span></p>
            </div>
            <Radar receiverStatus={receiverStatus} onSweep={playSweepPip} onSignalDetected={playSignalBeep} />
          </section>

          <section className="transmission-panel" aria-label="통신 입력 및 기록">
            <div className="input-panel" data-phase={phase}>
              <div className="panel-heading"><span>TRANSMISSION / TX</span><span>CHANNEL 01</span></div>
              <SignalInput value={value} onValueChange={updateValue} onGenerate={submitSignal} loading={loading} error={error} />
            </div>
            <RadioLogCard log={log} phase={phase} audioEnabled={audioEnabled} onToggleAudio={toggleAudio} volumeLevel={volumeLevel} onVolumeChange={changeVolumeLevel} />
          </section>
        </div>

        <footer className="station-footer">
          <p>COASTAL OBSERVATION POST · 33°27′N 126°33′E</p>
          <p><span className="status-dot" />RECEIVER ONLINE</p>
        </footer>
      </div>
    </main>
  );
}
