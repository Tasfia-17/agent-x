import { NextResponse } from 'next/server'
import { getStore, seedStore } from '@/lib/store'

export async function GET() {
  seedStore()
  const store = getStore()
  return NextResponse.json({
    services: Array.from(store.services.values()),
    payments: store.payments.slice(0, 20),
    totalVolume: store.totalVolume,
    isRunning: store.isRunning,
  })
}
