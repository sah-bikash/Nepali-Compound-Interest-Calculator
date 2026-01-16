import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nepali Interest Calculator | नेपाली ब्याज गणना',
  description: 'Professional compound interest calculator for BS (Bikram Sambat) calendar. Calculate interest with bank-grade precision using Nepali banking methods.',
  keywords: 'nepali interest calculator, BS calendar, bikram sambat, compound interest, nepal, ब्याज गणना',
  authors: [{ name: 'Nepali Interest Calculator Team' }],
  openGraph: {
    title: 'Nepali Interest Calculator',
    description: 'Calculate compound interest using BS calendar and Nepali banking methods',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  )
}