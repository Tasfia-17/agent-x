'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Payment } from '@/lib/types'
import { useMemo } from 'react'

export function VolumeChart({ payments }: { payments: Payment[] }) {
  const data = useMemo(() => {
    if (payments.length === 0) return []
    // Group payments into buckets of 10 seconds
    const now = Date.now()
    const buckets: Record<number, number> = {}
    payments.forEach(p => {
      const bucket = Math.floor((now - p.timestamp) / 10000)
      buckets[bucket] = (buckets[bucket] || 0) + p.amount
    })
    return Object.entries(buckets)
      .sort(([a], [b]) => Number(b) - Number(a))
      .slice(0, 12)
      .reverse()
      .map(([bucket, volume], i) => ({
        time: `${(12 - i) * 10}s`,
        volume: parseFloat(volume.toFixed(4)),
      }))
  }, [payments])

  if (data.length < 2) {
    return (
      <div className="h-32 flex items-center justify-center text-gray-600 text-sm">
        Waiting for payment data...
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={130}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
        <XAxis dataKey="time" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          contentStyle={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#9ca3af' }}
          itemStyle={{ color: '#00d4ff' }}
          formatter={(v: number) => [`$${v.toFixed(4)} USDC`, 'Volume']}
        />
        <Line type="monotone" dataKey="volume" stroke="#00d4ff" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
