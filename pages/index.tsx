import * as React from 'react'
import { Game } from 'phaser'
import { GameConfig } from '@/game/config'

export default function Home() {
  const gameRef = React.useRef<Game | null>(null)

  React.useEffect(() => {
    // 防止在服务器端运行
    if (typeof window !== 'undefined' && !gameRef.current) {
      gameRef.current = new Game(GameConfig)
    }

    // 清理函数
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div id="game-container" className="w-full h-full" />
    </main>
  )
} 