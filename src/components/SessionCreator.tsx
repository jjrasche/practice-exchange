import { useState, useCallback } from 'react'
import { useCamera } from '../hooks/useCamera'
import { CameraViewfinder } from './CameraViewfinder'
import { PhotoNarrator } from './PhotoNarrator'
import { PhotoStrip } from './PhotoStrip'
import { Button } from './ui/button'
import type { SessionSlide, Tap } from '../types'

type SessionStep = 'camera' | 'narrate' | 'review'

const MIN_SLIDES = 3

interface SessionCreatorProps {
  onComplete: (slides: SessionSlide[]) => void
  onDiscard: () => void
}

export function SessionCreator({ onComplete, onDiscard }: SessionCreatorProps) {
  const [step, setStep] = useState<SessionStep>('camera')
  const [slides, setSlides] = useState<SessionSlide[]>([])
  const [pendingPhoto, setPendingPhoto] = useState<{ blob: Blob; thumbnailUrl: string } | null>(null)
  const camera = useCamera()

  async function handleShutterTap() {
    const photo = await camera.capturePhoto()
    if (!photo) return
    camera.stopCamera()
    setPendingPhoto(photo)
    setStep('narrate')
  }

  const handleNarrationComplete = useCallback((result: { narration: Blob; narrationDurationMs: number; taps: Tap[] }) => {
    if (!pendingPhoto) return
    const slide: SessionSlide = {
      photo: pendingPhoto.blob,
      thumbnailUrl: pendingPhoto.thumbnailUrl,
      narration: result.narration,
      narrationDurationMs: result.narrationDurationMs,
      taps: result.taps,
    }
    setSlides((previous) => [...previous, slide])
    setPendingPhoto(null)
    setStep('camera')
  }, [pendingPhoto])

  function proceedToReview() {
    camera.stopCamera()
    setStep('review')
  }

  function discardSession() {
    camera.stopCamera()
    slides.forEach((slide) => URL.revokeObjectURL(slide.thumbnailUrl))
    if (pendingPhoto) URL.revokeObjectURL(pendingPhoto.thumbnailUrl)
    onDiscard()
  }

  if (step === 'narrate' && pendingPhoto) {
    return (
      <PhotoNarrator
        photoUrl={pendingPhoto.thumbnailUrl}
        slideNumber={slides.length + 1}
        onComplete={handleNarrationComplete}
      />
    )
  }

  if (step === 'review') {
    return (
      <div className="min-h-svh">
        <h2 className="p-4 m-0 text-lg font-semibold">Review your session</h2>
        <PhotoStrip photos={slides} />
        <p className="p-4 text-muted-foreground text-sm">
          {slides.length} slides. Each has a photo, your narration, and any points you highlighted.
          This will be processed into a standardized session.
          Approve or discard — no editing.
        </p>
        <div className="px-4 flex gap-3">
          <Button onClick={() => onComplete(slides)}>
            Approve
          </Button>
          <Button variant="destructive" onClick={discardSession}>
            Discard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      {camera.isCameraActive ? (
        <>
          <CameraViewfinder
            videoRef={camera.videoRef}
            onCapture={handleShutterTap}
            photoCount={slides.length}
          />
          {slides.length >= MIN_SLIDES && (
            <div className="py-3 text-center">
              <Button variant="outline" onClick={proceedToReview}>
                Done — review session
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="p-8 text-center">
          <h2 className="mb-2 text-lg font-semibold">
            {slides.length === 0 ? 'Log a session' : 'Next photo'}
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            {slides.length === 0
              ? 'Capture moments from your practice. You\'ll narrate each one.'
              : `${slides.length} slide${slides.length !== 1 ? 's' : ''} so far. Take another or review.`
            }
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={camera.startCamera}>
              Open camera
            </Button>
            {camera.error && (
              <p className="text-destructive mt-4 text-sm">
                {camera.error}
              </p>
            )}
            {slides.length >= MIN_SLIDES && (
              <Button variant="outline" onClick={proceedToReview}>
                Review session
              </Button>
            )}
          </div>
        </div>
      )}

      {slides.length > 0 && step === 'camera' && (
        <PhotoStrip photos={slides} />
      )}
    </div>
  )
}
