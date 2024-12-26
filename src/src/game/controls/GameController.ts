import Phaser from 'phaser'
import { Snake } from '../objects/Snake'

type KeyboardKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

export class GameController {
  private scene: Phaser.Scene
  private snake: Snake
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd: KeyboardKeys

  constructor(scene: Phaser.Scene, snake: Snake) {
    this.scene = scene
    this.snake = snake
    
    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.wasd = this.scene.input.keyboard.addKeys({
      up: 'W',
      down: 'S',
      left: 'A',
      right: 'D'
    }) as KeyboardKeys

    this.setupKeyboardControls()
  }

  private setupKeyboardControls() {
    this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      let direction = new Phaser.Math.Vector2(0, 0)
      
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          direction.set(0, -40)
          break
        case 'ArrowDown':
        case 'KeyS':
          direction.set(0, 40)
          break
        case 'ArrowLeft':
        case 'KeyA':
          direction.set(-40, 0)
          break
        case 'ArrowRight':
        case 'KeyD':
          direction.set(40, 0)
          break
      }

      if (direction.length() > 0) {
        this.snake.setDirection(direction)
      }
    })
  }

  update() {
    if (this.cursors.up?.isDown || this.wasd.up?.isDown) {
      this.snake.setDirection(new Phaser.Math.Vector2(0, -40))
    }
    else if (this.cursors.down?.isDown || this.wasd.down?.isDown) {
      this.snake.setDirection(new Phaser.Math.Vector2(0, 40))
    }
    else if (this.cursors.left?.isDown || this.wasd.left?.isDown) {
      this.snake.setDirection(new Phaser.Math.Vector2(-40, 0))
    }
    else if (this.cursors.right?.isDown || this.wasd.right?.isDown) {
      this.snake.setDirection(new Phaser.Math.Vector2(40, 0))
    }
  }

  destroy() {
    this.scene.input.keyboard.off('keydown')
  }
} 