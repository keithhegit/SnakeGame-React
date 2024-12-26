import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { Difficulty, GameState } from '../types/game'

interface DifficultyOption {
  difficulty: Difficulty
  title: string
  description: string
  preview: {
    speed: number
    foodCount: number
    timeLimit: number
  }
}

export default class DifficultyScene extends Phaser.Scene {
  private gameStore: typeof useGameStore
  private selectedIndex: number = 0
  private difficultyOptions: DifficultyOption[] = [
    {
      difficulty: Difficulty.EASY,
      title: 'Easy',
      description: 'Perfect for beginners\nSlow speed, more time',
      preview: {
        speed: 150,
        foodCount: 1,
        timeLimit: 90
      }
    },
    {
      difficulty: Difficulty.MEDIUM,
      title: 'Medium',
      description: 'For experienced players\nModerate speed, normal time',
      preview: {
        speed: 120,
        foodCount: 2,
        timeLimit: 60
      }
    },
    {
      difficulty: Difficulty.HARD,
      title: 'Hard',
      description: 'For experts only!\nFast speed, less time',
      preview: {
        speed: 90,
        foodCount: 3,
        timeLimit: 45
      }
    }
  ]

  private difficultyCards: Phaser.GameObjects.Container[] = []
  private previewContainer: Phaser.GameObjects.Container
  private snakePreview: Phaser.GameObjects.Container

  constructor() {
    super({ key: 'DifficultyScene' })
    this.gameStore = useGameStore
  }

  create() {
    try {
      const { width, height } = this.cameras.main.getBounds()

      // 创建标题
      const title = this.add.text(width / 2, 50, 'Select Difficulty', {
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6
      }).setOrigin(0.5)

      // 创建难度选择卡片
      this.createDifficultyCards()

      // 创建预览区域
      this.createPreviewArea()

      // 创建导航按钮
      this.createNavigationButtons()

      // 添加键盘控制
      this.setupKeyboardControls()

      // 显示初始选择
      this.updateSelection()

      // 添加转场动画
      this.cameras.main.fadeIn(500)

    } catch (error) {
      ErrorHandler.handleError(this, error as Error)
    }
  }

  private createDifficultyCards() {
    const { width } = this.cameras.main.getBounds()
    const startX = width * 0.2
    const cardWidth = 200
    const spacing = 40

    this.difficultyOptions.forEach((option, index) => {
      const card = this.createDifficultyCard(
        startX + index * (cardWidth + spacing),
        200,
        option
      )
      this.difficultyCards.push(card)

      // 添加点击事件
      card.setInteractive(new Phaser.Geom.Rectangle(-90, -120, 180, 240), Phaser.Geom.Rectangle.Contains)
        .on('pointerdown', () => {
          this.selectDifficulty(index)
          if (this.selectedIndex === index) {
            this.startGame()
          }
        })
    })
  }

  private createDifficultyCard(x: number, y: number, option: DifficultyOption) {
    const container = this.add.container(x, y)
    
    // 使用按钮背景图片
    const bg = this.add.image(0, 0, 'button')
      .setDisplaySize(180, 240)
      .setTint(0x000000)
      .setAlpha(0.5)
    
    // 难度标题
    const title = this.add.text(0, -80, option.title, {
      fontSize: '32px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5)

    // 难度描述
    const description = this.add.text(0, 0, option.description, {
      fontSize: '16px',
      color: '#cccccc',
      align: 'center',
      lineSpacing: 10
    }).setOrigin(0.5)

    container.add([bg, title, description])
    return container
  }

  private createPreviewArea() {
    const { width, height } = this.cameras.main.getBounds()
    this.previewContainer = this.add.container(width / 2, height - 150)

    // 预览标题
    const previewTitle = this.add.text(0, -50, 'Preview', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.previewContainer.add(previewTitle)
  }

  private createNavigationButtons() {
    const { width, height } = this.cameras.main.getBounds()

    // 使用按钮背景图片
    const startButton = this.add.container(width / 2, height - 60)
    const startBg = this.add.image(0, 0, 'button')
      .setDisplaySize(200, 50)
      .setTint(0x00ff00)
      .setAlpha(0.5)
    
    const startText = this.add.text(0, 0, 'Start Game', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    startButton.add([startBg, startText])
    startButton
      .setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => this.startGame())
      .on('pointerover', () => startBg.setFillStyle(0x00cc00, 0.7))
      .on('pointerout', () => startBg.setFillStyle(0x00ff00, 0.5))
  }

  private setupKeyboardControls() {
    this.input.keyboard.on('keydown-LEFT', () => this.selectDifficulty(this.selectedIndex - 1))
    this.input.keyboard.on('keydown-RIGHT', () => this.selectDifficulty(this.selectedIndex + 1))
    this.input.keyboard.on('keydown-ENTER', () => this.startGame())
  }

  private selectDifficulty(index: number) {
    const newIndex = Phaser.Math.Clamp(index, 0, this.difficultyOptions.length - 1)
    if (this.selectedIndex === newIndex) return

    this.selectedIndex = newIndex
    this.updateSelection()
  }

  private updateSelection() {
    this.difficultyCards.forEach((card, index) => {
      const isSelected = index === this.selectedIndex
      this.tweens.add({
        targets: card,
        scaleX: isSelected ? 1.1 : 1,
        scaleY: isSelected ? 1.1 : 1,
        duration: 200
      })
      card.first.setFillStyle(0x000000, isSelected ? 0.8 : 0.5)
    })

    this.updatePreview()
  }

  private updatePreview() {
    const option = this.difficultyOptions[this.selectedIndex]
    this.previewContainer.each(child => {
      if (child.type !== 'Text') child.destroy()
    })

    const stats = [
      { label: 'Speed', value: `${option.preview.speed}ms` },
      { label: 'Food Count', value: option.preview.foodCount },
      { label: 'Time Limit', value: `${option.preview.timeLimit}s` }
    ]

    stats.forEach((stat, index) => {
      const x = (index - 1) * 120
      const statContainer = this.add.container(x, 0)
      
      const value = this.add.text(0, 0, stat.value.toString(), {
        fontSize: '24px',
        color: '#ffff00'
      }).setOrigin(0.5)

      const label = this.add.text(0, 30, stat.label, {
        fontSize: '16px',
        color: '#ffffff'
      }).setOrigin(0.5)

      statContainer.add([value, label])
      this.previewContainer.add(statContainer)
    })
  }

  private startGame() {
    const selectedOption = this.difficultyOptions[this.selectedIndex]
    
    // 保存难度设置
    this.gameStore.updateSettings({
      difficulty: selectedOption.difficulty
    })

    // 重置游戏状态
    this.gameStore.resetGame()

    // 转场动画
    this.cameras.main.fadeOut(500)
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MainScene')
    })
  }

  destroy() {
    this.snakePreview?.destroy()
    this.previewContainer?.destroy()
    this.difficultyCards.forEach(card => card.destroy())
    super.destroy()
  }
} 