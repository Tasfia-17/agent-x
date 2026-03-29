import { NextResponse } from 'next/server'
import { getMarketData } from '@/lib/okx-api'
import { getStore } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [market, store] = await Promise.all([getMarketData(), Promise.resolve(getStore())])
  return NextResponse.json({
    market,
    stats: {
      totalVolume: store.totalVolume,
      totalPayments: store.payments.length,
      activeAgents: Array.from(store.agents.values()).filter(a => a.status !== 'idle').length,
      totalAgents: store.agents.size,
      totalServices: store.services.size,
      isRunning: store.isRunning,
    }
  })
}
