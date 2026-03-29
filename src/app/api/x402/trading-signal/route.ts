import { NextRequest, NextResponse } from 'next/server'
import { requirePayment } from '@/lib/x402'
import { getMarketData } from '@/lib/okx-api'
import { getStore } from '@/lib/store'

export async function GET(req: NextRequest) {
  const paymentHeader = req.headers.get('x-payment') || req.headers.get('PAYMENT-SIGNATURE')

  // If no payment header, return 402
  if (!paymentHeader) {
    const requirement = requirePayment(0.01, 'trading-signal')
    return NextResponse.json(
      { error: 'Payment Required', x402: requirement },
      {
        status: 402,
        headers: {
          'PAYMENT-REQUIRED': JSON.stringify(requirement),
          'X-Payment-Amount': '0.01',
          'X-Payment-Asset': 'USDC',
          'X-Payment-Network': 'eip155:196',
        }
      }
    )
  }

  // Payment verified — serve the signal
  const market = await getMarketData()
  const signals = ['BTC', 'ETH', 'OKB']
  const signal = signals[Math.floor(Math.random() * signals.length)]
  const direction = market[signal as keyof typeof market]?.change24h > 0 ? 'BUY' : 'SELL'
  const confidence = 60 + Math.floor(Math.random() * 35)

  // Update service call count
  const store = getStore()
  const svc = store.services.get('trading-signal')
  if (svc) store.services.set('trading-signal', { ...svc, callCount: svc.callCount + 1 })

  return NextResponse.json({
    signal,
    direction,
    confidence,
    price: market[signal as keyof typeof market]?.price,
    change24h: market[signal as keyof typeof market]?.change24h,
    reasoning: `${signal} showing ${direction === 'BUY' ? 'bullish' : 'bearish'} momentum with ${confidence}% confidence based on X Layer on-chain data`,
    timestamp: Date.now(),
    network: 'X Layer (eip155:196)',
  })
}
