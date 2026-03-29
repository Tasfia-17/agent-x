'use client'
import { motion } from 'framer-motion'
import { Payment } from '@/lib/types'
import { shortHash, formatUSDC, timeAgo } from '@/lib/utils'

export function PaymentLedger({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8 text-sm">
        No payments yet — start the marketplace
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {payments.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className="bg-bg border border-border rounded-xl p-3 flex items-center gap-3"
        >
          <div className="text-lg">💸</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-white">
              <span className="text-cyan">{p.fromAgentName}</span>
              <span className="text-gray-600 mx-1">→</span>
              <span className="text-green">{p.toAgentName}</span>
            </div>
            <div className="text-xs text-gray-500 truncate">{p.service}</div>
            {p.txHash && (
              <a
                href={`https://www.oklink.com/xlayer/tx/${p.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan/60 hover:text-cyan font-mono"
              >
                {shortHash(p.txHash)} ↗
              </a>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-cyan font-mono font-bold text-sm">{formatUSDC(p.amount)}</div>
            <div className="text-xs text-gray-600">{timeAgo(p.timestamp)}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
