interface PhotoStripProps {
  photos: { thumbnailUrl: string }[]
  onRemove?: (index: number) => void
}

export function PhotoStrip({ photos, onRemove }: PhotoStripProps) {
  if (photos.length === 0) return null

  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      padding: '0.5rem',
      overflowX: 'auto',
      background: '#111',
    }}>
      {photos.map((photo, index) => (
        <div key={photo.thumbnailUrl} style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={photo.thumbnailUrl}
            alt={`Capture ${index + 1}`}
            style={{ height: '4rem', borderRadius: '4px' }}
          />
          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              style={{
                position: 'absolute',
                top: '-0.25rem',
                right: '-0.25rem',
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: '50%',
                border: 'none',
                background: '#e00',
                color: 'white',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={`Remove photo ${index + 1}`}
            >
              x
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
