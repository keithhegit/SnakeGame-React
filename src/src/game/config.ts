import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import DifficultyScene from './scenes/DifficultyScene'
import ReadyScene from './scenes/ReadyScene'
import MainScene from './scenes/MainScene'
import GameOverScene from './scenes/GameOverScene'
import LeaderboardScene from './scenes/LeaderboardScene'
import TutorialScene from './scenes/TutorialScene'
import SettingsScene from './scenes/SettingsScene'
import StatsScene from './scenes/StatsScene'

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 680,
    height: 680,
    min: {
      width: 320,
      height: 320
    },
    max: {
      width: 1024,
      height: 1024
    }
  },
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: process.env.NODE_ENV === 'development'
    }
  },
  scene: [
    BootScene,
    TutorialScene,
    DifficultyScene,
    ReadyScene,
    MainScene,
    GameOverScene,
    LeaderboardScene,
    SettingsScene,
    StatsScene
  ]
} as const 