'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Agent } from '@/lib/types'
import { cn, formatUSDC } from '@/lib/utils'

const specialtyColors: Record<string, string> = {
  'trading-signals': 'text-cyan border-cyan/30 bg-cyan/10',
  'security-audit': 'text-green border-green/30 bg-green/10',
  'data-analysis': 'text-purple border-purple/30 bg-purple/10',
  'defi-optimizer': 'text-orange border-orange/30 bg-orange/10',
  'market-research': 'text-red border-red/30 bg-red/10',
}

const statusColors: Record<string, string> = {
  idle: 'bg-gray-500',
  working: 'bg-yellow-400',
  paying: 'bg-cyan animate-pulse',
  earning: 'bg-green animate-pulse',
}

export function AgentCard({ agent }: { agent: Agent }) {
  const color = specialtyColors[agent.specialty] || 'text-gray-400 border-gray-700 bg-gray-900'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-surface border border-border rounded-xl p-4 overflow-hidden group hover:border-cyan/30 transition-colors"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{agent.avatar}</div>
          <div>
            <div className="font-bold text-white text-sm">{agent.name}</div>
            <div className={cn('text-xs px-2 py-0.5 rounded-full border mt-1 inline-block', color)}>
              {agent.specialty.replace('-', ' ')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={cn('w-2 h-2 rounded-full', statusColors[agent.status])} />
          <span className="text-xs text-gray-500 capitalize">{agent.status}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Stat label="Budget" value={formatUSDC(agent.budget)} color="text-cyan" />
        <Stat label="Rep" value={agent.reputation.toString()} color="text-purple" />
        <Stat label="Jobs" value={agent.completedJobs.toString()} color="text-green" />
      </div>

      {/* Reputation bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Reputation</span>
          <span>{agent.reputation}/1000</span>
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple to-cyan rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(agent.reputation / 1000) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Current task */}
      <AnimatePresence>
        {agent.currentTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-gray-400 bg-border/50 rounded-lg px-3 py-2 font-mono truncate"
          >
            ⚡ {agent.currentTask}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Earnings */}
      <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs">
        <span className="text-gray-500">Total Earned</span>
        <span className="text-green font-mono">{formatUSDC(agent.earnings)}</span>
      </div>
    </motion.div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-bg rounded-lg p-2 text-center">
      <div className={cn('font-mono font-bold text-sm', color)}>{value}</div>
      <div className="text-xs text-gray-600 mt-0.5">{label}</div>
    </div>
  )
}
