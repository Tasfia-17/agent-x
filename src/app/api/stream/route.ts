import { NextRequest } from 'next/server'
import { subscribe, getStore, seedStore } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  seedStore()
  const store = getStore()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      // Send existing events first
      const recent = store.events.slice(0, 10).reverse()
      recent.forEach(event => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      })

      // Subscribe to new events
      const unsub = subscribe((event) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
        } catch {}
      })

      // Heartbeat every 15s
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`))
        } catch {
          clearInterval(heartbeat)
          unsub()
        }
      }, 15000)

      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        unsub()
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
