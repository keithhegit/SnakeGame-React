export class ErrorHandler {
  static handleError(scene: Phaser.Scene, error: Error) {
    console.error('Game error:', error)

    // 保存当前游戏状态
    const gameState = useGameStore.getState()
    localStorage.setItem('game-error-state', JSON.stringify(gameState))

    // 创建错误提示UI
    const { width, height } = scene.cameras.main.getBounds()
    const container = scene.add.container(width / 2, height / 2)

    const bg = scene.add.rectangle(0, 0, 400, 200, 0x000000, 0.8)
    const text = scene.add.text(0, -40, 'An error occurred', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    const errorText = scene.add.text(0, 0, error.message, {
      fontSize: '16px',
      color: '#ff0000',
      wordWrap: { width: 350 }
    }).setOrigin(0.5)

    const retryButton = scene.add.container(0, 40)
    const buttonBg = scene.add.rectangle(0, 0, 200, 50, 0x333333)
    const buttonText = scene.add.text(0, 0, 'Retry', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5)

    retryButton.add([buttonBg, buttonText])
    retryButton
      .setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        container.destroy()
        scene.scene.start('BootScene')
      })

    container.add([bg, text, errorText, retryButton])
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