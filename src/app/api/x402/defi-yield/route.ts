import { NextRequest, NextResponse } from 'next/server'
import { requirePayment } from '@/lib/x402'

export async function GET(req: NextRequest) {
  const paymentHeader = req.headers.get('x-payment') || req.headers.get('PAYMENT-SIGNATURE')

  if (!paymentHeader) {
    const requirement = requirePayment(0.015, 'defi-yield')
    return NextResponse.json(
      { error: 'Payment Required', x402: requirement },
      { status: 402, headers: { 'PAYMENT-REQUIRED': JSON.stringify(requirement) } }
    )
  }

  return NextResponse.json({
    opportunities: [
      { protocol: 'Aave V3 (X Layer)', asset: 'USDC', apy: 8.4, tvl: '$12.3M', risk: 'LOW' },
      { protocol: 'PancakeSwap', asset: 'OKB/USDC LP', apy: 24.7, tvl: '$3.1M', risk: 'MEDIUM' },
      { protocol: 'Stargate', asset: 'USDT', apy: 6.2, tvl: '$8.7M', risk: 'LOW' },
    ],
    bestYield: { protocol: 'PancakeSwap', apy: 24.7 },
    totalXLayerTvl: '$142.3M',
    timestamp: Date.now(),
  })
}
