import { NextResponse } from 'next/server'
import { getStore, seedStore } from '@/lib/store'

export async function GET() {
  seedStore()
  const store = getStore()
  return NextResponse.json({
    agents: Array.from(store.agents.values()),
    totalAgents: store.agents.size,
  })
}
