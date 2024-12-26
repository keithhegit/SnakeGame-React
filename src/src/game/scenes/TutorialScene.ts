import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { GameState } from '../types/game'

export default class TutorialScene extends Phaser.Scene {
  private currentStep: number = 0
  private tutorialSteps: TutorialStep[] = []
  private nextButton: Phaser.GameObjects.Container
  private skipButton: Phaser.GameObjects.Container
  private demoSnake: Phaser.GameObjects.Container
  private demoFood: Phaser.GameObjects.Sprite

  constructor() {
    super({ key: 'TutorialScene' })
  }

  create() {
    const { width, height } = this.cameras.main.getBounds()

    // 创建教程步骤
    this.setupTutorialSteps()
    
    // 创建演示蛇
    this.createDemoSnake()
    
    // 创建演示食物
    this.createDemoFood()
    
    // 创建导航按钮
    this.createNavigationButtons()
    
    // 显示第一步
    this.showStep(0)

    // 检测是否为移动设备
    const isMobile = this.game.device.os.android || 
                    this.game.device.os.iOS || 
                    this.game.device.os.iPad ||
                    this.game.device.os.iPhone

    // 根据设备类型显示不同的控制说明
    this.setupControlsDemo(isMobile)
  }

  private setupTutorialSteps() {
    this.tutorialSteps = [
      {
        title: 'Welcome to Snake!',
        content: 'Learn how to play in this quick tutorial.',
        action: () => this.showWelcome()
      },
      {
        title: 'Basic Controls',
        content: 'Use arrow keys or WASD to control the snake.',
        action: () => this.showControls()
      },
      {
        title: 'Collect Food',
        content: 'Eat the food to grow longer and score points.',
        action: () => this.showFoodDemo()
      },
      {
        title: 'Avoid Collisions',
        content: "Don't hit the walls or your own tail!",
        action: () => this.showCollisionDemo()
      },
      {
        title: 'Score Points',
        content: 'Build combos by eating food quickly.',
        action: () => this.showScoringDemo()
      },
      {
        title: "You're Ready!",
        content: 'Choose your difficulty and start playing!',
        action: () => this.showFinalStep()
      }
    ]
  }

  private createNavigationButtons() {
    const { width, height } = this.cameras.main.getBounds()

    // Next 按钮
    this.nextButton = this.createButton(
      width - 100,
      height - 50,
      'Next',
      () => this.nextStep()
    )

    // Skip 按钮
    this.skipButton = this.createButton(
      100,
      height - 50,
      'Skip Tutorial',
      () => this.skipTutorial()
    )
  }

  private createButton(x: number, y: number, text: string, callback: () => void) {
    const container = this.add.container(x, y)
    
    const bg = this.add.rectangle(0, 0, 160, 40, 0x000000, 0.5)
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    container.add([bg, buttonText])
    bg.setInteractive({ useHandCursor: true })
      .on('pointerdown', callback)
      .on('pointerover', () => bg.setFillStyle(0x222222, 0.7))
      .on('pointerout', () => bg.setFillStyle(0x000000, 0.5))

    return container
  }

