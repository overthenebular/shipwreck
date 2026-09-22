"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PIP_FREQUENCY_HZ = 420;
const PIP_DURATION_SECONDS = 0.045;
const SIGNAL_FREQUENCY_HZ = 760;
const SIGNAL_DURATION_SECONDS = 0.07;

export function useRadarAudio() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioEnabledRef = useRef(false);
  const audioStartingRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeOscillatorsRef = useRef<Set<OscillatorNode>>(new Set());

  const stopAudio = useCallback(() => {
    audioEnabledRef.current = false;
    const context = audioContextRef.current;
    const masterGain = masterGainRef.current;
    audioContextRef.current = null;
    masterGainRef.current = null;

    if (context && masterGain) {
      try { masterGain.gain.setValueAtTime(0, context.currentTime); } catch { /* Context is already unavailable. */ }
    }
    for (const oscillator of activeOscillatorsRef.current) {
      try { oscillator.stop(); } catch { /* Already stopped. */ }
    }
    activeOscillatorsRef.current.clear();
    if (context && context.state !== "closed") void context.close().catch(() => {});
  }, []);

  const playTone = useCallback((frequency: number, duration: number, peakGain: number) => {
    const context = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (!audioEnabledRef.current || !context || !masterGain || context.state !== "running") return;

    try {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      const now = context.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      envelope.gain.setValueAtTime(0.0001, now);
      envelope.gain.linearRampToValueAtTime(peakGain, now + 0.005);
      envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(envelope);
      envelope.connect(masterGain);
      oscillator.onended = () => {
        activeOscillatorsRef.current.delete(oscillator);
        oscillator.disconnect();
        envelope.disconnect();
      };
      activeOscillatorsRef.current.add(oscillator);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.005);
    } catch {
      stopAudio();
      setAudioEnabled(false);
    }
  }, [stopAudio]);

  async function toggleAudio() {
    if (audioStartingRef.current) return;
    if (audioEnabledRef.current) {
      stopAudio();
      setAudioEnabled(false);
      return;
    }

    audioStartingRef.current = true;
    try {
      const context = new AudioContext();
      audioContextRef.current = context;
      const masterGain = context.createGain();
      masterGain.gain.value = 0.16;
      masterGain.connect(context.destination);
      masterGainRef.current = masterGain;
      if (context.state === "suspended") await context.resume();
      if (context.state !== "running") throw new Error("AudioContext could not start");
      audioEnabledRef.current = true;
      setAudioEnabled(true);
    } catch {
      stopAudio();
      setAudioEnabled(false);
    } finally {
      audioStartingRef.current = false;
    }
  }

  useEffect(() => () => stopAudio(), [stopAudio]);

  const playSweepPip = useCallback(() => {
    playTone(PIP_FREQUENCY_HZ, PIP_DURATION_SECONDS, 0.06);
  }, [playTone]);

  const playSignalBeep = useCallback((weak: boolean) => {
    playTone(SIGNAL_FREQUENCY_HZ, SIGNAL_DURATION_SECONDS, weak ? 0.055 : 0.085);
  }, [playTone]);

  return { audioEnabled, toggleAudio, playSweepPip, playSignalBeep };
}
