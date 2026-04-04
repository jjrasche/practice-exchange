interface CameraViewfinderProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  onCapture: () => void
  photoCount: number
}

export function CameraViewfinder({ videoRef, onCapture, photoCount }: CameraViewfinderProps) {
  return (
    <div style={{ position: 'relative', width: '100%', background: '#000' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: '100%', display: 'block' }}
      />
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <button
          onClick={onCapture}
          style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            border: '3px solid white',
            background: 'rgba(255,255,255,0.3)',
            cursor: 'pointer',
          }}
          aria-label="Capture photo"
        />
        <span style={{ color: 'white', fontSize: '0.875rem' }}>
          {photoCount} photo{photoCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
