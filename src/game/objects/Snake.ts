import Phaser from 'phaser'

export class Snake {
  private scene: Phaser.Scene
  private body: Phaser.GameObjects.Sprite[]
  private direction: Phaser.Math.Vector2
  private moveTime: number
  private alive: boolean
  private speed: number

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene
    this.body = []
    this.direction = new Phaser.Math.Vector2(40, 0)
    this.moveTime = 0
    this.alive = true
    this.speed = 150
    
    this.createSnake(x, y)
  }

  private createSnake(x: number, y: number) {
    // 创建蛇头
    const head = this.scene.add.sprite(x, y, 'snake-head')
    head.setOrigin(0.5)
    
    // 创建初始蛇身
    const body1 = this.scene.add.sprite(x - 40, y, 'snake-body')
    const body2 = this.scene.add.sprite(x - 80, y, 'snake-body')
    
    this.body = [head, body1, body2]
  }

  update(time: number): boolean {
    if (!this.alive) return false
    
    if (time >= this.moveTime) {
      return this.move(time)
    }
    
    return true
  }

  private move(time: number): boolean {
    const head = this.body[0]
    const newX = head.x + this.direction.x
    const newY = head.y + this.direction.y
    
    if (this.checkCollision(newX, newY)) {
      this.alive = false
      return false
    }
    
    for (let i = this.body.length - 1; i > 0; i--) {
      this.body[i].setPosition(this.body[i - 1].x, this.body[i - 1].y)
    }
    
    head.setPosition(newX, newY)
    this.moveTime = time + this.speed
    
    return true
  }

  private checkCollision(x: number, y: number): boolean {
    const width = this.scene.game.config.width as number
    const height = this.scene.game.config.height as number
    
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return true
    }
    
    return this.body.some((segment, index) => {
      if (index === 0) return false
      return segment.x === x && segment.y === y
    })
  }

  setDirection(direction: Phaser.Math.Vector2) {
    if (this.direction.x !== 0 && direction.x === -this.direction.x) return
    if (this.direction.y !== 0 && direction.y === -this.direction.y) return
    
    this.direction = direction
  }

  grow() {
    const tail = this.body[this.body.length - 1]
    const newSegment = this.scene.add.sprite(tail.x, tail.y, 'snake-body')
    this.body.push(newSegment)
  }

  getHead() {
    return this.body[0]
  }

  destroy() {
    this.body.forEach(segment => segment.destroy())
  }

  reset(x: number, y: number) {
    this.alive = true
    this.direction = new Phaser.Math.Vector2(40, 0)
    
    // 重置位置
    const head = this.body[0]
    head.setPosition(x, y)
    
    // 重置身体
    for (let i = 1; i < this.body.length; i++) {
      this.body[i].setPosition(x - i * 40, y)
    }
  }

  getSprites(): Phaser.GameObjects.Sprite[] {
    return this.body
  }
} 