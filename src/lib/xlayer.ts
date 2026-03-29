// X Layer chain config and viem client
import { createPublicClient, http, defineChain } from 'viem'

export const xlayer = defineChain({
  id: 196,
  name: 'X Layer Mainnet',
  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.xlayer.tech'] },
    public: { http: ['https://rpc.xlayer.tech'] },
  },
  blockExplorers: {
    default: { name: 'OKLink', url: 'https://www.oklink.com/xlayer' },
  },
})

export const publicClient = createPublicClient({
  chain: xlayer,
  transport: http(process.env.NEXT_PUBLIC_XLAYER_RPC || 'https://rpc.xlayer.tech'),
})

export const USDC_XLAYER = '0x74b7F16337b8972027F6196A17a631aC6dE26d22'
export const XLAYER_EXPLORER = 'https://www.oklink.com/xlayer/tx'
