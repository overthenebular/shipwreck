"use client";

import type { FormEvent } from "react";

type SignalInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  onGenerate: (value: string) => Promise<void>;
  loading: boolean;
  error: string;
};

export function SignalInput({ value, onValueChange, onGenerate, loading, error }: SignalInputProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!loading) void onGenerate(value.trim());
  }

  return (
    <form className="signal-form" onSubmit={submit}>
      <div className="field-heading"><label htmlFor="signal">TRANSMISSION INPUT</label><span>MAX 280</span></div>
      <textarea id="signal" value={value} maxLength={280} onChange={(e) => onValueChange(e.target.value)} placeholder="오늘의 감정이나 상태를 한 단어, 한 문장으로 입력하세요." aria-describedby="signal-message signal-count" disabled={loading} />
      <div className="form-row">
        <p id="signal-count" className="character-count">{String(value.length).padStart(3, "0")} / 280</p>
        <button type="submit" disabled={loading}><span aria-hidden="true">◉</span>{loading ? "신호 해석 중..." : "신호 보내기"}</button>
      </div>
      <p id="signal-message" className={error ? "form-message error" : "form-message"} aria-live="polite">{error || (loading ? "주파수를 맞추고 있습니다." : "\u00a0")}</p>
    </form>
  );
}
