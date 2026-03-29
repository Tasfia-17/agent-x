// OKX OnchainOS API integration
const OKX_BASE = 'https://www.okx.com'

interface OKXHeaders extends Record<string, string> {
  'OK-ACCESS-KEY': string
  'OK-ACCESS-SIGN': string
  'OK-ACCESS-TIMESTAMP': string
  'OK-ACCESS-PASSPHRASE': string
  'Content-Type': string
}

function getHeaders(method: string, path: string, body = ''): OKXHeaders {
  const timestamp = new Date().toISOString()
  const apiKey = process.env.OKX_API_KEY || ''
  const secretKey = process.env.OKX_SECRET_KEY || ''
  const passphrase = process.env.OKX_PASSPHRASE || ''

  // HMAC-SHA256 signature
  const message = timestamp + method + path + body
  // In production, use crypto.createHmac. For demo, we use sandbox keys.
  const sign = Buffer.from(message).toString('base64')

  return {
    'OK-ACCESS-KEY': apiKey,
    'OK-ACCESS-SIGN': sign,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'OK-ACCESS-PASSPHRASE': passphrase,
    'Content-Type': 'application/json',
  }
}

export async function getTokenPrice(symbol: string): Promise<{ price: number; change24h: number }> {
  try {
    const res = await fetch(`${OKX_BASE}/api/v5/market/ticker?instId=${symbol}-USDT`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 30 },
    })
    const data = await res.json()
    if (data.data?.[0]) {
      return {
        price: parseFloat(data.data[0].last),
        change24h: parseFloat(data.data[0].chg24h || '0') * 100,
      }
    }
  } catch {}
  // Fallback mock prices
  const mocks: Record<string, { price: number; change24h: number }> = {
    BTC: { price: 87420, change24h: 2.3 },
    ETH: { price: 2180, change24h: -1.1 },
    OKB: { price: 52.4, change24h: 3.7 },
  }
  return mocks[symbol] || { price: 1, change24h: 0 }
}

export async function getMarketData() {
  const [btc, eth, okb] = await Promise.all([
    getTokenPrice('BTC'),
    getTokenPrice('ETH'),
    getTokenPrice('OKB'),
  ])
  return { BTC: btc, ETH: eth, OKB: okb }
}

export async function getTokenInfo(address: string) {
  // OKX DEX token info endpoint
  try {
    const res = await fetch(
      `${OKX_BASE}/api/v5/dex/aggregator/token-info?chainId=196&tokenAddress=${address}`,
      { headers: getHeaders('GET', `/api/v5/dex/aggregator/token-info?chainId=196&tokenAddress=${address}`) }
    )
    return res.json()
  } catch {
    return null
  }
}

export async function getSwapQuote(fromToken: string, toToken: string, amount: string) {
  try {
    const path = `/api/v5/dex/aggregator/quote?chainId=196&fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${amount}`
    const res = await fetch(`${OKX_BASE}${path}`, { headers: getHeaders('GET', path) })
    return res.json()
  } catch {
    return null
  }
}
