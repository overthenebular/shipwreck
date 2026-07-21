"use client";

import { FormEvent, useState } from "react";

type SignalInputProps = { onGenerate: (value: string) => Promise<void> };

export function SignalInput({ onGenerate }: SignalInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim()) { setError("신호가 비어 있습니다."); return; }
    setError(""); setLoading(true);
    try {
      await onGenerate(value.trim());
      requestAnimationFrame(() => document.querySelector(".log-card")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (error) {
      setError(error instanceof Error ? error.message : "신호 해석에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="signal-form" onSubmit={submit}>
      <div className="field-heading"><label htmlFor="signal">TRANSMISSION INPUT</label><span>MAX 280</span></div>
      <textarea id="signal" value={value} maxLength={280} onChange={(e) => setValue(e.target.value)} placeholder="오늘의 감정이나 문장을 입력하세요." aria-describedby="signal-message" disabled={loading} />
      <div className="form-row">
        <p id="signal-message" className={error ? "form-message error" : "form-message"} aria-live="polite">{error || (loading ? "주파수를 맞추고 있습니다." : `${String(value.length).padStart(3, "0")} / 280`)}</p>
        <button type="submit" disabled={loading}><span aria-hidden="true">◉</span>{loading ? "신호 해석 중..." : "신호 보내기"}</button>
      </div>
    </form>
  );
}
