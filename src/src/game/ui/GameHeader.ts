import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'

export class GameHeader {
  private scene: Phaser.Scene
  private scoreText: Phaser.GameObjects.Text
  private timeText: Phaser.GameObjects.Text
  private livesText: Phaser.GameObjects.Text
  private gameStore: typeof useGameStore

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createUI()
    this.gameStore = useGameStore
  }

  private createUI() {
    const { score, lives, timeLeft } = useGameStore.getState()

    this.scoreText = this.scene.add.text(20, 20, `Score: ${score}`, {
      fontSize: '24px',
      color: '#ffffff'
    })

    this.timeText = this.scene.add.text(
      this.scene.cameras.main.width / 2, 
      20, 
      `Time: ${timeLeft}`, 
      {
        fontSize: '24px',
        color: '#ffffff'
      }
    ).setOrigin(0.5, 0)

    this.livesText = this.scene.add.text(
      this.scene.cameras.main.width - 20, 
      20, 
      `Lives: ${lives}`, 
      {
        fontSize: '24px',
        color: '#ffffff'
      }
    ).setOrigin(1, 0)
  }

  update() {
    const { score, lives, timeLeft } = this.gameStore.getState()
    
    // 更新分数
    this.scoreText.setText(`Score: ${score.score}`)
    
    // 更新时间，添加红色警告效果
    const timeColor = timeLeft <= 10 ? '#ff0000' : '#ffffff'
    this.timeText.setText(`Time: ${timeLeft}`).setColor(timeColor)
    
    // 更新生命值，使用心形图标
    this.livesText.setText('❤'.repeat(lives))
  }

  destroy() {
    this.scoreText.destroy()
    this.timeText.destroy()
    this.livesText.destroy()
  }
} 