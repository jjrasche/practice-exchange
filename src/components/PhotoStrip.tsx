interface PhotoStripProps {
  photos: { thumbnailUrl: string }[]
  onRemove?: (index: number) => void
}

export function PhotoStrip({ photos, onRemove }: PhotoStripProps) {
  if (photos.length === 0) return null

  return (
    <div className="flex gap-2 p-2 overflow-x-auto bg-secondary">
      {photos.map((photo, index) => (
        <div key={photo.thumbnailUrl} className="relative shrink-0">
          <img
            src={photo.thumbnailUrl}
            alt={`Capture ${index + 1}`}
            className="h-16 rounded"
          />
          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="absolute -top-1 -right-1 size-5 rounded-full border-none bg-destructive text-white text-xs cursor-pointer flex items-center justify-center"
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
