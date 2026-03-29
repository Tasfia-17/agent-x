'use client'
import { motion } from 'framer-motion'

interface Stat {
  label: string
  value: string | number
  sub?: string
  color?: string
  pulse?: boolean
}

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface border border-border rounded-xl p-4 text-center relative overflow-hidden"
        >
          {stat.pulse && (
            <div className="absolute inset-0 bg-cyan/5 animate-pulse-slow" />
          )}
          <div className={`text-2xl font-bold font-mono ${stat.color || 'text-white'}`}>
            {stat.value}
          </div>
          <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          {stat.sub && <div className="text-xs text-gray-700 mt-0.5">{stat.sub}</div>}
        </motion.div>
      ))}
    </div>
  )
}
