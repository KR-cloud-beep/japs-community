import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "잽스 | JAPS",
  description: "사람과 이야기를 연결하는 공간, 잽스.",
  metadataBase: new URL("https://zaps-app-free.vercel.app"),
  openGraph: {
    title: "잽스 | JAPS",
    description: "사람과 이야기를 연결하는 공간, 잽스.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
