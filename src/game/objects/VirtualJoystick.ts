import { Scene } from 'phaser'

export class VirtualJoystick {
  private scene: Scene
  private base: Phaser.GameObjects.Circle
  private stick: Phaser.GameObjects.Circle
  private baseRadius: number = 60
  private stickRadius: number = 30
  private maxDistance: number = 50
  private direction: Phaser.Math.Vector2
  private onDirectionChange?: (direction: Phaser.Math.Vector2) => void

  constructor(scene: Scene, x: number, y: number) {
    this.scene = scene
    this.direction = new Phaser.Math.Vector2(0, 0)

    // 创建摇杆底座
    this.base = scene.add.circle(x, y, this.baseRadius, 0x000000, 0.5)
    
    // 创建摇杆
    this.stick = scene.add.circle(x, y, this.stickRadius, 0x333333, 0.8)
    this.stick.setInteractive()

    // 设置拖拽
    scene.input.setDraggable(this.stick)
    this.setupDragEvents()
  }

  private setupDragEvents() {
    this.scene.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Circle, dragX: number, dragY: number) => {
      if (gameObject !== this.stick) return

      const distance = Phaser.Math.Distance.Between(
        this.base.x, this.base.y,
        dragX, dragY
      )

      if (distance <= this.maxDistance) {
        this.stick.setPosition(dragX, dragY)
      } else {
        const angle = Phaser.Math.Angle.Between(
          this.base.x, this.base.y,
          dragX, dragY
        )
        
        this.stick.setPosition(
          this.base.x + Math.cos(angle) * this.maxDistance,
          this.base.y + Math.sin(angle) * this.maxDistance
        )
      }

      // 计算方向
      this.direction.set(
        this.stick.x - this.base.x,
        this.stick.y - this.base.y
      )
      
      this.onDirectionChange?.(this.direction)
    })

    this.scene.input.on('dragend', () => {
      // 回到中心
      this.stick.setPosition(this.base.x, this.base.y)
      this.direction.set(0, 0)
      this.onDirectionChange?.(this.direction)
    })
  }

  setDirectionChangeCallback(callback: (direction: Phaser.Math.Vector2) => void) {
    this.onDirectionChange = callback
  }

  getDirection(): Phaser.Math.Vector2 {
    return this.direction
  }

  setVisible(visible: boolean) {
    this.base.setVisible(visible)
    this.stick.setVisible(visible)
  }

  destroy() {
    this.base.destroy()
    this.stick.destroy()
  }
} 