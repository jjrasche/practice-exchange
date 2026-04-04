import { useRef, useState, useCallback } from 'react'
import type { Tap } from '../types'

interface UseAudioRecorderResult {
  isRecording: boolean
  audioBlob: Blob | null
  recordingDurationMs: number
  taps: Tap[]
  startRecording: () => Promise<void>
  stopRecording: () => void
  recordTap: (x: number, y: number) => void
  reset: () => void
}

export function useAudioRecorder(): UseAudioRecorderResult {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)
  const tapsRef = useRef<Tap[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recordingDurationMs, setRecordingDurationMs] = useState(0)
  const [taps, setTaps] = useState<Tap[]>([])

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []
    tapsRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' })
      setAudioBlob(blob)
      setRecordingDurationMs(Date.now() - startTimeRef.current)
      setTaps([...tapsRef.current])
      stream.getTracks().forEach((track) => track.stop())
    }

    startTimeRef.current = Date.now()
    mediaRecorder.start(1000)
    setIsRecording(true)
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
  }, [])

  const recordTap = useCallback((x: number, y: number) => {
    if (startTimeRef.current === 0) return
    tapsRef.current.push({ x, y, timestampMs: Date.now() - startTimeRef.current })
  }, [])

  const reset = useCallback(() => {
    setAudioBlob(null)
    setRecordingDurationMs(0)
    setTaps([])
    chunksRef.current = []
    tapsRef.current = []
  }, [])

  return {
    isRecording,
    audioBlob,
    recordingDurationMs,
    taps,
    startRecording,
    stopRecording,
    recordTap,
    reset,
  }
}
