'use client'
import { motion } from 'framer-motion'

interface MarketTickerProps {
  market: Record<string, { price: number; change24h: number }>
}

export function MarketTicker({ market }: MarketTickerProps) {
  const tokens = Object.entries(market)
  if (tokens.length === 0) return null

  return (
    <div className="bg-surface border border-border rounded-xl px-4 py-2 flex items-center gap-6 overflow-x-auto">
      <span className="text-xs text-gray-600 flex-shrink-0 font-mono">LIVE</span>
      {tokens.map(([symbol, data]) => (
        <motion.div
          key={symbol}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <span className="text-xs text-gray-400 font-mono">{symbol}</span>
          <span className="text-sm font-bold text-white font-mono">
            ${data.price.toLocaleString()}
          </span>
          <span className={`text-xs font-mono ${data.change24h >= 0 ? 'text-green' : 'text-red'}`}>
            {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
          </span>
        </motion.div>
      ))}
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
        <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
        <span className="text-xs text-gray-600">X Layer</span>
      </div>
    </div>
  )
}