  private showStep(index: number) {
    const step = this.tutorialSteps[index]
    const { width, height } = this.cameras.main.getBounds()

    // 清除之前的内容
    const oldContent = this.children.getAll()
      .filter(obj => obj.getData('type') === 'tutorial-text' || obj.getData('type') === 'tutorial-graphics')

    // 淡出动画
    this.tweens.add({
      targets: oldContent,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        oldContent.forEach(obj => obj.destroy())
        this.showNewStepContent(step, width, height)
      }
    })
  }

  private showNewStepContent(step: TutorialStep, width: number, height: number) {
    // 标题
    const title = this.add.text(width / 2, 100, step.title, {
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    })
    .setOrigin(0.5)
    .setData('type', 'tutorial-text')
    .setAlpha(0)

    // 内容
    const content = this.add.text(width / 2, 180, step.content, {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    })
    .setOrigin(0.5)
    .setData('type', 'tutorial-text')
    .setAlpha(0)

    // 淡入动画
    this.tweens.add({
      targets: [title, content],
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    })

    // 执行步骤特定动作
    step.action()

    // 更新按钮文本
    const nextButtonText = this.nextButton.getAt(1) as Phaser.GameObjects.Text
    nextButtonText.setText(
      this.currentStep === this.tutorialSteps.length - 1 ? 'Start Game' : 'Next'
    )
  }

  private createDemoSnake() {
    this.demoSnake = this.add.container(340, 340)
    
    const head = this.add.sprite(0, 0, 'snake-head')
    const body1 = this.add.sprite(-40, 0, 'snake-body')
    const body2 = this.add.sprite(-80, 0, 'snake-body')
    
    this.demoSnake.add([head, body1, body2])
  }

  private createDemoFood() {
    this.demoFood = this.add.sprite(460, 340, 'food')
  }

  private showWelcome() {
    // 简单的欢迎动画
    this.tweens.add({
      targets: this.demoSnake,
      scale: { from: 0, to: 1 },
      duration: 1000,
      ease: 'Back.out'
    })
  }

  private showControls() {
    // 清除之前的演示
    this.demoSnake.setPosition(340, 340)
    this.demoSnake.setRotation(0)

    // 创建路径动画
    const path = new Phaser.Curves.Path(340, 340)
    path.lineTo(460, 340) // 右
    path.lineTo(460, 460) // 下
    path.lineTo(340, 460) // 左
    path.lineTo(340, 340) // 上

    // 创建路径指示器
    const pathGraphics = this.add.graphics()
    pathGraphics.lineStyle(2, 0xffffff, 0.5)
    path.draw(pathGraphics)
    pathGraphics.setData('type', 'tutorial-graphics')

    // 蛇的移动动画
    const points = path.getPoints()
    const timeline = this.tweens.createTimeline()

    points.forEach((point, index) => {
      if (index < points.length - 1) {
        const nextPoint = points[index + 1]
        const angle = Phaser.Math.Angle.Between(point.x, point.y, nextPoint.x, nextPoint.y)

        timeline.add({
          targets: this.demoSnake,
          x: nextPoint.x,
          y: nextPoint.y,
          rotation: angle,
          duration: 1000,
          ease: 'Linear'
        })
      }
    })

    timeline.play()

    // 添加键盘演示
    const keyboardDemo = this.createKeyboardDemo()
    keyboardDemo.setData('type', 'tutorial-text')
  }

  private createKeyboardDemo() {
    const { width, height } = this.cameras.main.getBounds()
    const keySize = 50
    const spacing = 10
    
    // WASD 键位
    const wasdKeys = [
      { key: 'W', x: 0, y: -1 },
      { key: 'A', x: -1, y: 0 },
      { key: 'S', x: 0, y: 1 },
      { key: 'D', x: 1, y: 0 }
    ]

    // 创建键盘容器
    const keyboardContainer = this.add.container(width / 2 - 100, height - 200)

    // 创建 WASD 键位
    wasdKeys.forEach(({ key, x, y }) => {
      const keyBg = this.add.rectangle(
        x * (keySize + spacing),
        y * (keySize + spacing),
        keySize,
        keySize,
        0x000000,
        0.5
      )
      const keyText = this.add.text(
        x * (keySize + spacing),
        y * (keySize + spacing),
        key,
        {
          fontSize: '24px',
          color: '#ffffff'
        }
      ).setOrigin(0.5)

      // 添加按键动画
      this.tweens.add({
        targets: [keyBg, keyText],
        scale: { from: 1, to: 1.1 },
        alpha: { from: 0.5, to: 1 },
        duration: 500,
        yoyo: true,
        repeat: -1,
        delay: wasdKeys.indexOf({ key, x, y }) * 200
      })

      keyboardContainer.add([keyBg, keyText])
    })

    return keyboardContainer
  }

  private showFoodDemo() {
    // 演示吃食物
    this.tweens.add({
      targets: this.demoSnake,
      x: this.demoFood.x,
      duration: 1000,
      ease: 'Linear',
      onComplete: () => {
        this.demoFood.setVisible(false)
        this.growDemoSnake()
      }
    })
  }

  private growDemoSnake() {
    const lastSegment = this.demoSnake.getAt(this.demoSnake.length - 1) as Phaser.GameObjects.Sprite
    const newSegment = this.add.sprite(
      lastSegment.x - 40,
      lastSegment.y,
      'snake-body'
    )
    this.demoSnake.add(newSegment)
  }

  private showCollisionDemo() {
    // 演示碰撞
    const warning = this.add.text(340, 260, '⚠', {
      fontSize: '64px',
      color: '#ff0000'
    }).setOrigin(0.5)

    this.tweens.add({
      targets: warning,
      scale: { from: 0, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.out'
    })
  }

  private showScoringDemo() {
    // 演示计分
    const scorePopup = this.add.text(340, 300, '+10', {
      fontSize: '32px',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)

    this.tweens.add({
      targets: scorePopup,
      y: '-=50',
      alpha: { from: 1, to: 0 },
      duration: 1000,
      ease: 'Power2'
    })
  }

  private showFinalStep() {
    // 最终动画
    this.tweens.add({
      targets: [this.demoSnake, this.demoFood],
      alpha: 0,
      duration: 500
    })
  }

  private nextStep() {
    if (this.currentStep < this.tutorialSteps.length - 1) {
      this.currentStep++
      this.showStep(this.currentStep)
    } else {
      this.startGame()
    }
  }

  private skipTutorial() {
    this.startGame()
  }

  private startGame() {
    useGameStore.setState({ state: GameState.DIFFICULTY_SELECT })
    this.scene.start('DifficultyScene')
  }

  private setupControlsDemo(isMobile: boolean) {
    const { width, height } = this.cameras.main.getBounds()
    
    if (isMobile) {
      // 显示移动端控制说明
      this.add.text(width / 2, height - 150, 'Swipe or tap to move', {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5)
    } else {
      // 显示键盘控制说明
      const keys = [
        { key: '↑', x: 0, y: -40 },
        { key: '←', x: -40, y: 0 },
        { key: '↓', x: 0, y: 40 },
        { key: '→', x: 40, y: 0 }
      ]

      keys.forEach(({ key, x, y }) => {
        this.add.text(width / 2 + x, height - 150 + y, key, {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: 10
        }).setOrigin(0.5)
      })
    }
  }
}

interface TutorialStep {
  title: string;
  content: string;
  action: () => void;
} 