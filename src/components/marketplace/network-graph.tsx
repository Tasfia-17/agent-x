'use client'
import { useEffect, useRef } from 'react'
import { Agent, Payment } from '@/lib/types'

interface NetworkGraphProps {
  agents: Agent[]
  payments: Payment[]
}

export function NetworkGraph({ agents, payments }: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  interface Particle {
    from: { x: number; y: number }
    to: { x: number; y: number }
    progress: number
    speed: number
    color: string
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    if (agents.length === 0) return

    // Position agents in a circle
    const positions: Record<string, { x: number; y: number }> = {}
    agents.forEach((agent, i) => {
      const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2
      const r = Math.min(W, H) * 0.32
      positions[agent.id] = {
        x: W / 2 + Math.cos(angle) * r,
        y: H / 2 + Math.sin(angle) * r,
      }
    })

    // Add particles for recent payments
    payments.slice(0, 5).forEach(p => {
      const from = positions[p.fromAgent]
      const to = positions[p.toAgent]
      if (from && to && Math.random() > 0.7) {
        particlesRef.current.push({
          from, to,
          progress: Math.random(),
          speed: 0.005 + Math.random() * 0.01,
          color: '#00d4ff',
        })
      }
    })

    // Keep max 20 particles
    if (particlesRef.current.length > 20) {
      particlesRef.current = particlesRef.current.slice(-20)
    }

    const specialtyColors: Record<string, string> = {
      'trading-signals': '#00d4ff',
      'security-audit': '#10b981',
      'data-analysis': '#8b5cf6',
      'defi-optimizer': '#f59e0b',
      'market-research': '#ef4444',
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, W, H)

      // Draw connection lines
      agents.forEach((a, i) => {
        agents.forEach((b, j) => {
          if (i >= j) return
          const pa = positions[a.id]
          const pb = positions[b.id]
          if (!pa || !pb) return
          ctx.beginPath()
          ctx.moveTo(pa.x, pa.y)
          ctx.lineTo(pb.x, pb.y)
          ctx.strokeStyle = '#1e1e2e'
          ctx.lineWidth = 1
          ctx.stroke()
        })
      })

      // Draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.progress += p.speed
        if (p.progress > 1) return false
        const x = p.from.x + (p.to.x - p.from.x) * p.progress
        const y = p.from.y + (p.to.y - p.from.y) * p.progress
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0
        return true
      })

      // Spawn new particles occasionally
      if (Math.random() < 0.03 && agents.length >= 2) {
        const a = agents[Math.floor(Math.random() * agents.length)]
        const b = agents[Math.floor(Math.random() * agents.length)]
        if (a.id !== b.id && positions[a.id] && positions[b.id]) {
          particlesRef.current.push({
            from: positions[a.id],
            to: positions[b.id],
            progress: 0,
            speed: 0.008 + Math.random() * 0.012,
            color: specialtyColors[a.specialty] || '#00d4ff',
          })
        }
      }

      // Draw agent nodes
      agents.forEach(agent => {
        const pos = positions[agent.id]
        if (!pos) return
        const color = specialtyColors[agent.specialty] || '#00d4ff'
        const isActive = agent.status !== 'idle'

        // Glow
        if (isActive) {
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2)
          ctx.fillStyle = color + '22'
          ctx.fill()
        }

        // Node circle
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2)
        ctx.fillStyle = '#12121a'
        ctx.strokeStyle = color
        ctx.lineWidth = isActive ? 2.5 : 1.5
        ctx.fill()
        ctx.stroke()

        // Avatar emoji
        ctx.font = '16px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(agent.avatar, pos.x, pos.y)

        // Name label
        ctx.font = '10px monospace'
        ctx.fillStyle = '#9ca3af'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText(agent.name, pos.x, pos.y + 24)
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [agents, payments])

  return (
    <div className="relative bg-bg rounded-xl border border-border overflow-hidden" style={{ height: 280 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
      {agents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
          Start marketplace to see agent network
        </div>
      )}
      <div className="absolute top-3 left-3 text-xs text-gray-600 font-mono">Agent Network</div>
    </div>
  )
}
