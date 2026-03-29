// x402 payment simulation for X Layer
// Real x402 requires funded wallets; this simulates the full flow with mock tx hashes
import { v4 as uuid } from 'uuid'

export interface X402PaymentRequest {
  amount: number       // USDC
  serviceId: string
  buyerAgentId: string
  sellerAgentId: string
}

export interface X402PaymentResult {
  success: boolean
  txHash: string
  paymentHeader: string
  settlementTime: number
  error?: string
}

// Simulate x402 HTTP 402 → sign → settle flow
export async function processX402Payment(req: X402PaymentRequest): Promise<X402PaymentResult> {
  // Step 1: Simulate 402 response
  await delay(100)

  // Step 2: Simulate EIP-712 signing
  const paymentPayload = {
    scheme: 'exact',
    network: 'eip155:196',
    payload: {
      from: `0x${req.buyerAgentId.replace('agent-', '').padEnd(40, '0')}`,
      to: process.env.SERVICE_WALLET_ADDRESS || '0x0000000000000000000000000000000000000001',
      value: Math.floor(req.amount * 1e6).toString(),
      token: '0x74b7F16337b8972027F6196A17a631aC6dE26d22',
    }
  }
  await delay(150)

  // Step 3: Simulate facilitator verification + on-chain settlement
  const txHash = `0x${uuid().replace(/-/g, '')}${uuid().replace(/-/g, '').slice(0, 8)}`
  await delay(200)

  return {
    success: true,
    txHash,
    paymentHeader: Buffer.from(JSON.stringify(paymentPayload)).toString('base64'),
    settlementTime: 450,
  }
}

// x402 server-side: wrap a handler with payment requirement
export function requirePayment(amount: number, serviceId: string) {
  return {
    amount,
    asset: { address: '0x74b7F16337b8972027F6196A17a631aC6dE26d22', decimals: 6, eip712: true },
    payTo: process.env.SERVICE_WALLET_ADDRESS || '0x0000000000000000000000000000000000000001',
    network: 'eip155:196',
    resource: serviceId,
    description: `Payment for ${serviceId}`,
    mimeType: 'application/json',
    maxTimeoutSeconds: 300,
  }
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)) }
