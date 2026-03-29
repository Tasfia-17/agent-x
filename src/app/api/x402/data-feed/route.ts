import { NextRequest, NextResponse } from 'next/server'
import { requirePayment } from '@/lib/x402'

export async function GET(req: NextRequest) {
  const paymentHeader = req.headers.get('x-payment') || req.headers.get('PAYMENT-SIGNATURE')

  if (!paymentHeader) {
    const requirement = requirePayment(0.001, 'data-feed')
    return NextResponse.json(
      { error: 'Payment Required', x402: requirement },
      { status: 402, headers: { 'PAYMENT-REQUIRED': JSON.stringify(requirement) } }
    )
  }

  return NextResponse.json({
    blockNumber: 8420000 + Math.floor(Math.random() * 10000),
    gasPrice: '0.0001 OKB',
    pendingTxs: Math.floor(Math.random() * 500) + 100,
    tps: (Math.random() * 50 + 10).toFixed(1),
    xlayerUptime: '99.97%',
    dataPoints: Array.from({ length: 5 }, (_, i) => ({
      timestamp: Date.now() - i * 1000,
      value: Math.random() * 100,
    })),
    network: 'X Layer (eip155:196)',
  })
}
