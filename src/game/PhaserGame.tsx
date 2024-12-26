import * as React from 'react'
import Phaser from 'phaser'
import { GameConfig } from './config'

export function PhaserGame() {
  React.useEffect(() => {
    const game = new Phaser.Game(GameConfig)
    
    // 添加视口设置
    const meta = document.createElement('meta')
    meta.name = 'viewport'
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    document.head.appendChild(meta)
    
    return () => {
      game.destroy(true)
      document.head.removeChild(meta)
    }
  }, [])

  return (
    <div id="game-container" className="w-full max-w-3xl aspect-square rounded-lg overflow-hidden shadow-2xl" />
  )
} 