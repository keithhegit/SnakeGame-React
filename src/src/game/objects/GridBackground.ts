import { Scene } from 'phaser'

export class GridBackground {
  private scene: Scene
  private graphics: Phaser.GameObjects.Graphics
  private gridSize: number = 40
  private gridColor: number = 0x333333
  private gridAlpha: number = 0.3

  constructor(scene: Scene) {
    this.scene = scene
    this.graphics = scene.add.graphics()
    this.drawGrid()
  }

  private drawGrid() {
    const width = this.scene.game.config.width as number
    const height = this.scene.game.config.height as number

    this.graphics.lineStyle(1, this.gridColor, this.gridAlpha)

    // 绘制垂直线
    for (let x = 0; x <= width; x += this.gridSize) {
      this.graphics.beginPath()
      this.graphics.moveTo(x, 0)
      this.graphics.lineTo(x, height)
      this.graphics.strokePath()
    }

    // 绘制水平线
    for (let y = 0; y <= height; y += this.gridSize) {
      this.graphics.beginPath()
      this.graphics.moveTo(0, y)
      this.graphics.lineTo(width, y)
      this.graphics.strokePath()
    }
  }

  setAlpha(alpha: number) {
    this.gridAlpha = alpha
    this.graphics.clear()
    this.drawGrid()
  }

  destroy() {
    this.graphics.destroy()
  }
} 