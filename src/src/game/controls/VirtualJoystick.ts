import Phaser from 'phaser'

export class VirtualJoystick {
  private scene: Phaser.Scene
  private base: Phaser.GameObjects.Container
  private stick: Phaser.GameObjects.Sprite
  private baseRadius: number = 60
  private stickRadius: number = 30
  private maxDistance: number = 50
  private onMove: (direction: Phaser.Math.Vector2) => void
  private direction: Phaser.Math.Vector2
  private isActive: boolean = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene
    this.direction = new Phaser.Math.Vector2(0, 0)
    
    // 创建底座
    this.base = this.scene.add.container(x, y)
    const baseBg = this.scene.add.circle(0, 0, this.baseRadius, 0x000000, 0.3)
    const baseOutline = this.scene.add.circle(0, 0, this.baseRadius, 0xffffff, 0)
    baseOutline.setStrokeStyle(2, 0xffffff, 0.5)
    this.base.add([baseBg, baseOutline])

    // 创建摇杆
    this.stick = this.scene.add.sprite(0, 0, 'joystick')
    this.stick.setScale(this.stickRadius / 50) // 假设摇杆图片是 100x100
    this.base.add(this.stick)

    // 设置交互
    this.setupInteraction()
  }

  private setupInteraction() {
    // 底座可拖动区域
    const hitArea = new Phaser.Geom.Circle(0, 0, this.baseRadius)
    this.base.setInteractive({
      hitArea,
      hitAreaCallback: Phaser.Geom.Circle.Contains,
      draggable: true,
      useHandCursor: true
    })

    // 触摸/拖动事件
    this.scene.input.on('pointerdown', this.handlePointerDown, this)
    this.scene.input.on('pointermove', this.handlePointerMove, this)
    this.scene.input.on('pointerup', this.handlePointerUp, this)
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    const distance = Phaser.Math.Distance.Between(
      pointer.x, pointer.y,
      this.base.x, this.base.y
    )

    if (distance <= this.baseRadius) {
      this.isActive = true
      this.updateStickPosition(pointer)
    }
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.isActive) return
    this.updateStickPosition(pointer)
  }

  private handlePointerUp() {
    if (!this.isActive) return
    this.isActive = false
    this.resetStick()
  }

  private updateStickPosition(pointer: Phaser.Input.Pointer) {
    const distance = Phaser.Math.Distance.Between(
      pointer.x, pointer.y,
      this.base.x, this.base.y
    )

    if (distance <= this.maxDistance) {
      this.stick.setPosition(
        pointer.x - this.base.x,
        pointer.y - this.base.y
      )
    } else {
      const angle = Phaser.Math.Angle.Between(
        this.base.x, this.base.y,
        pointer.x, pointer.y
      )
      this.stick.setPosition(
        Math.cos(angle) * this.maxDistance,
        Math.sin(angle) * this.maxDistance
      )
    }

    // 计算并发送方向
    this.direction.set(
      this.stick.x / this.maxDistance,
      this.stick.y / this.maxDistance
    )
    this.onMove?.(this.direction)
  }

  private resetStick() {
    this.stick.setPosition(0, 0)
    this.direction.set(0, 0)
    this.onMove?.(this.direction)
  }

  setMoveCallback(callback: (direction: Phaser.Math.Vector2) => void) {
    this.onMove = callback
  }

  setVisible(visible: boolean) {
    this.base.setVisible(visible)
  }

  destroy() {
    this.scene.input.off('pointerdown', this.handlePointerDown, this)
    this.scene.input.off('pointermove', this.handlePointerMove, this)
    this.scene.input.off('pointerup', this.handlePointerUp, this)
    this.base.destroy()
  }
} 