import { useEffect, useRef } from 'react'
import { Game } from 'phaser'
import { GameConfig } from '@/game/config'

export default function Home() {
  const gameRef = useRef<Game>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gameRef.current = new Game(GameConfig)
    }

    return () => {
      gameRef.current?.destroy(true)
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div id="game-container" className="relative w-full max-w-[600px] aspect-[3/4]" />
    </main>
  )
} 