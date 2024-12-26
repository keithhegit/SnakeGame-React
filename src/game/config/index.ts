import { Types } from 'phaser'
import BootScene from '../scenes/BootScene'
import DifficultyScene from '../scenes/DifficultyScene'
import MainScene from '../scenes/MainScene'
import GameOverScene from '../scenes/GameOverScene'

export const GameConfig: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#87CEEB',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 680,
    height: 680
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: process.env.NODE_ENV === 'development'
    }
  },
  scene: [
    BootScene,
    DifficultyScene,
    MainScene,
    GameOverScene
  ]
} 