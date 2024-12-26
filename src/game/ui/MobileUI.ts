import Phaser from 'phaser'

export class MobileUI {
  private scene: Phaser.Scene
  private container: Phaser.GameObjects.Container
  private buttons: Map<string, Phaser.GameObjects.Container>
  private controlHints: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.buttons = new Map()
    this.createUI()
  }

  private createUI() {
    const { width, height } = this.scene.cameras.main.getBounds()
    this.container = this.scene.add.container(0, 0)

    // 创建半透明背景遮罩
    const topBar = this.scene.add.rectangle(
      width / 2,
      30,
      width,
      60,
      0x000000,
      0.3
    )

    // 创建控制区域指示
    this.createControlHints()

    // 创建功能按钮
    this.createGameButtons()

    this.container.add([topBar])
  }

  private createControlHints() {
    const { width, height } = this.scene.cameras.main.getBounds()
    this.controlHints = this.scene.add.container(0, 0)

    // 左侧滑动区域提示
    const leftZone = this.createControlZone(
      width * 0.25,
      height * 0.6,
      'Swipe to Move'
    )

    // 右侧点击区域提示
    const rightZone = this.createControlZone(
      width * 0.75,
      height * 0.6,
      'Tap to Turn'
    )

    this.controlHints.add([leftZone, rightZone])
    this.container.add(this.controlHints)
  }

  private createControlZone(x: number, y: number, text: string) {
    const zone = this.scene.add.container(x, y)
    
    const circle = this.scene.add.circle(0, 0, 80, 0xffffff, 0.1)
    const hint = this.scene.add.text(0, 100, text, {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5)

    // 添加呼吸动画
    this.scene.tweens.add({
      targets: circle,
      scale: { from: 1, to: 1.2 },
      alpha: { from: 0.1, to: 0.05 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    })

    zone.add([circle, hint])
    return zone
  }

  private createGameButtons() {
    const { width } = this.scene.cameras.main.getBounds()

    // 暂停按钮
    this.createButton(
      'pause',
      width - 40,
      40,
      '⏸',
      () => this.scene.events.emit('pause')
    )

    // 其他游戏按钮...
  }

  private createButton(
    key: string,
    x: number,
    y: number,
    icon: string,
    callback: () => void
  ) {
    const button = this.scene.add.container(x, y)
    
    const bg = this.scene.add.circle(0, 0, 25, 0x000000, 0.5)
    const text = this.scene.add.text(0, 0, icon, {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5)

    button.add([bg, text])
    button
      .setInteractive(
        new Phaser.Geom.Circle(0, 0, 25),
        Phaser.Geom.Circle.Contains
      )
      .on('pointerdown', callback)
      .on('pointerover', () => bg.setFillStyle(0x222222, 0.7))
      .on('pointerout', () => bg.setFillStyle(0x000000, 0.5))

    this.buttons.set(key, button)
    this.container.add(button)
  }

  showControlHints() {
    this.controlHints.setAlpha(1)
    this.scene.tweens.add({
      targets: this.controlHints,
      alpha: 0,
      duration: 2000,
      delay: 2000,
      ease: 'Power2'
    })
  }

  destroy() {
    this.container.destroy()
  }
} 