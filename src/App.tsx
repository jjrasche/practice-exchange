import { useState } from 'react'
import { SessionCreator } from './components/SessionCreator'
import { Button } from './components/ui/button'

type AppView = 'home' | 'create'

export function App() {
  const [view, setView] = useState<AppView>('home')

  if (view === 'create') {
    return (
      <SessionCreator
        onComplete={(slides) => {
          console.log('Session approved:', slides.length, 'slides')
          setView('home')
        }}
        onDiscard={() => setView('home')}
      />
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-normal mb-2">
        practice.exchange
      </h1>
      <p className="text-muted-foreground mb-8 text-center">
        Learn by doing. Your doing becomes content.
      </p>
      <Button size="lg" onClick={() => setView('create')}>
        Log a session
      </Button>
    </div>
  )
}
