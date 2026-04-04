export interface Tap {
  x: number
  y: number
  timestampMs: number
}

export interface SessionSlide {
  photo: Blob
  thumbnailUrl: string
  narration: Blob
  narrationDurationMs: number
  taps: Tap[]
}
