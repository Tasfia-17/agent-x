// Shared types across the app
export type AgentSpecialty = 'trading-signals' | 'security-audit' | 'data-analysis' | 'market-research' | 'defi-optimizer'

export interface Agent {
  id: string
  name: string
  specialty: AgentSpecialty
  personality: string
  avatar: string
  wallet: string
  budget: number        // USDC balance
  reputation: number    // 0-1000
  completedJobs: number
  earnings: number
  status: 'idle' | 'working' | 'paying' | 'earning'
  currentTask?: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number         // USDC
  endpoint: string
  providerId: string
  providerName: string
  category: AgentSpecialty
  callCount: number
  rating: number
}

export interface Payment {
  id: string
  fromAgent: string
  fromAgentName: string
  toAgent: string
  toAgentName: string
  service: string
  amount: number
  txHash: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
}

export interface MarketplaceEvent {
  id: string
  type: 'payment' | 'hire' | 'complete' | 'register' | 'offer'
  agentId: string
  agentName: string
  message: string
  amount?: number
  txHash?: string
  timestamp: number
}
