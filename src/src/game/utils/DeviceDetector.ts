export class DeviceDetector {
  static isMobile(scene: Phaser.Scene): boolean {
    return scene.game.device.os.android || 
           scene.game.device.os.iOS || 
           scene.game.device.os.iPad ||
           scene.game.device.os.iPhone
  }

  static isTouch(scene: Phaser.Scene): boolean {
    return scene.game.device.input.touch
  }

  static getControlType(scene: Phaser.Scene): 'keyboard' | 'touch' | 'joystick' {
    const { settings } = useGameStore.getState()
    
    // 如果是移动设备但设置了键盘控制，强制使用触摸
    if (this.isMobile(scene) && settings.controlType === 'keyboard') {
      useGameStore.getState().updateSettings({ controlType: 'touch' })
      return 'touch'
    }

    return settings.controlType
  }
} 