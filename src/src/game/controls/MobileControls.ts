import Phaser from 'phaser'
import { VirtualJoystick } from './VirtualJoystick'

export class MobileControls {
  private scene: Phaser.Scene
  private joystick: VirtualJoystick
  private buttons: Map<string, Phaser.GameObjects.Container>
  private swipeThreshold: number = 50

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.buttons = new Map()
    
    this.createJoystick()
    this.createButtons()
    this.setupSwipeDetection()
  }

  private createJoystick() {
    const { height } = this.scene.cameras.main.getBounds()
    this.joystick = new VirtualJoystick(
      this.scene,
      100,
      height - 100
    )
  }

  private createButtons() {
    const { width, height } = this.scene.cameras.main.getBounds()
    
    // 暂停按钮
    this.createButton(
      'pause',
      width - 50,
      50,
      '⏸',
      () => this.scene.events.emit('pause')
    )

    // 其他控制按钮...
  }

  private createButton(
    key: string,
    x: number,
    y: number,
    icon: string,
    callback: () => void
  ) {
    const container = this.scene.add.container(x, y)
    
    const bg = this.scene.add.circle(0, 0, 30, 0x000000, 0.5)
    const text = this.scene.add.text(0, 0, icon, {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5)

    container.add([bg, text])
    container
      .setInteractive(
        new Phaser.Geom.Circle(0, 0, 30),
        Phaser.Geom.Circle.Contains
      )
      .on('pointerdown', callback)

    this.buttons.set(key, container)
  }

  private setupSwipeDetection() {
    let startX = 0
    let startY = 0
    let startTime = 0

    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      startX = pointer.x
      startY = pointer.y
      startTime = Date.now()
    })

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const deltaX = pointer.x - startX
      const deltaY = pointer.y - startY
      const deltaTime = Date.now() - startTime

      // 只处理快速滑动
      if (deltaTime > 500) return

      if (Math.abs(deltaX) > this.swipeThreshold || 
          Math.abs(deltaY) > this.swipeThreshold) {
        this.handleSwipe(deltaX, deltaY)
      }
    })
  }

  private handleSwipe(deltaX: number, deltaY: number) {
    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      this.scene.events.emit('swipe', deltaX > 0 ? 'right' : 'left')
    } else {
      // 垂直滑动
      this.scene.events.emit('swipe', deltaY > 0 ? 'down' : 'up')
    }
  }

  setJoystickCallback(callback: (direction: Phaser.Math.Vector2) => void) {
    this.joystick.setMoveCallback(callback)
  }

  setVisible(visible: boolean) {
    this.joystick.setVisible(visible)
    this.buttons.forEach(button => button.setVisible(visible))
  }

  destroy() {
    this.joystick.destroy()
    this.buttons.forEach(button => button.destroy())
    this.buttons.clear()
  }
} 