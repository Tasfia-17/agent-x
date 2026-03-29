'use client'
import { useEffect, useState, useCallback } from 'react'
import { Agent, Service, Payment } from '@/lib/types'

interface MarketState {
  agents: Agent[]
  services: Service[]
  payments: Payment[]
  totalVolume: number
  isRunning: boolean
  stats: { totalPayments: number; activeAgents: number; totalServices: number }
  market: Record<string, { price: number; change24h: number }>
}

export function useMarketplace() {
  const [state, setState] = useState<MarketState>({
    agents: [], services: [], payments: [], totalVolume: 0, isRunning: false,
    stats: { totalPayments: 0, activeAgents: 0, totalServices: 0 },
    market: {},
  })

  const refresh = useCallback(async () => {
    const [agentsRes, servicesRes, marketRes] = await Promise.all([
      fetch('/api/agents').then(r => r.json()).catch(() => ({ agents: [] })),
      fetch('/api/services').then(r => r.json()).catch(() => ({ services: [], payments: [], totalVolume: 0, isRunning: false })),
      fetch('/api/market').then(r => r.json()).catch(() => ({ market: {}, stats: {} })),
    ])
    setState({
      agents: agentsRes.agents || [],
      services: servicesRes.services || [],
      payments: servicesRes.payments || [],
      totalVolume: servicesRes.totalVolume || 0,
      isRunning: servicesRes.isRunning || false,
      stats: marketRes.stats || { totalPayments: 0, activeAgents: 0, totalServices: 0 },
      market: marketRes.market || {},
    })
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 3000)
    return () => clearInterval(interval)
  }, [refresh])

  const start = async () => {
    await fetch('/api/hire', { method: 'POST', body: JSON.stringify({ action: 'start' }), headers: { 'Content-Type': 'application/json' } })
    refresh()
  }

  const stop = async () => {
    await fetch('/api/hire', { method: 'POST', body: JSON.stringify({ action: 'stop' }), headers: { 'Content-Type': 'application/json' } })
    refresh()
  }

  const reset = async () => {
    await fetch('/api/hire', { method: 'POST', body: JSON.stringify({ action: 'reset' }), headers: { 'Content-Type': 'application/json' } })
    refresh()
  }

  return { ...state, refresh, start, stop, reset }
}
