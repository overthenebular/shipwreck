import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "심야 해안 통신소 | SHIPWRECK",
  description: "닿지 못한 마음을 한 줄의 심야 무선 통신 로그로 남기는 인터랙티브 아카이브.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
