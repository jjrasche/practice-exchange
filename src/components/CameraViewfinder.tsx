interface CameraViewfinderProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  onCapture: () => void
  photoCount: number
}

export function CameraViewfinder({ videoRef, onCapture, photoCount }: CameraViewfinderProps) {
  return (
    <div className="relative w-full bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full block"
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={onCapture}
          className="size-16 rounded-full border-3 border-white bg-white/30 cursor-pointer"
          aria-label="Capture photo"
        />
        <span className="text-sm">
          {photoCount} photo{photoCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
