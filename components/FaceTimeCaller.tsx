'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { normalizePhoneNumber, isValidPhoneNumber, buildFaceTimeUrl } from '@/lib/phoneUtils'

type Phase = 'input' | 'calling' | 'called' | 'safe'

function SafeScreen({ onExit }: { onExit: () => void }) {
  useEffect(() => {
    const handler = () => onExit()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onExit])

  return (
    <div
      className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={onExit}
      role="button"
      aria-label="Avsluta säker skärm"
    >
      <div className="text-center space-y-6">
        <p className="text-neutral-600 text-sm tracking-widest uppercase font-medium">
          FaceTime Callout
        </p>
        <p className="text-emerald-500 text-6xl font-light tracking-tight">
          Redo
        </p>
      </div>
      <p className="absolute bottom-8 text-neutral-700 text-xs tracking-wide">
        Tryck valfri tangent för att fortsätta
      </p>
    </div>
  )
}

export default function FaceTimeCaller() {
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState<Phase>('input')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const normalized = normalizePhoneNumber(input)
  const valid = isValidPhoneNumber(normalized)

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const initiateCall = useCallback(() => {
    if (!valid) return
    clearTimers()

    const a = document.createElement('a')
    a.href = buildFaceTimeUrl(normalized)
    a.click()

    setPhase('calling')

    const t1 = setTimeout(() => setPhase('called'), 1500)
    const t2 = setTimeout(() => {
      setInput('')
      setPhase('input')
      setTimeout(() => inputRef.current?.focus(), 50)
    }, 6000)

    timers.current = [t1, t2]
  }, [valid, normalized])

  const handleClear = useCallback(() => {
    clearTimers()
    setInput('')
    setPhase('input')
    inputRef.current?.focus()
  }, [])

  const handleSafeScreen = useCallback(() => {
    clearTimers()
    setInput('')
    setPhase('safe')
  }, [])

  const handleExitSafe = useCallback(() => {
    setPhase('input')
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const handleCopy = useCallback(async () => {
    if (!valid) return
    try {
      await navigator.clipboard.writeText(normalized)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable
    }
  }, [valid, normalized])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase === 'safe') return
      if (e.key === 'Escape') {
        handleSafeScreen()
        return
      }
      if (e.key === 'Enter' && valid && phase === 'input') {
        initiateCall()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase, valid, initiateCall, handleSafeScreen])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => () => clearTimers(), [])

  if (phase === 'safe') {
    return <SafeScreen onExit={handleExitSafe} />
  }

  const inputStatus: 'empty' | 'valid' | 'invalid' =
    !input.trim() ? 'empty' : valid ? 'valid' : 'invalid'

  const statusMessage =
    phase === 'calling'
      ? 'Öppnar FaceTime…'
      : phase === 'called'
        ? 'Redo för nästa uppringning'
        : inputStatus === 'valid'
          ? 'Nummer klart'
          : inputStatus === 'invalid'
            ? 'Kontrollera numret'
            : 'Ange nummer'

  const statusColor =
    phase === 'calling'
      ? 'text-blue-400'
      : phase === 'called'
        ? 'text-emerald-400'
        : inputStatus === 'valid'
          ? 'text-emerald-400'
          : inputStatus === 'invalid'
            ? 'text-amber-400'
            : 'text-neutral-500'

  const inputBorder =
    phase !== 'input'
      ? 'border-neutral-800'
      : inputStatus === 'invalid'
        ? 'border-amber-700 focus:border-amber-500'
        : inputStatus === 'valid'
          ? 'border-emerald-800 focus:border-emerald-600'
          : 'border-neutral-800 focus:border-neutral-600'

  const isCallable = valid && phase === 'input'
  const locked = phase === 'calling' || phase === 'called'

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <span className="text-neutral-400 text-sm tracking-widest uppercase font-medium select-none">
          FaceTime Callout
        </span>
        <button
          onClick={handleSafeScreen}
          className="text-neutral-500 text-sm px-3 py-1.5 rounded-lg hover:bg-neutral-800 hover:text-neutral-300 transition-colors"
        >
          Säker skärm
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-5">

          <input
            ref={inputRef}
            type="tel"
            value={input}
            onChange={e => {
              if (locked) return
              setInput(e.target.value)
            }}
            placeholder="070 123 45 67"
            disabled={locked}
            className={[
              'w-full bg-neutral-900 rounded-2xl px-6 py-5',
              'text-white text-4xl sm:text-5xl text-center font-light tracking-wide font-mono',
              'placeholder:text-neutral-700 placeholder:font-sans',
              'border-2 transition-colors duration-150 outline-none',
              locked ? 'opacity-40 cursor-not-allowed' : '',
              inputBorder,
            ].join(' ')}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="tel"
            aria-label="Telefonnummer"
          />

          <div className="text-center h-5">
            {valid && (
              <span className="text-neutral-500 text-sm font-mono">
                Ringer: <span className="text-neutral-300">{normalized}</span>
              </span>
            )}
          </div>

          <div className={`text-center text-base font-medium transition-colors duration-200 ${statusColor}`}>
            {statusMessage}
          </div>

          <button
            onClick={initiateCall}
            disabled={!isCallable}
            className={[
              'w-full h-20 rounded-2xl text-xl font-bold tracking-wide',
              'transition-all duration-150 select-none',
              isCallable
                ? 'bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white shadow-lg shadow-emerald-950/50 cursor-pointer'
                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed',
              phase === 'calling' ? 'animate-pulse' : '',
            ].join(' ')}
            aria-label="Ring med FaceTime"
          >
            {phase === 'calling' ? 'Öppnar FaceTime…' : 'Ring med FaceTime'}
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleClear}
              disabled={locked}
              className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Rensa
            </button>
            <button
              onClick={handleCopy}
              disabled={!valid}
              className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? 'Kopierat ✓' : 'Kopiera nummer'}
            </button>
          </div>

        </div>
      </main>

      <footer className="py-4 text-center">
        <span className="text-neutral-700 text-xs tracking-wide select-none">
          Enter: Ring&nbsp;&nbsp;·&nbsp;&nbsp;Escape: Säker skärm
        </span>
      </footer>
    </div>
  )
}
