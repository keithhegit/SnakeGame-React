import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { StorageService } from '../services/StorageService'

export default class GameOverScene extends Phaser.Scene {
  private gameStore: typeof useGameStore

  constructor() {
    super({ key: 'GameOverScene' })
    this.gameStore = useGameStore
  }

  create() {
    const { score, highScore } = this.gameStore.getState()
    const { width, height } = this.cameras.main.getBounds()

    // 创建游戏结束界面
    const gameOverText = this.add.text(width / 2, height * 0.3, 'GAME OVER', {
      fontSize: '48px',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5)

    const scoreText = this.add.text(width / 2, height * 0.4, `Score: ${score.score}`, {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5)

    const highScoreText = this.add.text(width / 2, height * 0.5, `High Score: ${highScore}`, {
      fontSize: '32px',
      color: '#ffff00'
    }).setOrigin(0.5)

    const restartText = this.add.text(width / 2, height * 0.7, 'Press SPACE to Restart', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    // 添加键盘监听
    this.input.keyboard.once('keydown-SPACE', () => {
      this.gameStore.resetGame()
      this.scene.start('MainScene')
    })

    // 添加动画效果
    this.tweens.add({
      targets: [gameOverText, scoreText, highScoreText, restartText],
      y: '+=20',
      duration: 2000,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    })
  }

  private saveScore() {
    const { score, difficulty } = this.gameStore.getState()
    
    // 创建输入框获取玩家名字
    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.placeholder = 'Enter your name'
    nameInput.style.position = 'absolute'
    nameInput.style.left = '50%'
    nameInput.style.top = '50%'
    nameInput.style.transform = 'translate(-50%, -50%)'
    
    document.body.appendChild(nameInput)
    nameInput.focus()

    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const name = nameInput.value.trim() || 'Anonymous'
        document.body.removeChild(nameInput)
        
        StorageService.saveScore({
          name,
          score: score.score,
          difficulty
        })
        
        this.scene.start('LeaderboardScene')
      }
    })
  }
} 