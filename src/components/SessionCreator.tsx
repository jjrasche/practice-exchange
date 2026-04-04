import { useState, useCallback } from 'react'
import { useCamera } from '../hooks/useCamera'
import { CameraViewfinder } from './CameraViewfinder'
import { PhotoNarrator } from './PhotoNarrator'
import { PhotoStrip } from './PhotoStrip'
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
      <div style={{ background: '#000', minHeight: '100vh', color: 'white' }}>
        <h2 style={{ padding: '1rem', margin: 0 }}>Review your session</h2>
        <PhotoStrip photos={slides} />
        <p style={{ padding: '1rem', color: '#aaa' }}>
          {slides.length} slides. Each has a photo, your narration, and any points you highlighted.
          This will be processed into a standardized session.
          Approve or discard — no editing.
        </p>
        <div style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
          <button onClick={() => onComplete(slides)} style={approveButtonStyle}>
            Approve
          </button>
          <button onClick={discardSession} style={discardButtonStyle}>
            Discard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: 'white' }}>
      {camera.isCameraActive ? (
        <>
          <CameraViewfinder
            videoRef={camera.videoRef}
            onCapture={handleShutterTap}
            photoCount={slides.length}
          />
          {slides.length >= MIN_SLIDES && (
            <div style={{ padding: '0.75rem', textAlign: 'center' }}>
              <button onClick={proceedToReview} style={secondaryButtonStyle}>
                Done — review session
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 0.5rem' }}>
            {slides.length === 0 ? 'Log a session' : 'Next photo'}
          </h2>
          <p style={{ color: '#aaa', margin: '0 0 1.5rem' }}>
            {slides.length === 0
              ? 'Capture moments from your practice. You\'ll narrate each one.'
              : `${slides.length} slide${slides.length !== 1 ? 's' : ''} so far. Take another or review.`
            }
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={camera.startCamera} style={approveButtonStyle}>
              Open camera
            </button>
            {camera.error && (
              <p style={{ color: '#e00', marginTop: '1rem', fontSize: '0.875rem' }}>
                {camera.error}
              </p>
            )}
            {slides.length >= MIN_SLIDES && (
              <button onClick={proceedToReview} style={secondaryButtonStyle}>
                Review session
              </button>
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

const approveButtonStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  border: 'none',
  background: 'white',
  color: 'black',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
}

const secondaryButtonStyle: React.CSSProperties = {
  ...approveButtonStyle,
  background: 'transparent',
  color: 'white',
  border: '1px solid #444',
}

const discardButtonStyle: React.CSSProperties = {
  ...approveButtonStyle,
  background: 'transparent',
  color: '#e00',
  border: '1px solid #e00',
}
