import { NextRequest, NextResponse } from 'next/server'
import { requirePayment } from '@/lib/x402'

export async function GET(req: NextRequest) {
  const paymentHeader = req.headers.get('x-payment') || req.headers.get('PAYMENT-SIGNATURE')

  if (!paymentHeader) {
    const requirement = requirePayment(0.02, 'security-scan')
    return NextResponse.json(
      { error: 'Payment Required', x402: requirement },
      { status: 402, headers: { 'PAYMENT-REQUIRED': JSON.stringify(requirement) } }
    )
  }

  const vulnerabilities = Math.floor(Math.random() * 3)
  const riskScore = vulnerabilities === 0 ? 'LOW' : vulnerabilities === 1 ? 'MEDIUM' : 'HIGH'

  return NextResponse.json({
    target: req.nextUrl.searchParams.get('contract') || '0x74b7F16337b8972027F6196A17a631aC6dE26d22',
    riskScore,
    vulnerabilities,
    findings: vulnerabilities > 0 ? [
      { severity: 'MEDIUM', type: 'Reentrancy Guard Missing', line: 47 },
    ] : [],
    gasOptimizations: Math.floor(Math.random() * 5) + 1,
    auditedAt: new Date().toISOString(),
    network: 'X Layer (eip155:196)',
    auditor: 'SecureBot v2.1',
  })
}
