import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EV Charger',
  description: 'Dev',
  generator: 'Dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
