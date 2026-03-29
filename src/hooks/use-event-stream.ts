'use client'
import { useEffect, useRef, useState } from 'react'
import { MarketplaceEvent } from '@/lib/types'

export function useEventStream() {
  const [events, setEvents] = useState<MarketplaceEvent[]>([])
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const es = new EventSource('/api/stream')
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const event: MarketplaceEvent = JSON.parse(e.data)
        setEvents(prev => [event, ...prev].slice(0, 50))
      } catch {}
    }

    return () => es.close()
  }, [])

  return events
}
