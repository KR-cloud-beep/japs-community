import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "잽스 커뮤니티",
  description: "함께 이야기하고, 함께 성장하는 잽스 커뮤니티",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
