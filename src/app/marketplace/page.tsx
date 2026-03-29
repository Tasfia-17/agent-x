'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useMarketplace } from '@/hooks/use-marketplace'
import { useEventStream } from '@/hooks/use-event-stream'
import { AgentCard } from '@/components/marketplace/agent-card'
import { ServiceBoard } from '@/components/marketplace/service-board'
import { ActivityFeed } from '@/components/marketplace/activity-feed'
import { PaymentLedger } from '@/components/marketplace/payment-ledger'
import { PaymentFlowModal } from '@/components/marketplace/payment-flow'
import { NetworkGraph } from '@/components/marketplace/network-graph'
import { VolumeChart } from '@/components/marketplace/volume-chart'
import { StatsBar } from '@/components/marketplace/stats-bar'
import { MarketTicker } from '@/components/marketplace/market-ticker'
import { Service } from '@/lib/types'
import { formatUSDC } from '@/lib/utils'

type Tab = 'overview' | 'agents' | 'services' | 'payments' | 'activity'

export default function MarketplacePage() {
  const { agents, services, payments, totalVolume, isRunning, stats, market, start, stop, reset } = useMarketplace()
  const events = useEventStream()
  const [tab, setTab] = useState<Tab>('overview')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = async () => {
    setIsStarting(true)
    await start()
    setIsStarting(false)
  }

  const statItems = [
    { label: 'Total Volume', value: formatUSDC(totalVolume), color: 'text-cyan', pulse: isRunning },
    { label: 'Payments', value: stats.totalPayments, color: 'text-green' },
    { label: 'Active Agents', value: `${stats.activeAgents}/${agents.length}`, color: 'text-purple' },
    { label: 'Services', value: stats.totalServices, color: 'text-orange' },
  ]

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'agents', label: 'Agents', count: agents.length },
    { id: 'services', label: 'Services', count: services.length },
    { id: 'payments', label: 'Payments', count: payments.length },
    { id: 'activity', label: 'Activity', count: events.length },
  ]

  return (
    <div className="min-h-screen bg-bg grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-bg/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-600 hover:text-white transition-colors text-sm">←</Link>
            <span className="text-white font-bold">AgentX</span>
            <span className="text-xs text-gray-600 border border-border rounded px-2 py-0.5">Marketplace</span>
            <div className={`flex items-center gap-1.5 text-xs ${isRunning ? 'text-green' : 'text-gray-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green animate-pulse' : 'bg-gray-600'}`} />
              {isRunning ? 'LIVE' : 'PAUSED'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={handleStart}
                disabled={isStarting}
                className="bg-cyan text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-cyan/90 transition-colors disabled:opacity-50"
              >
                {isStarting ? '...' : '▶ Start Demo'}
              </button>
            ) : (
              <button
                onClick={stop}
                className="bg-red/20 text-red border border-red/30 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red/30 transition-colors"
              >
                ⏸ Pause
              </button>
            )}
            <button
              onClick={reset}
              className="bg-surface border border-border text-gray-400 text-xs px-3 py-2 rounded-lg hover:text-white transition-colors"
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Market ticker */}
        <div className="max-w-7xl mx-auto px-4 pb-2">
          <MarketTicker market={market} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <StatsBar stats={statItems} />

        {/* Tabs */}
        <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                tab === t.id ? 'bg-cyan text-black font-bold' : 'text-gray-500 hover:text-white'
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${tab === t.id ? 'bg-black/20' : 'bg-border text-gray-400'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Network + Volume */}
            <div className="lg:col-span-2 space-y-4">
              <NetworkGraph agents={agents} payments={payments} />

              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-3 font-mono">Payment Volume (USDC)</div>
                <VolumeChart payments={payments} />
              </div>

              {/* x402 Protocol explainer */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <div className="text-xs text-gray-500 mb-4 font-mono">// x402 Payment Protocol</div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                  {[
                    { step: '1', label: 'Agent Request', desc: 'GET /api/service', color: 'border-gray-700' },
                    { step: '→', label: '', desc: '', color: '' },
                    { step: '2', label: '402 Response', desc: 'Payment Required', color: 'border-orange/50' },
                    { step: '→', label: '', desc: '', color: '' },
                    { step: '3', label: 'Sign + Retry', desc: 'EIP-712 USDC', color: 'border-purple/50' },
                  ].map((s, i) => s.step === '→' ? (
                    <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="text-center text-gray-600 hidden sm:block">→</motion.div>
                  ) : (
                    <div key={i} className={`border ${s.color} rounded-lg p-3 text-center bg-bg`}>
                      <div className="text-cyan font-bold text-sm">{s.step}</div>
                      <div className="text-xs text-white mt-1">{s.label}</div>
                      <div className="text-xs text-gray-600">{s.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center mt-2">
                  {[
                    { step: '5', label: 'Service Delivered', desc: 'Data returned', color: 'border-green/50' },
                    { step: '←', label: '', desc: '', color: '' },
                    { step: '4', label: 'X Layer Settle', desc: 'USDC on-chain', color: 'border-cyan/50' },
                    { step: '', label: '', desc: '', color: '' },
                    { step: '', label: '', desc: '', color: '' },
                  ].map((s, i) => s.step === '←' ? (
                    <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="text-center text-gray-600 hidden sm:block">←</motion.div>
                  ) : s.step ? (
                    <div key={i} className={`border ${s.color} rounded-lg p-3 text-center bg-bg`}>
                      <div className="text-cyan font-bold text-sm">{s.step}</div>
                      <div className="text-xs text-white mt-1">{s.label}</div>
                      <div className="text-xs text-gray-600">{s.desc}</div>
                    </div>
                  ) : <div key={i} />)}
                </div>
              </div>
            </div>

            {/* Right: Activity feed */}
            <div className="space-y-4">
              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-gray-500 font-mono">Live Activity</div>
                  {isRunning && <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />}
                </div>
                <ActivityFeed events={events} />
              </div>

              {/* Try it yourself */}
              <div className="bg-surface border border-cyan/20 rounded-xl p-4">
                <div className="text-xs text-cyan mb-3 font-mono">// Try x402 Payment</div>
                <p className="text-xs text-gray-500 mb-4">Manually trigger an x402 payment and watch the full flow on X Layer</p>
                <div className="space-y-2">
                  {services.slice(0, 3).map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className="w-full text-left bg-bg border border-border rounded-lg px-3 py-2 hover:border-cyan/30 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white">{s.name}</span>
                        <span className="text-xs text-cyan font-mono group-hover:text-white transition-colors">{formatUSDC(s.price)} →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'agents' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.length === 0 ? (
              <div className="col-span-4 text-center py-16 text-gray-600">
                <div className="text-4xl mb-4">🤖</div>
                <div>Start the marketplace to spawn agents</div>
              </div>
            ) : agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}

        {tab === 'services' && (
          <div className="max-w-2xl">
            <div className="text-xs text-gray-500 mb-4 font-mono">
              {services.length} services available — click "Buy via x402" to trigger a live payment
            </div>
            <ServiceBoard services={services} onBuy={setSelectedService} />
          </div>
        )}

        {tab === 'payments' && (
          <div className="max-w-2xl">
            <div className="text-xs text-gray-500 mb-4 font-mono">
              {payments.length} payments — all settled on X Layer via x402 protocol
            </div>
            <PaymentLedger payments={payments} />
          </div>
        )}

        {tab === 'activity' && (
          <div className="max-w-2xl">
            <ActivityFeed events={events} />
          </div>
        )}
      </div>

      {/* x402 Payment Modal */}
      <PaymentFlowModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  )
}
