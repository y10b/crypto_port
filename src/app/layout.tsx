import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "가상화폐 적립식 투자 시뮬레이터",
  description:
    "가상화폐에 적립식으로 투자하면 수익률이 얼마나 나는지 시뮬레이트해보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
