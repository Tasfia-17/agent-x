// Agent wallet management - HD wallet derivation per agent
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts'
import { createWalletClient, http } from 'viem'
import { xlayer } from './xlayer'

export interface AgentWallet {
  address: string
  privateKey: string
}

// In production, derive from SERVER_PK using index. For demo, generate deterministically.
const AGENT_SEEDS: Record<string, string> = {}

export function getAgentWallet(agentId: string): AgentWallet {
  if (!AGENT_SEEDS[agentId]) {
    // Deterministic seed based on agentId for demo consistency
    const seed = `0x${Buffer.from(agentId.padEnd(32, '0')).toString('hex').slice(0, 64)}`
    AGENT_SEEDS[agentId] = seed
  }
  const pk = AGENT_SEEDS[agentId] as `0x${string}`
  const account = privateKeyToAccount(pk)
  return { address: account.address, privateKey: pk }
}

export function getWalletClient(agentId: string) {
  const { privateKey } = getAgentWallet(agentId)
  const account = privateKeyToAccount(privateKey as `0x${string}`)
  return createWalletClient({ account, chain: xlayer, transport: http() })
}
