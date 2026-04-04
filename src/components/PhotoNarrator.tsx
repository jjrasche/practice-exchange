import { useState, useCallback, useEffect, useRef } from 'react'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import type { Tap } from '../types'

interface NarrationResult {
  narration: Blob
  narrationDurationMs: number
  taps: Tap[]
}

interface PhotoNarratorProps {
  photoUrl: string
  slideNumber: number
  onComplete: (result: NarrationResult) => void
}

interface TapRipple {
  x: number
  y: number
  id: number
}

export function PhotoNarrator({ photoUrl, slideNumber, onComplete }: PhotoNarratorProps) {
  const audio = useAudioRecorder()
  const [tapRipples, setTapRipples] = useState<TapRipple[]>([])
  const [isFinishing, setIsFinishing] = useState(false)
  const rippleIdRef = useRef(0)
  const imageRef = useRef<HTMLDivElement | null>(null)

  const handleImageTap = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!audio.isRecording) return
    const rect = imageRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    audio.recordTap(x, y)

    const id = rippleIdRef.current++
    setTapRipples((previous) => [...previous, { x: x * 100, y: y * 100, id }])
    setTimeout(() => {
      setTapRipples((previous) => previous.filter((ripple) => ripple.id !== id))
    }, 800)
  }, [audio])

  useEffect(() => {
    if (isFinishing && audio.audioBlob) {
      onComplete({
        narration: audio.audioBlob,
        narrationDurationMs: audio.recordingDurationMs,
        taps: audio.taps,
      })
    }
  }, [isFinishing, audio.audioBlob, audio.recordingDurationMs, audio.taps, onComplete])

  function finishNarration() {
    audio.stopRecording()
    setIsFinishing(true)
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: 'white' }}>
      <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#aaa', fontSize: '0.875rem' }}>
          Photo {slideNumber}
        </span>
        {audio.isRecording && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '0.5rem', height: '0.5rem', borderRadius: '50%',
              background: '#e00', animation: 'pulse 1s infinite',
            }} />
            <span style={{ color: '#e00', fontSize: '0.875rem' }}>Recording</span>
          </div>
        )}
      </div>

      <div
        ref={imageRef}
        onPointerDown={handleImageTap}
        style={{ position: 'relative', width: '100%', touchAction: 'none' }}
      >
        <img
          src={photoUrl}
          alt={`Capture ${slideNumber}`}
          style={{ width: '100%', display: 'block' }}
        />
        {tapRipples.map((ripple) => (
          <div
            key={ripple.id}
            style={{
              position: 'absolute',
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              width: '2rem',
              height: '2rem',
              marginLeft: '-1rem',
              marginTop: '-1rem',
              borderRadius: '50%',
              border: '2px solid white',
              opacity: 0.8,
              pointerEvents: 'none',
              animation: 'tapRipple 0.8s ease-out forwards',
            }}
          />
        ))}
      </div>

      <div style={{ padding: '1rem', textAlign: 'center' }}>
        {audio.isRecording ? (
          <>
            <p style={{ color: '#aaa', margin: '0 0 0.75rem', fontSize: '0.875rem' }}>
              Tap the photo to point at things while you talk
            </p>
            <button onClick={finishNarration} style={primaryButtonStyle}>
              Done
            </button>
          </>
        ) : (
          <>
            <p style={{ color: '#aaa', margin: '0 0 0.75rem', fontSize: '0.875rem' }}>
              What are you looking at here? What do you notice?
            </p>
            <button onClick={audio.startRecording} style={primaryButtonStyle}>
              Start talking
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const primaryButtonStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  border: 'none',
  background: 'white',
  color: 'black',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
}
