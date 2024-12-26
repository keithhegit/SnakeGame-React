import { useGameStore } from '../store/gameStore'

export class ErrorHandler {
  static handleError(scene: Phaser.Scene, error: Error) {
    console.error('Game error:', error)

    // 保存游戏状态
    const gameState = useGameStore.getState()
    localStorage.setItem('game-error-state', JSON.stringify(gameState))

    // 显示错误UI
    this.showErrorUI(scene, error)
  }

  private static showErrorUI(scene: Phaser.Scene, error: Error) {
    const { width, height } = scene.cameras.main.getBounds()
    const container = scene.add.container(width / 2, height / 2)

    // 创建半透明背景
    const bg = scene.add.rectangle(0, 0, width, height, 0x000000, 0.7)
    bg.setPosition(-width/2, -height/2)

    // 创建错误框
    const errorBox = scene.add.rectangle(0, 0, 400, 300, 0x222222, 0.9)
    errorBox.setStrokeStyle(2, 0xff0000)

    // 错误标题
    const title = scene.add.text(0, -100, 'Error Occurred', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    // 错误信息
    const message = scene.add.text(0, -20, error.message, {
      fontSize: '16px',
      color: '#ff0000',
      align: 'center',
      wordWrap: { width: 350 }
    }).setOrigin(0.5)

    // 重试按钮
    const retryButton = this.createButton(scene, 0, 60, 'Retry', () => {
      container.destroy()
      scene.scene.start('BootScene')
    })

    container.add([bg, errorBox, title, message, retryButton])
    
    // 添加动画效果
    container.setScale(0)
    scene.tweens.add({
      targets: container,
      scale: 1,
      duration: 300,
      ease: 'Back.out'
    })
  }

  private static createButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    callback: () => void
  ) {
    const button = scene.add.container(x, y)
    
    const bg = scene.add.rectangle(0, 0, 200, 50, 0x333333)
    const label = scene.add.text(0, 0, text, {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    button.add([bg, label])
    button
      .setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', callback)
      .on('pointerover', () => bg.setFillStyle(0x444444))
      .on('pointerout', () => bg.setFillStyle(0x333333))

    return button
  }

  static getLastErrorState() {
    try {
      const state = localStorage.getItem('game-error-state')
      if (state) {
        localStorage.removeItem('game-error-state')
        return JSON.parse(state)
      }
    } catch {
      return null
    }
  }
} 