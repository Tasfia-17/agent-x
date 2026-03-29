import { NextRequest, NextResponse } from 'next/server'
import { startAgentLoop, stopAgentLoop } from '@/lib/agent-loop'
import { getStore, seedStore, addEvent } from '@/lib/store'

export async function POST(req: NextRequest) {
  const { action } = await req.json()
  seedStore()

  if (action === 'start') {
    startAgentLoop()
    return NextResponse.json({ status: 'started' })
  }

  if (action === 'stop') {
    stopAgentLoop()
    return NextResponse.json({ status: 'stopped' })
  }

  if (action === 'reset') {
    stopAgentLoop()
    const store = getStore()
    store.agents.clear()
    store.services.clear()
    store.payments.length = 0
    store.events.length = 0
    store.totalVolume = 0
    store.isRunning = false
    seedStore()
    return NextResponse.json({ status: 'reset' })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function GET() {
  const store = getStore()
  return NextResponse.json({ isRunning: store.isRunning })
}
