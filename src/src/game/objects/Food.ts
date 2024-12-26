import Phaser from 'phaser'

export class Food {
  private scene: Phaser.Scene
  private sprite: Phaser.GameObjects.Sprite
  private cellSize: number = 40

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.sprite = scene.add.sprite(0, 0, 'food')
    this.sprite.setOrigin(0.5)
    this.randomizePosition()
  }

  randomizePosition() {
    const width = this.scene.game.config.width as number
    const height = this.scene.game.config.height as number
    
    const gridWidth = Math.floor(width / this.cellSize)
    const gridHeight = Math.floor(height / this.cellSize)
    
    const x = Math.floor(Math.random() * gridWidth) * this.cellSize + this.cellSize / 2
    const y = Math.floor(Math.random() * gridHeight) * this.cellSize + this.cellSize / 2
    
    this.sprite.setPosition(x, y)
  }

  getPosition() {
    return this.sprite.getCenter()
  }

  destroy() {
    this.sprite.destroy()
  }
} 