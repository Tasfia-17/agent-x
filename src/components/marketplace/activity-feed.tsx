'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { MarketplaceEvent } from '@/lib/types'
import { shortHash, timeAgo } from '@/lib/utils'

const eventIcons: Record<string, string> = {
  payment: '💸',
  hire: '🤝',
  complete: '✅',
  register: '🚀',
  offer: '📋',
}

const eventColors: Record<string, string> = {
  payment: 'border-l-cyan',
  hire: 'border-l-purple',
  complete: 'border-l-green',
  register: 'border-l-orange',
  offer: 'border-l-yellow-400',
}

export function ActivityFeed({ events }: { events: MarketplaceEvent[] }) {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
      <AnimatePresence initial={false}>
        {events.length === 0 && (
          <div className="text-center text-gray-600 py-8 text-sm">
            Start the marketplace to see live activity
          </div>
        )}
        {events.map(event => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`bg-surface border border-border border-l-2 ${eventColors[event.type] || 'border-l-gray-600'} rounded-lg px-3 py-2`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <span className="text-sm flex-shrink-0">{eventIcons[event.type]}</span>
                <span className="text-xs text-gray-300 leading-relaxed">{event.message}</span>
              </div>
              <span className="text-xs text-gray-600 flex-shrink-0 font-mono">
                {timeAgo(event.timestamp)}
              </span>
            </div>
            {event.txHash && (
              <div className="mt-1 ml-6">
                <a
                  href={`https://www.oklink.com/xlayer/tx/${event.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan/70 hover:text-cyan font-mono transition-colors"
                >
                  tx: {shortHash(event.txHash)} ↗
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
