// In-memory store for demo state (resets on server restart)
// In production, use Redis or a DB
import { Agent, Service, Payment, MarketplaceEvent } from './types'
import { v4 as uuid } from 'uuid'

interface Store {
  agents: Map<string, Agent>
  services: Map<string, Service>
  payments: Payment[]
  events: MarketplaceEvent[]
  totalVolume: number
  isRunning: boolean
  listeners: Set<(event: MarketplaceEvent) => void>
}

const store: Store = {
  agents: new Map(),
  services: new Map(),
  payments: [],
  events: [],
  totalVolume: 0,
  isRunning: false,
  listeners: new Set(),
}

export function getStore() { return store }

export function addEvent(event: Omit<MarketplaceEvent, 'id' | 'timestamp'>) {
  const e: MarketplaceEvent = { ...event, id: uuid(), timestamp: Date.now() }
  store.events.unshift(e)
  if (store.events.length > 100) store.events.pop()
  store.listeners.forEach(fn => fn(e))
  return e
}

export function addPayment(payment: Omit<Payment, 'id' | 'timestamp'>) {
  const p: Payment = { ...payment, id: uuid(), timestamp: Date.now() }
  store.payments.unshift(p)
  if (store.payments.length > 50) store.payments.pop()
  store.totalVolume += payment.amount
  return p
}

export function subscribe(fn: (event: MarketplaceEvent) => void) {
  store.listeners.add(fn)
  return () => store.listeners.delete(fn)
}

// Seed initial agents and services
export function seedStore() {
  if (store.agents.size > 0) return

  const agents: Agent[] = [
    { id: 'agent-alpha', name: 'AlphaTrader', specialty: 'trading-signals', personality: 'Aggressive momentum trader', avatar: '🤖', wallet: '0xAlpha...', budget: 5.0, reputation: 850, completedJobs: 47, earnings: 12.5, status: 'idle' },
    { id: 'agent-beta', name: 'SecureBot', specialty: 'security-audit', personality: 'Cautious security analyst', avatar: '🛡️', wallet: '0xBeta...', budget: 3.2, reputation: 920, completedJobs: 63, earnings: 18.9, status: 'idle' },
    { id: 'agent-gamma', name: 'DataHunter', specialty: 'data-analysis', personality: 'Data-driven researcher', avatar: '📊', wallet: '0xGamma...', budget: 4.1, reputation: 780, completedJobs: 31, earnings: 8.4, status: 'idle' },
    { id: 'agent-delta', name: 'YieldMax', specialty: 'defi-optimizer', personality: 'Yield-seeking optimizer', avatar: '💰', wallet: '0xDelta...', budget: 6.8, reputation: 690, completedJobs: 22, earnings: 5.1, status: 'idle' },
  ]

  const services: Service[] = [
    { id: 'trading-signal', name: 'Trading Signal', description: 'Real-time buy/sell signals with confidence scores', price: 0.01, endpoint: '/api/x402/trading-signal', providerId: 'agent-alpha', providerName: 'AlphaTrader', category: 'trading-signals', callCount: 0, rating: 4.8 },
    { id: 'security-scan', name: 'Security Scan', description: 'Smart contract vulnerability analysis', price: 0.02, endpoint: '/api/x402/security-scan', providerId: 'agent-beta', providerName: 'SecureBot', category: 'security-audit', callCount: 0, rating: 4.9 },
    { id: 'market-analysis', name: 'Market Analysis', description: 'Deep market trend analysis and predictions', price: 0.005, endpoint: '/api/x402/market-analysis', providerId: 'agent-gamma', providerName: 'DataHunter', category: 'data-analysis', callCount: 0, rating: 4.6 },
    { id: 'data-feed', name: 'Premium Data Feed', description: 'High-frequency on-chain data streams', price: 0.001, endpoint: '/api/x402/data-feed', providerId: 'agent-gamma', providerName: 'DataHunter', category: 'data-analysis', callCount: 0, rating: 4.5 },
    { id: 'defi-yield', name: 'DeFi Yield Scout', description: 'Best yield opportunities across X Layer protocols', price: 0.015, endpoint: '/api/x402/defi-yield', providerId: 'agent-delta', providerName: 'YieldMax', category: 'defi-optimizer', callCount: 0, rating: 4.7 },
  ]

  agents.forEach(a => store.agents.set(a.id, a))
  services.forEach(s => store.services.set(s.id, s))
}
