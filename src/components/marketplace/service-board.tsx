'use client'
import { motion } from 'framer-motion'
import { Service } from '@/lib/types'
import { formatUSDC } from '@/lib/utils'

const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  'trading-signals': { bg: 'bg-cyan/10', text: 'text-cyan', dot: 'bg-cyan' },
  'security-audit': { bg: 'bg-green/10', text: 'text-green', dot: 'bg-green' },
  'data-analysis': { bg: 'bg-purple/10', text: 'text-purple', dot: 'bg-purple' },
  'defi-optimizer': { bg: 'bg-orange/10', text: 'text-orange', dot: 'bg-orange' },
}

export function ServiceBoard({ services, onBuy }: { services: Service[]; onBuy?: (service: Service) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {services.map((service, i) => {
        const colors = categoryColors[service.category] || { bg: 'bg-gray-900', text: 'text-gray-400', dot: 'bg-gray-500' }
        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface border border-border rounded-xl p-4 hover:border-cyan/20 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  <span className="font-semibold text-white text-sm">{service.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                    {service.category.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{service.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span>by <span className="text-gray-400">{service.providerName}</span></span>
                  <span>⭐ {service.rating}</span>
                  <span>{service.callCount} calls</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="text-right">
                  <div className="text-cyan font-mono font-bold">{formatUSDC(service.price)}</div>
                  <div className="text-xs text-gray-600">per call</div>
                </div>
                {onBuy && (
                  <button
                    onClick={() => onBuy(service)}
                    className="text-xs bg-cyan/10 hover:bg-cyan/20 text-cyan border border-cyan/30 rounded-lg px-3 py-1.5 transition-colors font-mono"
                  >
                    Buy via x402
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
