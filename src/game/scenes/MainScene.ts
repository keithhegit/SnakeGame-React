import Phaser from 'phaser'
import { Snake } from '../objects/Snake'
import { Food } from '../objects/Food'
import { GameController } from '../controls/GameController'
import { useGameStore } from '../store/gameStore'
import { GameState } from '../types/game'
import { GameHeader } from '../objects/GameHeader'
import { VirtualJoystick } from '../controls/VirtualJoystick'
import { MobileControls } from '../controls/MobileControls'
import { TouchControls } from '../controls/TouchControls'
import { MobileUI } from '../ui/MobileUI'
import { DeviceDetector } from '../utils/DeviceDetector'
import { ErrorHandler } from '../utils/ErrorBoundary'

export default class MainScene extends Phaser.Scene {
  private snake: Snake
  private food: Food
  private controller: GameController
  private gameStore: typeof useGameStore
  private pauseMenu: Phaser.GameObjects.Container
  private gameTimer: Phaser.Time.TimerEvent
  private gameHUD: GameHeader
  private joystick: VirtualJoystick
  private isMobile: boolean
  private mobileControls: MobileControls
  private touchControls: TouchControls
  private mobileUI: MobileUI

  constructor() {
    super({ key: 'MainScene' })
    this.gameStore = useGameStore
  }

  create() {
    try {
      // 验证游戏状态
      if (!this.gameStore.validateGameState()) {
        throw new Error('Invalid game state')
      }

      // 设置正确的控制类型
      const controlType = DeviceDetector.getControlType(this)
      this.setupControls(controlType)

      this.snake = new Snake(this, 340, 340)
      this.food = new Food(this)
      this.controller = new GameController(this, this.snake)
      
      this.gameStore.setState({ state: GameState.PLAYING })
      
      this.input.keyboard.on('keydown-P', this.handlePause, this)
      this.input.keyboard.on('keydown-ESC', this.handlePause, this)
      
      this.gameHUD = new GameHeader(this)
      
      this.setupGameTimer()
      
      // 检测是否为移动设备
      this.isMobile = this.game.device.os.android || 
                      this.game.device.os.iOS || 
                      this.game.device.os.iPad ||
                      this.game.device.os.iPhone

      if (this.isMobile) {
        this.setupMobileControls()
      }

      if (this.game.device.input.touch) {
        this.setupTouchControls()
      }

      // 验证必要的游戏设置
      const { settings, difficulty } = this.gameStore.getState()
      if (!settings || !difficulty) {
        console.error('Missing required game settings')
        this.scene.start('DifficultyScene')
        return
      }
    } catch (error) {
      ErrorHandler.handleError(this, error as Error)
    }
  }

