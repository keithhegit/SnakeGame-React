import * as React from 'react'
import type { Game } from 'phaser'
import dynamic from 'next/dynamic'

// 动态导入 Phaser，避免 SSR 问题
const PhaserGame = dynamic(
  () => import('@/game/PhaserGame').then(mod => mod.PhaserGame),
  { ssr: false }
)

export default function GamePage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900 touch-none">
      <PhaserGame />
    </div>
  )
} 