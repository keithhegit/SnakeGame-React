import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { GameSettings } from '../services/StorageService'

export default class SettingsScene extends Phaser.Scene {
  private gameStore: typeof useGameStore
  private settingsContainer: Phaser.GameObjects.Container

  constructor() {
    super({ key: 'SettingsScene' })
    this.gameStore = useGameStore
  }

  create() {
    const { width, height } = this.cameras.main.getBounds()
    this.settingsContainer = this.add.container(0, 0)

    // 创建标题
    const title = this.add.text(width / 2, 50, 'Settings', {
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5)

    // 创建设置选项
    const settings = this.gameStore.getState().settings
    const optionsStartY = 150
    const spacing = 60

    // 控制方式选择
    this.createControlTypeSetting(width / 2, optionsStartY, settings)

    // 用户名设置
    this.createUsernameSetting(width / 2, optionsStartY + spacing, settings)

    // 返回按钮
    const backButton = this.add.container(width / 2, height - 100)
    const backBg = this.add.rectangle(0, 0, 200, 50, 0x000000, 0.5)
    const backText = this.add.text(0, 0, 'Back', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    backButton.add([backBg, backText])
    backButton
      .setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => this.scene.start('MainScene'))
      .on('pointerover', () => backBg.setFillStyle(0x222222, 0.7))
      .on('pointerout', () => backBg.setFillStyle(0x000000, 0.5))

    this.settingsContainer.add([title, backButton])
  }

  private createControlTypeSetting(x: number, y: number, settings: GameSettings) {
    const container = this.add.container(x, y)
    
    const label = this.add.text(-150, 0, 'Controls:', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0, 0.5)

    const options = ['keyboard', 'touch', 'joystick']
    const buttons = options.map((type, index) => {
      const button = this.add.container(index * 100 - 50, 0)
      const bg = this.add.rectangle(0, 0, 90, 40, 0x000000, 0.5)
      const text = this.add.text(0, 0, type, {
        fontSize: '20px',
        color: '#ffffff'
      }).setOrigin(0.5)

      button.add([bg, text])
      
      if (settings.controlType === type) {
        bg.setFillStyle(0x00ff00, 0.5)
      }

      button
        .setInteractive(new Phaser.Geom.Rectangle(-45, -20, 90, 40), Phaser.Geom.Rectangle.Contains)
        .on('pointerdown', () => {
          this.gameStore.updateSettings({ controlType: type as GameSettings['controlType'] })
          buttons.forEach(b => b.first.setFillStyle(0x000000, 0.5))
          bg.setFillStyle(0x00ff00, 0.5)
        })

      return button
    })

    container.add([label, ...buttons])
    this.settingsContainer.add(container)
  }

  private createUsernameSetting(x: number, y: number, settings: GameSettings) {
    const container = this.add.container(x, y)
    
    const label = this.add.text(-150, 0, 'Username:', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0, 0.5)

    const input = document.createElement('input')
    input.type = 'text'
    input.value = settings.username
    input.style.position = 'absolute'
    input.style.width = '200px'
    input.style.padding = '8px'
    input.style.fontSize = '16px'

    const inputElement = this.add.dom(50, 0, input)
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      this.gameStore.updateSettings({ username: target.value })
    })

    container.add([label])
    this.settingsContainer.add(container)
  }
} 