  private setupGameTimer() {
    const { timeLeft } = this.gameStore.getState()
    
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateGameTime,
      callbackScope: this,
      loop: true
    })
  }

  private updateGameTime = () => {
    const { timeLeft, state } = this.gameStore.getState()
    
    if (state !== GameState.PLAYING) return
    
    if (timeLeft > 0) {
      this.gameStore.setState({ timeLeft: timeLeft - 1 })
    } else {
      this.handleGameOver()
    }
  }

  private handleDeath() {
    const { lives } = this.gameStore.getState()
    
    if (lives > 1) {
      this.gameStore.setLives(lives - 1)
      this.respawnSnake()
    } else {
      this.handleGameOver()
    }
  }

  private respawnSnake() {
    this.snake.reset(340, 340)
    
    this.createInvincibleEffect()
  }

  private createInvincibleEffect() {
    this.tweens.add({
      targets: this.snake.getSprites(),
      alpha: 0.5,
      duration: 200,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.snake.getSprites().forEach(sprite => sprite.setAlpha(1))
      }
    })
  }

  private handlePause = () => {
    const { state } = this.gameStore.getState()
    
    if (state === GameState.PLAYING) {
      this.gameStore.setPaused(true)
      this.showPauseMenu()
    } else if (state === GameState.PAUSED) {
      this.gameStore.setPaused(false)
      this.hidePauseMenu()
    }
  }

  private showPauseMenu() {
    this.pauseMenu = this.add.container(400, 300)

    const bg = this.add.rectangle(0, 0, 300, 200, 0x000000, 0.8)
    const pauseText = this.add.text(0, -50, 'PAUSED', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5)

    const resumeText = this.add.text(0, 0, 'Press P to Resume', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    const quitText = this.add.text(0, 50, 'Press ESC to Quit', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.pauseMenu.add([bg, pauseText, resumeText, quitText])
    
    this.pauseMenu.setScale(0)
    this.tweens.add({
      targets: this.pauseMenu,
      scale: 1,
      duration: 200,
      ease: 'Back.out'
    })
  }

  private hidePauseMenu() {
    if (this.pauseMenu) {
      this.tweens.add({
        targets: this.pauseMenu,
        scale: 0,
        duration: 200,
        ease: 'Back.in',
        onComplete: () => {
          this.pauseMenu.destroy()
        }
      })
    }
  }

  update(time: number) {
    const { state } = this.gameStore.getState()
    if (state !== GameState.PLAYING) return

    if (!this.snake.update(time)) {
      this.handleGameOver()
      return
    }

    this.controller.update()

    const head = this.snake.getHead()
    const food = this.food.getPosition()
    
    if (this.checkFoodCollision(head, food)) {
      this.handleFoodCollision()
    }

    this.gameHUD.update()
  }

  private checkFoodCollision(head: Phaser.GameObjects.Sprite, food: Phaser.Math.Vector2) {
    const distance = Phaser.Math.Distance.Between(head.x, head.y, food.x, food.y)
    return distance < 20
  }

  private handleFoodCollision() {
    this.snake.grow()
    this.food.randomizePosition()
    
    this.gameStore.addScore(10)
    
    this.createScorePopup(this.snake.getHead())
  }

  private createScorePopup(position: Phaser.GameObjects.Sprite) {
    const { score } = this.gameStore.getState()
    const scoreText = this.add.text(
      position.x,
      position.y - 20,
      `+${Math.floor(10 * score.multiplier)}`,
      {
        fontSize: '24px',
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5)

    this.tweens.add({
      targets: scoreText,
      y: position.y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => scoreText.destroy()
    })
  }

  private handleGameOver() {
    const { score, snake } = this
    const { settings, updateProgress } = this.gameStore
    
    // 更新进度
    updateProgress((current) => ({
      totalGames: current.totalGames + 1,
      totalScore: current.totalScore + score,
      longestSnake: Math.max(current.longestSnake, snake.getLength()),
      highScores: {
        ...current.highScores,
        [settings.difficulty]: Math.max(
          current.highScores[settings.difficulty],
          score
        )
      }
    }))

    this.gameStore.resetCombo()
    this.gameStore.setState(GameState.GAME_OVER)
    
    this.createGameOverEffect()
    this.transitionToScene('GameOverScene')
  }

  private createGameOverEffect() {
    const { width, height } = this.cameras.main
    
    const gameOverText = this.add.text(
      width / 2,
      height / 2,
      'GAME OVER',
      {
        fontSize: '64px',
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 8
      }
    ).setOrigin(0.5).setAlpha(0)

    this.tweens.add({
      targets: gameOverText,
      alpha: 1,
      scale: { from: 2, to: 1 },
      duration: 1000,
      ease: 'Bounce'
    })
  }

  private setupMobileControls() {
    this.mobileControls = new MobileControls(this)
    
    // 设置摇杆回调
    this.mobileControls.setJoystickCallback((direction: Phaser.Math.Vector2) => {
      if (direction.length() > 0.5) {
        const normalizedDir = direction.normalize()
        const gameDir = new Phaser.Math.Vector2(
          Math.round(normalizedDir.x) * 40,
          Math.round(normalizedDir.y) * 40
        )
        this.snake.setDirection(gameDir)
      }
    })

    // 监听滑动事件
    this.events.on('swipe', (direction: string) => {
      switch (direction) {
        case 'up':
          this.snake.setDirection(new Phaser.Math.Vector2(0, -40))
          break
        case 'down':
          this.snake.setDirection(new Phaser.Math.Vector2(0, 40))
          break
        case 'left':
          this.snake.setDirection(new Phaser.Math.Vector2(-40, 0))
          break
        case 'right':
          this.snake.setDirection(new Phaser.Math.Vector2(40, 0))
          break
      }
    })

    // 监听暂停事件
    this.events.on('pause', () => this.handlePause())

    // 添加移动端UI
    this.mobileUI = new MobileUI(this)
    this.mobileUI.showControlHints()
  }

  private setupTouchControls() {
    this.touchControls = new TouchControls(this)

    // 处理滑动
    this.touchControls.setSwipeCallback((direction: string) => {
      switch (direction) {
        case 'up':
          this.snake.setDirection(new Phaser.Math.Vector2(0, -40))
          break
        case 'down':
          this.snake.setDirection(new Phaser.Math.Vector2(0, 40))
          break
        case 'left':
          this.snake.setDirection(new Phaser.Math.Vector2(-40, 0))
          break
        case 'right':
          this.snake.setDirection(new Phaser.Math.Vector2(40, 0))
          break
      }
    })

    // 处理点击
    this.touchControls.setTapCallback((position: Phaser.Math.Vector2) => {
      const { width, height } = this.cameras.main.getBounds()
      const centerX = width / 2
      const centerY = height / 2

      // 根据点击位置判断方向
      const deltaX = position.x - centerX
      const deltaY = position.y - centerY

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        this.snake.setDirection(new Phaser.Math.Vector2(
          deltaX > 0 ? 40 : -40,
          0
        ))
      } else {
        this.snake.setDirection(new Phaser.Math.Vector2(
          0,
          deltaY > 0 ? 40 : -40
        ))
      }
    })
  }

  destroy() {
    this.gameTimer?.destroy()
    this.gameHUD.destroy()
    super.destroy()
    if (this.isMobile) {
      this.joystick?.destroy()
    }
    this.touchControls?.destroy()
    this.mobileUI?.destroy()
  }

  private setupControls(controlType: 'keyboard' | 'touch' | 'joystick') {
    switch (controlType) {
      case 'keyboard':
        this.setupKeyboardControls()
        break
      case 'touch':
        this.setupTouchControls()
        break
      case 'joystick':
        this.setupJoystickControls()
        break
    }
  }

  private setupKeyboardControls() {
    // 移除旧的键盘事件监听
    this.input.keyboard.removeAllKeys()

    // 添加新的键盘控制
    const keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      p: Phaser.Input.Keyboard.KeyCodes.P,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC
    }) as any

    // 更新控制器
    this.controller = new GameController(this, this.snake, keys)
  }

  private setupJoystickControls() {
    if (this.joystick) {
      this.joystick.destroy()
    }

    const { width, height } = this.cameras.main.getBounds()
    this.joystick = new VirtualJoystick(this, {
      x: width * 0.2,
      y: height * 0.8,
      radius: 60,
      base: {
        color: 0x000000,
        alpha: 0.5
      },
      stick: {
        color: 0x333333,
        alpha: 0.8
      }
    })

    this.joystick.on('move', (direction: Phaser.Math.Vector2) => {
      if (direction.length() > 0.5) {
        const normalizedDir = direction.normalize()
        const gameDir = new Phaser.Math.Vector2(
          Math.round(normalizedDir.x) * 40,
          Math.round(normalizedDir.y) * 40
        )
        this.snake.setDirection(gameDir)
      }
    })
  }

  private transitionToScene(key: string) {
    const { width, height } = this.cameras.main.getBounds()
    
    // 创建过渡效果
    const transition = this.add.graphics()
    transition.fillStyle(0x000000, 1)
    transition.fillRect(0, 0, width, height)
    transition.setDepth(1000)
    transition.setAlpha(0)

    // 淡出动画
    this.tweens.add({
      targets: transition,
      alpha: 1,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.scene.start(key)
      }
    })
  }
} 