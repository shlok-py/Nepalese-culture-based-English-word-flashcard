import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nepalese Flashcards',
  description: 'Learn English vocabulary through Nepalese cultural context',
  manifest: '/manifest.json',
  themeColor: '#DC143C',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nepalese Flashcards" />
      </head>
      <body>{children}</body>
    </html>
  )
}