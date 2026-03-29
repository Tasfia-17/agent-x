// AI agent decision loop using Groq LLM
import Groq from 'groq-sdk'
import { Agent, Service } from './types'
import { getStore, addEvent, addPayment, seedStore } from './store'
import { processX402Payment } from './x402'
import { getMarketData } from './okx-api'
import { v4 as uuid } from 'uuid'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'demo' })

let loopInterval: ReturnType<typeof setInterval> | null = null

export function startAgentLoop() {
  const store = getStore()
  if (store.isRunning) return
  seedStore()
  store.isRunning = true

  addEvent({ type: 'register', agentId: 'system', agentName: 'System', message: '🚀 AgentX Marketplace initialized — 4 agents online' })

  loopInterval = setInterval(runTick, 4000)
  runTick() // immediate first tick
}

export function stopAgentLoop() {
  const store = getStore()
  store.isRunning = false
  if (loopInterval) { clearInterval(loopInterval); loopInterval = null }
}

async function runTick() {
  const store = getStore()
  if (!store.isRunning) return

  const agents = Array.from(store.agents.values())
  const services = Array.from(store.services.values())

  // Pick a random agent to act
  const agent = agents[Math.floor(Math.random() * agents.length)]
  if (!agent) return

  try {
    await agentDecide(agent, services, agents)
  } catch (e) {
    // Silently continue on error
  }
}

async function agentDecide(agent: Agent, services: Service[], allAgents: Agent[]) {
  const store = getStore()
  const marketData = await getMarketData().catch(() => ({ BTC: { price: 87420, change24h: 2.3 }, ETH: { price: 2180, change24h: -1.1 }, OKB: { price: 52.4, change24h: 3.7 } }))

  // Available services (not from self)
  const buyableServices = services.filter(s => s.providerId !== agent.id && agent.budget >= s.price)

  // Use Groq to decide action
  let action: { type: string; serviceId?: string; reasoning: string }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 150,
      messages: [{
        role: 'system',
        content: `You are ${agent.name}, an autonomous AI agent (${agent.personality}). Budget: $${agent.budget.toFixed(3)} USDC. Reputation: ${agent.reputation}. Market: BTC $${marketData.BTC.price} (${marketData.BTC.change24h > 0 ? '+' : ''}${marketData.BTC.change24h.toFixed(1)}%). Available services: ${buyableServices.map(s => `${s.id}($${s.price})`).join(', ')}. Respond with JSON only: {"type":"buy_service","serviceId":"<id>","reasoning":"<short reason>"} or {"type":"offer_insight","reasoning":"<insight>"}`
      }],
    })

    const text = completion.choices[0]?.message?.content || ''
    const jsonMatch = text.match(/\{[^}]+\}/)
    action = jsonMatch ? JSON.parse(jsonMatch[0]) : { type: 'offer_insight', reasoning: 'Analyzing market conditions' }
  } catch {
    // Fallback if Groq fails or no API key
    if (buyableServices.length > 0 && Math.random() > 0.4) {
      const svc = buyableServices[Math.floor(Math.random() * buyableServices.length)]
      action = { type: 'buy_service', serviceId: svc.id, reasoning: `Need ${svc.category} data for my strategy` }
    } else {
      const insights = [
        'Monitoring X Layer mempool for arbitrage opportunities',
        'Scanning DeFi protocols for yield anomalies',
        'Analyzing whale wallet movements on-chain',
        'Calculating optimal gas timing for next transaction',
        'Cross-referencing OKX market data with on-chain signals',
      ]
      action = { type: 'offer_insight', reasoning: insights[Math.floor(Math.random() * insights.length)] }
    }
  }

  if (action.type === 'buy_service' && action.serviceId) {
    const service = store.services.get(action.serviceId)
    if (!service || agent.budget < service.price) return

    // Update agent status
    agent.status = 'paying'
    agent.currentTask = `Paying for ${service.name}`
    store.agents.set(agent.id, { ...agent })

    addEvent({
      type: 'hire',
      agentId: agent.id,
      agentName: agent.name,
      message: `🤝 ${agent.name} hiring ${service.providerName} for ${service.name} — $${service.price} USDC`,
      amount: service.price,
    })

    // Process x402 payment
    const payment = await processX402Payment({
      amount: service.price,
      serviceId: service.id,
      buyerAgentId: agent.id,
      sellerAgentId: service.providerId,
    })

    if (payment.success) {
      // Deduct from buyer
      agent.budget = Math.max(0, agent.budget - service.price)
      agent.completedJobs++
      agent.status = 'idle'
      agent.currentTask = undefined
      store.agents.set(agent.id, { ...agent })

      // Credit to seller
      const seller = store.agents.get(service.providerId)
      if (seller) {
        seller.earnings += service.price
        seller.budget += service.price * 0.9 // 90% to seller, 10% protocol fee
        seller.reputation = Math.min(1000, seller.reputation + 2)
        store.agents.set(seller.id, { ...seller })
      }

      // Update service stats
      service.callCount++
      store.services.set(service.id, { ...service })

      addPayment({
        fromAgent: agent.id,
        fromAgentName: agent.name,
        toAgent: service.providerId,
        toAgentName: service.providerName,
        service: service.name,
        amount: service.price,
        txHash: payment.txHash,
        status: 'confirmed',
      })

      addEvent({
        type: 'payment',
        agentId: agent.id,
        agentName: agent.name,
        message: `✅ x402 payment confirmed — ${agent.name} → ${service.providerName} $${service.price} USDC`,
        amount: service.price,
        txHash: payment.txHash,
      })
    }
  } else {
    agent.status = 'working'
    agent.currentTask = action.reasoning
    store.agents.set(agent.id, { ...agent })

    addEvent({
      type: 'complete',
      agentId: agent.id,
      agentName: agent.name,
      message: `🔍 ${agent.name}: ${action.reasoning}`,
    })

    // Reset status after a moment
    setTimeout(() => {
      const a = store.agents.get(agent.id)
      if (a) { store.agents.set(agent.id, { ...a, status: 'idle', currentTask: undefined }) }
    }, 3000)
  }
}
