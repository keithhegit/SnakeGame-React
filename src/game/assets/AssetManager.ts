import { Scene } from 'phaser'

export class AssetManager {
  private scene: Scene

  constructor(scene: Scene) {
    this.scene = scene
  }

  preloadAll() {
    // 只加载图片资源
    this.scene.load.image('snake-head', '/assets/images/snake-head.png')
    this.scene.load.image('snake-body', '/assets/images/snake-body.png')
    this.scene.load.image('food', '/assets/images/apple.png')
    this.scene.load.image('grid', '/assets/images/grid.png')
    this.scene.load.image('star', '/assets/images/star.png')
  }
} 