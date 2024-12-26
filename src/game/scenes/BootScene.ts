import Phaser from 'phaser'
import { ErrorHandler } from '../utils/ErrorHandler'

export default class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics
  private progressBar: Phaser.GameObjects.Graphics

  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    try {
      this.createLoadingUI()
      
      // 加载基础游戏资源
      const requiredAssets = [
        { key: 'snake-head', path: '/assets/images/snake-head.png' },
        { key: 'snake-body', path: '/assets/images/snake-body.png' },
        { key: 'food', path: '/assets/images/food.png' }
      ]

      // 加载UI资源
      const uiAssets = [
        { key: 'button', path: '/assets/ui/button.png' },
        { key: 'joystick-base', path: '/assets/ui/joystick-base.png' },
        { key: 'joystick-stick', path: '/assets/ui/joystick-stick.png' }
      ]

      // 加载所有资源
      [...requiredAssets, ...uiAssets].forEach(asset => {
        this.load.image(asset.key, asset.path)
      })

      // 添加加载事件监听
      this.load.on('progress', this.updateLoadingBar, this)
      this.load.on('complete', this.onLoadComplete, this)
      this.load.on('loaderror', this.handleLoadError, this)

    } catch (error) {
      ErrorHandler.handleError(this, error as Error)
    }
  }

  private createLoadingUI() {
    const { width, height } = this.cameras.main.getBounds()
    
    // 创建加载背景
    const bg = this.add.rectangle(0, 0, width, height, 0x000000, 0.5)
    
    // 创建加载条背景
    this.loadingBar = this.add.graphics()
    this.loadingBar.fillStyle(0x222222, 0.8)
    this.loadingBar.fillRoundedRect(
      width * 0.1,
      height * 0.45,
      width * 0.8,
      20,
      10
    )

    // 创建进度条
    this.progressBar = this.add.graphics()
    
    // 添加加载文本
    this.add.text(width * 0.5, height * 0.4, 'Loading...', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5)
  }

  private updateLoadingBar(value: number) {
    const { width, height } = this.cameras.main.getBounds()
    
    this.progressBar.clear()
    this.progressBar.fillStyle(0x00ff00, 1)
    this.progressBar.fillRoundedRect(
      width * 0.1,
      height * 0.45,
      width * 0.8 * value,
      20,
      10
    )
  }

  private handleLoadError = (file: { key: string, url: string }) => {
    console.error(`Error loading asset: ${file.key} from ${file.url}`)
    ErrorHandler.handleError(this, new Error(`Failed to load asset: ${file.key}`))
  }

  private onLoadComplete = () => {
    try {
      // 验证必需资源是否加载成功
      const requiredAssets = ['snake-head', 'snake-body', 'food']
      const missingAssets = requiredAssets.filter(key => !this.textures.exists(key))
      
      if (missingAssets.length > 0) {
        throw new Error(`Missing required assets: ${missingAssets.join(', ')}`)
      }

      // 清理加载UI
      this.loadingBar?.destroy()
      this.progressBar?.destroy()

      // 转场动画
      this.cameras.main.fadeOut(500)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TutorialScene')
      })

    } catch (error) {
      ErrorHandler.handleError(this, error as Error)
    }
  }

  private validateAssets() {
    const requiredAssets = [
      // 游戏核心资源
      { key: 'snake-head', type: 'image', path: '/assets/images/snake-head.png' },
      { key: 'snake-body', type: 'image', path: '/assets/images/snake-body.png' },
      { key: 'food', type: 'image', path: '/assets/images/food.png' },
      
      // UI资源
      { key: 'button', type: 'image', path: '/assets/ui/button.png' },
      { key: 'joystick-base', type: 'image', path: '/assets/ui/joystick-base.png' },
      { key: 'joystick-stick', type: 'image', path: '/assets/ui/joystick-stick.png' }
    ]

    // 加载所有资源
    requiredAssets.forEach(asset => {
      if (!this.textures.exists(asset.key)) {
        this.load.image(asset.key, asset.path)
      }
    })

    // 添加加载完成回调
    this.load.on('complete', () => {
      const missingAssets = requiredAssets.filter(
        asset => !this.textures.exists(asset.key)
      )

      if (missingAssets.length > 0) {
        throw new Error(
          `Missing required assets: ${missingAssets.map(a => a.key).join(', ')}`
        )
      }
    })
  }
} 