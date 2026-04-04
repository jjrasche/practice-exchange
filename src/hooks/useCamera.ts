import { useRef, useState, useCallback, useEffect } from 'react'

export interface CapturedPhoto {
  blob: Blob
  thumbnailUrl: string
}

interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement | null>
  isCameraActive: boolean
  isVideoReady: boolean
  error: string | null
  startCamera: () => Promise<void>
  stopCamera: () => void
  capturePhoto: () => Promise<CapturedPhoto | null>
}

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Attach stream to video element after React renders it
  useEffect(() => {
    const video = videoRef.current
    const stream = streamRef.current
    if (!video || !stream || !isCameraActive) return

    video.srcObject = stream
    video.onloadedmetadata = () => {
      video.play().then(() => setIsVideoReady(true))
    }
    // If metadata already loaded (e.g. re-render)
    if (video.readyState >= 1) {
      video.play().then(() => setIsVideoReady(true))
    }
  }, [isCameraActive])

  const startCamera = useCallback(async () => {
    setError(null)
    setIsVideoReady(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      setIsCameraActive(true)
    } catch (cameraError) {
      const message = cameraError instanceof DOMException
        ? cameraError.name === 'NotAllowedError' ? 'Camera permission denied'
          : cameraError.name === 'NotFoundError' ? 'No camera found'
          : 'Camera unavailable'
        : 'Camera unavailable'
      setError(message)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
    setIsVideoReady(false)
  }, [])

  const capturePhoto = useCallback((): Promise<CapturedPhoto | null> => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return Promise.resolve(null)

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) return Promise.resolve(null)

    context.drawImage(video, 0, 0)
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) { resolve(null); return }
        const thumbnailUrl = URL.createObjectURL(blob)
        resolve({ blob, thumbnailUrl })
      }, 'image/jpeg', 0.85)
    })
  }, [])

  return {
    videoRef,
    isCameraActive,
    isVideoReady,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
  }
}
