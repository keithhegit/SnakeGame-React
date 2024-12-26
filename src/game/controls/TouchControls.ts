import Phaser from 'phaser'

export class TouchControls {
  private scene: Phaser.Scene
  private touchStartPos: Phaser.Math.Vector2
  private swipeThreshold: number = 30
  private swipeTimeThreshold: number = 300
  private touchStartTime: number = 0
  private onSwipe: (direction: string) => void
  private onTap: (position: Phaser.Math.Vector2) => void

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.touchStartPos = new Phaser.Math.Vector2()
    this.setupTouchEvents()
  }

  private setupTouchEvents() {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.touchStartPos.set(pointer.x, pointer.y)
      this.touchStartTime = Date.now()
    })

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const touchEndPos = new Phaser.Math.Vector2(pointer.x, pointer.y)
      const touchDuration = Date.now() - this.touchStartTime

      if (touchDuration < this.swipeTimeThreshold) {
        const deltaX = touchEndPos.x - this.touchStartPos.x
        const deltaY = touchEndPos.y - this.touchStartPos.y
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        if (distance > this.swipeThreshold) {
          // 判断滑动方向
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            this.onSwipe?.(deltaX > 0 ? 'right' : 'left')
          } else {
            this.onSwipe?.(deltaY > 0 ? 'down' : 'up')
          }
        } else {
          // 点击事件
          this.onTap?.(touchEndPos)
        }
      }
    })
  }

  setSwipeCallback(callback: (direction: string) => void) {
    this.onSwipe = callback
  }

  setTapCallback(callback: (position: Phaser.Math.Vector2) => void) {
    this.onTap = callback
  }

  destroy() {
    this.scene.input.off('pointerdown')
    this.scene.input.off('pointerup')
  }
} 