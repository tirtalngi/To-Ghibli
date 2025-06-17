import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Convert Image to Ghilbi',
  description: 'Made by tirtalngi',
  generator: '-',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
