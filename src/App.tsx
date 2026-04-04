import { useState } from 'react'
import { SessionCreator } from './components/SessionCreator'

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
    <div style={{
      background: '#000',
      minHeight: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 400, margin: '0 0 0.5rem' }}>
        practice.exchange
      </h1>
      <p style={{ color: '#666', margin: '0 0 2rem', textAlign: 'center' }}>
        Learn by doing. Your doing becomes content.
      </p>
      <button
        onClick={() => setView('create')}
        style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          border: 'none',
          background: 'white',
          color: 'black',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer',
        }}
      >
        Log a session
      </button>
    </div>
  )
}
