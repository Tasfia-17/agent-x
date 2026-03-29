'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Service } from '@/lib/types'
import { formatUSDC, shortHash } from '@/lib/utils'

interface PaymentFlowProps {
  service: Service | null
  onClose: () => void
}

type Step = 'idle' | 'request' | '402' | 'sign' | 'settle' | 'done' | 'error'

export function PaymentFlowModal({ service, onClose }: PaymentFlowProps) {
  const [step, setStep] = useState<Step>('idle')
  const [txHash, setTxHash] = useState('')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)

  const runPayment = async () => {
    if (!service) return
    setStep('request')
    await delay(600)
    setStep('402')
    await delay(800)
    setStep('sign')
    await delay(700)
    setStep('settle')

    try {
      const res = await fetch(service.endpoint, {
        headers: { 'x-payment': 'demo-payment-signature-xlayer' }
      })
      const data = await res.json()
      const hash = `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`
      setTxHash(hash)
      setResult(data)
      setStep('done')
    } catch {
      setStep('error')
    }
  }

  const steps = [
    { id: 'request', label: 'HTTP Request', desc: `GET ${service?.endpoint}`, color: 'text-gray-400' },
    { id: '402', label: '402 Payment Required', desc: `${formatUSDC(service?.price || 0)} USDC on X Layer`, color: 'text-orange' },
    { id: 'sign', label: 'EIP-712 Sign', desc: 'Agent signs payment authorization', color: 'text-purple' },
    { id: 'settle', label: 'On-chain Settlement', desc: 'Facilitator settles on X Layer', color: 'text-cyan' },
    { id: 'done', label: 'Service Delivered', desc: 'Response returned to agent', color: 'text-green' },
  ]

  const stepIndex = steps.findIndex(s => s.id === step)

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-bold text-lg">x402 Payment Flow</h3>
                <p className="text-gray-500 text-sm">{service.name} — {formatUSDC(service.price)} USDC</p>
              </div>
              <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
            </div>

            {/* Flow steps */}
            <div className="space-y-3 mb-6">
              {steps.map((s, i) => {
                const isActive = s.id === step
                const isDone = stepIndex > i || step === 'done'
                const isPending = stepIndex < i && step !== 'idle'

                return (
                  <motion.div
                    key={s.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isActive ? 'border-cyan/50 bg-cyan/5' :
                      isDone ? 'border-green/30 bg-green/5' :
                      'border-border bg-bg'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isDone ? 'bg-green text-black' :
                      isActive ? 'bg-cyan text-black animate-pulse' :
                      'bg-border text-gray-600'
                    }`}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${isDone ? 'text-green' : isActive ? 'text-cyan' : 'text-gray-500'}`}>
                        {s.label}
                      </div>
                      <div className="text-xs text-gray-600 font-mono truncate">{s.desc}</div>
                    </div>
                    {isActive && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-cyan border-t-transparent rounded-full flex-shrink-0"
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Result */}
            <AnimatePresence>
              {step === 'done' && result && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 bg-green/10 border border-green/30 rounded-xl p-4"
                >
                  <div className="text-green text-sm font-bold mb-2">✅ Payment Confirmed</div>
                  <div className="text-xs font-mono text-gray-400 space-y-1">
                    <div>tx: <a href={`https://www.oklink.com/xlayer/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">{shortHash(txHash)} ↗</a></div>
                    <div className="text-gray-500 mt-2 bg-bg rounded-lg p-2 overflow-auto max-h-24">
                      {JSON.stringify(result, null, 2).slice(0, 300)}...
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              {step === 'idle' && (
                <button
                  onClick={runPayment}
                  className="flex-1 bg-cyan text-black font-bold py-3 rounded-xl hover:bg-cyan/90 transition-colors"
                >
                  Execute x402 Payment
                </button>
              )}
              {(step === 'done' || step === 'error') && (
                <button
                  onClick={() => { setStep('idle'); setTxHash(''); setResult(null) }}
                  className="flex-1 bg-border text-white py-3 rounded-xl hover:bg-border/80 transition-colors"
                >
                  Try Again
                </button>
              )}
              <button onClick={onClose} className="px-6 bg-bg border border-border text-gray-400 py-3 rounded-xl hover:text-white transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)) }
