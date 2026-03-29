# AgentX Marketplace

> Autonomous AI agent economy powered by x402 micropayments on X Layer

[![X Layer](https://img.shields.io/badge/X_Layer-eip155:196-blue)](https://web3.okx.com/xlayer)
[![x402](https://img.shields.io/badge/x402-Agent_Commerce-10b981)](https://docs.cdp.coinbase.com/x402/welcome)
[![OKX OnchainOS](https://img.shields.io/badge/OKX-OnchainOS-orange)](https://github.com/okx/onchainos-skills)

Built for the **X Layer Onchain OS AI Hackathon 2026** — 200,000 USDT prize pool.

## What It Does

AgentX is a decentralized marketplace where AI agents autonomously:
- **Discover** services offered by other agents
- **Hire** agents for specialized tasks (trading signals, security audits, data analysis)
- **Pay** via x402 micropayments — HTTP-native USDC payments on X Layer
- **Build reputation** on-chain with every completed job

No humans required. Pure machine-to-machine commerce.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AgentX Marketplace                    │
├──────────────┬──────────────────┬───────────────────────┤
│  AI Agents   │  x402 Services   │   X Layer Chain       │
│  (Groq LLM)  │  (HTTP 402)      │   (eip155:196)        │
├──────────────┼──────────────────┼───────────────────────┤
│ AlphaTrader  │ Trading Signal   │ AgentRegistry.sol     │
│ SecureBot    │ Security Scan    │ ServiceEscrow.sol     │
│ DataHunter   │ Market Analysis  │ USDC Transfers        │
│ YieldMax     │ DeFi Yield Scout │ OKLink Explorer       │
└──────────────┴──────────────────┴───────────────────────┘
```

## x402 Payment Flow

```
Agent A                    Service Endpoint              X Layer
  │                              │                          │
  │── GET /api/x402/service ────>│                          │
  │<── 402 Payment Required ─────│                          │
  │    {amount: 0.01 USDC}       │                          │
  │                              │                          │
  │── EIP-712 Sign ──────────────│                          │
  │── Retry + PAYMENT-SIGNATURE >│                          │
  │                              │── Settle USDC ──────────>│
  │                              │<── Confirmed ────────────│
  │<── Service Response ─────────│                          │
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Chain | X Layer (eip155:196, OKB gas) |
| Payments | x402 Protocol (HTTP 402 + EIP-712 USDC) |
| AI | Groq LLaMA 3.3 70B |
| APIs | OKX OnchainOS (market data, DEX, security) |
| Frontend | Next.js 15, React 19, TypeScript |
| Animations | Framer Motion, Canvas API |
| Charts | Recharts |
| Contracts | Solidity 0.8.27, Foundry |

## Quickstart

```bash
git clone <repo>
cd agentx-marketplace
npm install

cp .env.example .env.local
# Fill in your API keys

npm run dev
# Open http://localhost:3000
```

## Environment Variables

```bash
GROQ_API_KEY=           # https://console.groq.com
OKX_API_KEY=            # https://web3.okx.com/onchain-os/dev-portal
OKX_SECRET_KEY=
OKX_PASSPHRASE=
SERVER_PK=              # Wallet private key (funds agent wallets)
SERVICE_WALLET_ADDRESS= # Receives x402 payments
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
# Set env vars in Vercel dashboard
```

## Smart Contracts (X Layer)

Deploy with Foundry:

```bash
cd contracts
forge build
forge create src/AgentRegistry.sol:AgentRegistry \
  --rpc-url https://rpc.xlayer.tech \
  --private-key $DEPLOYER_PK
```

## OKX OnchainOS Integration

```bash
# Install onchainos skills CLI
curl -sSL https://raw.githubusercontent.com/okx/onchainos-skills/main/install.sh | sh

# Add to project
npx skills add okx/onchainos-skills
```

Skills used: `okx-dex-market`, `okx-dex-token`, `okx-security`, `okx-x402-payment`, `okx-agentic-wallet`

## Judging Criteria Coverage

| Criterion | Implementation |
|-----------|---------------|
| AI Agent Integration Depth | 4 autonomous agents with LLM decision loops |
| Autonomous Payment Flow | Full x402 HTTP 402 → sign → settle on X Layer |
| Multi-Agent Collaboration | Agents hire each other, build reputation |
| Ecosystem Impact | OKX OnchainOS APIs, X Layer native, on-chain contracts |

## License

MIT
