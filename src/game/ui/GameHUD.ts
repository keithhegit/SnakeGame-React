import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { Difficulty } from '../types/game'

export class GameHUD {
  private scene: Phaser.Scene
  private container: Phaser.GameObjects.Container
  private scoreText: Phaser.GameObjects.Text
  private timeText: Phaser.GameObjects.Text
  private comboText: Phaser.GameObjects.Text
  private livesText: Phaser.GameObjects.Text
  private difficultyText: Phaser.GameObjects.Text
  private gameStore: typeof useGameStore
  private scorePopups: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.gameStore = useGameStore
    this.createHUD()
  }

  private createHUD() {
    const { width } = this.scene.cameras.main.getBounds()
    
    // 创建主容器
    this.container = this.scene.add.container(0, 0)
    this.scorePopups = this.scene.add.container(0, 0)

    // 使用半透明背景图片
    const bg = this.scene.add.image(0, 0, 'button')
      .setDisplaySize(width, 60)
      .setTint(0x000000)
      .setAlpha(0.3)
    
    // 创建渐变效果
    const gradient = this.scene.add.graphics()
    gradient.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.3, 0.3, 0, 0)
    gradient.fillRect(0, 0, width, 70)

    // 创建所有文本元素
    this.createTextElements(width)

    // 添加到容器
    this.container.add([bg, gradient])

    // 初始更新
    this.update()

    // 添加出现动画
    this.container.setY(-60)
    this.scene.tweens.add({
      targets: this.container,
      y: 0,
      duration: 500,
      ease: 'Back.out'
    })
  }

  private createTextElements(width: number) {
    // 分数显示
    this.scoreText = this.createText(20, 20, '', {
      fontSize: '24px',
      color: '#ffffff'
    })

    // 时间显示
    this.timeText = this.createText(width - 20, 20, '', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(1, 0)

    // 连击显示
    this.comboText = this.createText(width / 2, 20, '', {
      fontSize: '24px',
      color: '#ffff00'
    }).setOrigin(0.5, 0)

    // 生命值显示
    this.livesText = this.createText(20, 50, '', {
      fontSize: '24px',
      color: '#ff0000'
    })

    // 难度显示
    this.difficultyText = this.createText(width - 20, 50, '', {
      fontSize: '24px',
      color: '#00ff00'
    }).setOrigin(1, 0)

    this.container.add([
      this.scoreText,
      this.timeText,
      this.comboText,
      this.livesText,
      this.difficultyText
    ])
  }

  private createText(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle) {
    return this.scene.add.text(x, y, text, {
      ...style,
      stroke: '#000000',
      strokeThickness: 4
    })
  }

  update() {
    const { score, lives, timeLeft, difficulty } = this.gameStore.getState()

    // 更新分数，添加动画效果
    const currentScore = parseInt(this.scoreText.text.split(': ')[1] || '0')
    if (currentScore !== score.score) {
      this.tweens.add({
        targets: { value: currentScore },
        value: score.score,
        duration: 500,
        ease: 'Power2',
        onUpdate: (tween) => {
          this.scoreText.setText(`Score: ${Math.floor(tween.getValue())}`)
        }
      })
    }

    // 更新时间，添加警告效果
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`
    this.timeText.setText(`Time: ${timeString}`)
    
    if (timeLeft <= 10) {
      this.timeText.setTint(0xff0000)
      if (!this.timeText.getData('warning')) {
        this.timeText.setData('warning', true)
        this.scene.tweens.add({
          targets: this.timeText,
          alpha: 0.5,
          duration: 500,
          yoyo: true,
          repeat: -1
        })
      }
    } else {
      this.timeText.clearTint()
      this.timeText.setAlpha(1)
      this.timeText.setData('warning', false)
    }

    // 更新连击显示
    if (score.combo > 1) {
      const comboText = `Combo x${score.combo} (${score.multiplier.toFixed(1)}x)`
      if (this.comboText.text !== comboText) {
        this.comboText.setText(comboText)
        this.scene.tweens.add({
          targets: this.comboText,
          scale: { from: 1.2, to: 1 },
          duration: 200,
          ease: 'Back.out'
        })
      }
      this.comboText.setVisible(true)
    } else {
      this.comboText.setVisible(false)
    }

    // 更新生命值显示
    const heartsText = '❤'.repeat(lives)
    if (this.livesText.text !== heartsText) {
      this.livesText.setText(heartsText)
      this.scene.tweens.add({
        targets: this.livesText,
        scale: { from: 1.2, to: 1 },
        duration: 200,
        ease: 'Back.out'
      })
    }

    // 更新难度显示
    const difficultyText = {
      [Difficulty.EASY]: 'Easy',
      [Difficulty.MEDIUM]: 'Medium',
      [Difficulty.HARD]: 'Hard'
    }[difficulty]
    this.difficultyText.setText(difficultyText)
  }

  showScorePopup(score: number, x: number, y: number) {
    const container = this.scene.add.container(x, y)
    
    // 使用按钮背景作为分数弹出背景
    const bg = this.scene.add.image(0, 0, 'button')
      .setDisplaySize(80, 40)
      .setTint(0x000000)
      .setAlpha(0.5)
    
    const scoreText = this.scene.add.text(0, 0, `+${score}`, {
      fontSize: '32px',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)

    container.add([bg, scoreText])

    this.scene.tweens.add({
      targets: container,
      y: '-=50',
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => container.destroy()
    })
  }

  destroy() {
    // 添加消失动画
    this.scene.tweens.add({
      targets: this.container,
      y: -60,
      duration: 300,
      ease: 'Back.in',
      onComplete: () => {
        this.container.destroy()
        this.scorePopups.destroy()
      }
    })
  }
} 