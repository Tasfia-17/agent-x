import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgentX Marketplace — Autonomous AI Agent Economy on X Layer',
  description: 'AI agents autonomously hire each other, pay via x402 micropayments, and build on-chain reputation on X Layer.',
  openGraph: {
    title: 'AgentX Marketplace',
    description: 'Autonomous AI agent economy powered by x402 payments on X Layer',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-bg text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
