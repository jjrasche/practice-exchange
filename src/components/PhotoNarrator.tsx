import { useState, useCallback, useEffect, useRef } from 'react'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { Button } from './ui/button'
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
    <div className="min-h-svh">
      <div className="py-3 px-4 flex justify-between items-center">
        <span className="text-muted-foreground text-sm">
          Photo {slideNumber}
        </span>
        {audio.isRecording && (
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-destructive animate-[pulse_1s_infinite]" />
            <span className="text-destructive text-sm">Recording</span>
          </div>
        )}
      </div>

      <div
        ref={imageRef}
        onPointerDown={handleImageTap}
        className="relative w-full touch-none"
      >
        <img
          src={photoUrl}
          alt={`Capture ${slideNumber}`}
          className="w-full block"
        />
        {tapRipples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute size-8 -ml-4 -mt-4 rounded-full border-2 border-white opacity-80 pointer-events-none animate-[tapRipple_0.8s_ease-out_forwards]"
            style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
          />
        ))}
      </div>

      <div className="p-4 text-center">
        {audio.isRecording ? (
          <>
            <p className="text-muted-foreground mb-3 text-sm">
              Tap the photo to point at things while you talk
            </p>
            <Button onClick={finishNarration}>
              Done
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground mb-3 text-sm">
              What are you looking at here? What do you notice?
            </p>
            <Button onClick={audio.startRecording}>
              Start talking
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
