import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '잽스 커뮤니티',
  description: '혼자 고민하지 말고, 함께 이야기해요.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>
}
