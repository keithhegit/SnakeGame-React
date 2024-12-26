import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { Difficulty } from '../types/game'

export default class StatsScene extends Phaser.Scene {
  private gameStore: typeof useGameStore

  constructor() {
    super({ key: 'StatsScene' })
    this.gameStore = useGameStore
  }

  create() {
    const { width, height } = this.cameras.main.getBounds()
    const { progress } = this.gameStore.getState()

    // 创建标题
    const title = this.add.text(width / 2, 50, 'Statistics', {
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5)

    // 显示统计数据
    const stats = [
      { label: 'Total Games', value: progress.totalGames },
      { label: 'Total Score', value: progress.totalScore },
      { label: 'Longest Snake', value: progress.longestSnake },
      { label: 'Fastest Win', value: `${progress.fastestWin}s` },
      { label: 'Easy High Score', value: progress.highScores[Difficulty.EASY] },
      { label: 'Medium High Score', value: progress.highScores[Difficulty.MEDIUM] },
      { label: 'Hard High Score', value: progress.highScores[Difficulty.HARD] }
    ]

    stats.forEach((stat, index) => {
      const y = 150 + index * 60
      
      this.add.text(width * 0.3, y, stat.label + ':', {
        fontSize: '24px',
        color: '#ffffff'
      }).setOrigin(0, 0.5)

      this.add.text(width * 0.7, y, stat.value.toString(), {
        fontSize: '24px',
        color: '#ffff00'
      }).setOrigin(1, 0.5)
    })

    // 返回按钮
    const backButton = this.createButton(
      width / 2,
      height - 100,
      'Back',
      () => this.scene.start('MainScene')
    )
  }

  private createButton(x: number, y: number, text: string, callback: () => void) {
    const button = this.add.container(x, y)
    
    const bg = this.add.rectangle(0, 0, 200, 50, 0x000000, 0.5)
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    button.add([bg, buttonText])
    button
      .setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', callback)
      .on('pointerover', () => bg.setFillStyle(0x222222, 0.7))
      .on('pointerout', () => bg.setFillStyle(0x000000, 0.5))

    return button
  }
} 